from __future__ import annotations

import json
import posixpath
import re
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(
    path for path in ROOT.rglob("*.html")
    if not {"dist", ".git"}.intersection(path.relative_to(ROOT).parts)
)
EXTERNAL_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.refs: list[dict[str, object]] = []
        self.ids: set[str] = set()
        self.buttons: list[dict[str, object]] = []
        self.forms: list[dict[str, object]] = []
        self.inputs: list[dict[str, object]] = []
        self.labels_for: set[str] = set()
        self._form_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = {key.lower(): value or "" for key, value in attrs}
        line, _ = self.getpos()

        element_id = data.get("id")
        if element_id:
            self.ids.add(element_id)

        if tag == "label" and data.get("for"):
            self.labels_for.add(data["for"])

        for attr in ("href", "src", "action"):
            if attr in data:
                self.refs.append({"tag": tag, "attr": attr, "value": data[attr].strip(), "line": line})

        if tag == "form":
            self._form_depth += 1
            self.forms.append({"line": line, "action": data.get("action", ""), "method": data.get("method", "")})

        if tag in {"input", "textarea", "select"}:
            self.inputs.append(
                {
                    "tag": tag,
                    "line": line,
                    "id": data.get("id", ""),
                    "name": data.get("name", ""),
                    "type": data.get("type", "text").lower(),
                    "aria_label": data.get("aria-label", ""),
                    "title": data.get("title", ""),
                    "inside_form": self._form_depth > 0,
                }
            )

        if tag == "button":
            self.buttons.append(
                {
                    "line": line,
                    "type": data.get("type", "submit").lower(),
                    "aria_label": data.get("aria-label", ""),
                    "title": data.get("title", ""),
                    "inside_form": self._form_depth > 0,
                }
            )

    def handle_endtag(self, tag: str) -> None:
        if tag == "form" and self._form_depth:
            self._form_depth -= 1


def parse_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    return parser


PAGES = {path: parse_page(path) for path in HTML_FILES}


def site_path_for(source: Path, raw_path: str) -> Path:
    decoded = unquote(raw_path).replace("\\", "/")
    if decoded.startswith("/"):
        relative = PurePosixPath(decoded.lstrip("/"))
    else:
        source_dir = PurePosixPath(source.relative_to(ROOT).as_posix()).parent
        relative = PurePosixPath(posixpath.normpath(str(source_dir / decoded)))
    return ROOT.joinpath(*relative.parts)


def resolve_target(source: Path, raw: str) -> tuple[Path | None, str, str]:
    parts = urlsplit(raw)
    if parts.scheme.lower() in EXTERNAL_SCHEMES or parts.netloc:
        return None, parts.fragment, "external"
    if raw.startswith("//"):
        return None, parts.fragment, "external"
    if not parts.path:
        return source, parts.fragment, "same-page"

    target = site_path_for(source, parts.path)
    if target.is_dir() or parts.path.endswith("/"):
        target = target / "index.html"
    elif not target.suffix and not target.exists():
        directory_index = target / "index.html"
        if directory_index.exists():
            target = directory_index
    return target, parts.fragment, "internal"


findings: list[dict[str, object]] = []

for page, parsed in PAGES.items():
    rel = page.relative_to(ROOT).as_posix()
    for ref in parsed.refs:
        raw = str(ref["value"])
        if not raw:
            findings.append({"kind": "empty-reference", "file": rel, **ref})
            continue
        if raw == "#":
            findings.append({"kind": "placeholder-reference", "file": rel, **ref})
            continue

        target, fragment, classification = resolve_target(page, raw)
        if classification == "external" or target is None:
            continue
        if not target.exists():
            findings.append(
                {
                    "kind": "missing-target",
                    "file": rel,
                    **ref,
                    "resolved": target.relative_to(ROOT).as_posix() if target.is_relative_to(ROOT) else str(target),
                }
            )
            continue
        if fragment and target.suffix.lower() == ".html":
            target_parser = PAGES.get(target) or parse_page(target)
            if fragment not in target_parser.ids:
                findings.append(
                    {
                        "kind": "missing-fragment",
                        "file": rel,
                        **ref,
                        "resolved": target.relative_to(ROOT).as_posix(),
                        "fragment": fragment,
                    }
                )

    for control in parsed.inputs:
        if not control["inside_form"] or control["type"] in {"hidden", "submit", "button", "reset"}:
            continue
        control_id = str(control["id"])
        has_label = bool(control["aria_label"] or control["title"] or (control_id and control_id in parsed.labels_for))
        if not has_label:
            findings.append({"kind": "unlabelled-form-control", "file": rel, **control})
        if not control["name"]:
            findings.append({"kind": "unnamed-form-control", "file": rel, **control})

    for form in parsed.forms:
        if form["action"] == "#":
            findings.append({"kind": "placeholder-form-action", "file": rel, **form})


summary: dict[str, int] = {}
for finding in findings:
    kind = str(finding["kind"])
    summary[kind] = summary.get(kind, 0) + 1

print(json.dumps({"pages": len(HTML_FILES), "summary": summary, "findings": findings}, ensure_ascii=False, indent=2))
