#!/usr/bin/env bash
set -eu

rm -rf dist
mkdir -p dist

cp index.html 404.html dist/

for directory in \
  assets aula certificaciones components contacto convenios cookies cursos empresas \
  js login nosotros privacidad recuperar-password rutas terminos; do
  cp -R "$directory" dist/
done

find dist -type f -name '*.py' -delete

test -f dist/index.html
test -f dist/404.html
