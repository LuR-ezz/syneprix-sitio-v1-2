from PIL import Image

def remove_background(img_path, out_path, bg_color=(229, 229, 229), tolerance=30):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Check if pixel is within tolerance of bg_color
        if (abs(item[0] - bg_color[0]) < tolerance and 
            abs(item[1] - bg_color[1]) < tolerance and 
            abs(item[2] - bg_color[2]) < tolerance):
            # Change to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(out_path)
    print(f"Saved {out_path}")

try:
    # Use a generic gray (around 229,229,229) with a good tolerance to remove the studio background
    remove_background('curso_automatizacion.png', 'curso_automatizacion_transparent.png', bg_color=(229, 229, 229), tolerance=40)
    remove_background('curso_transformacion.png', 'curso_transformacion_transparent.png', bg_color=(229, 229, 229), tolerance=40)
except Exception as e:
    print("Error:", e)
