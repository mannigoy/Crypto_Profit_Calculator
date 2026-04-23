import os
from PIL import Image

icon_dir = 'src-tauri/icons'
icon_path = os.path.join(icon_dir, 'icon.png')
output_ico = os.path.join(icon_dir, 'icon.ico')

# Create ICO file from PNG
img = Image.open(icon_path)
img.save(output_ico, format='ICO')

print(f'✓ Created {output_ico}')
