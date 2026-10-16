import urllib.request, json, math, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode('utf-8'))
    
    # LatAm country codes
    latam_codes = ['MEX', 'GTM', 'BLZ', 'SLV', 'HND', 'NIC', 'CRI', 'PAN', 'COL', 'VEN', 'GUY', 'SUR', 'GUF', 'ECU', 'PER', 'BRA', 'BOL', 'PRY', 'CHL', 'ARG', 'URY']
    
    paths = []
    
    # Mercator projection
    def project(lon, lat):
        x = (lon + 180) * (1000 / 360)
        lat_rad = lat * math.pi / 180
        mercN = math.log(math.tan((math.pi / 4) + (lat_rad / 2)))
        y = (1000 / 2) - (1000 * mercN / (2 * math.pi))
        return x, y
        
    all_coords = []
    for feature in data['features']:
        if feature['id'] in latam_codes:
            geom = feature['geometry']
            # handle Polygon and MultiPolygon
            coords_list = [geom['coordinates']] if geom['type'] == 'Polygon' else geom['coordinates']
            
            for polygon in coords_list:
                for ring in polygon:
                    path = ''
                    for i, coord in enumerate(ring):
                        x, y = project(coord[0], coord[1])
                        all_coords.append((x, y))
                        cmd = 'M' if i == 0 else 'L'
                        path += f"{cmd}{x:.1f},{y:.1f} "
                    path += 'Z '
                    paths.append(path)
                
    if all_coords:
        min_x = min(c[0] for c in all_coords)
        max_x = max(c[0] for c in all_coords)
        min_y = min(c[1] for c in all_coords)
        max_y = max(c[1] for c in all_coords)
        width = max_x - min_x
        height = max_y - min_y
        scale = 1000 / max(width, height)
        # normalize to 1000x1000 bounding box uniformly
        final_path = ''
        for p in paths:
            tokens = p.split(' ')
            for t in tokens:
                if t.startswith('M') or t.startswith('L'):
                    cmd = t[0]
                    x, y = map(float, t[1:].split(','))
                    # Uniform scaling
                    nx = (x - min_x) * scale
                    ny = (y - min_y) * scale
                    final_path += f"{cmd}{nx:.1f},{ny:.1f} "
                elif t == 'Z':
                    final_path += 'Z '
        
        # Determine actual viewBox for the SVG
        viewBox_width = width * scale
        viewBox_height = height * scale
        
        with open('latam_path.txt', 'w') as f:
            f.write(f"VIEWBOX: 0 0 {viewBox_width:.1f} {viewBox_height:.1f}\n")
            f.write(final_path.strip())
        print('SUCCESS: Created latam_path.txt')
    else:
        print('No coordinates found')
except Exception as e:
    print('ERROR:', e)
