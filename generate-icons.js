import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconDir = path.join(__dirname, 'src-tauri/icons');
const svgPath = path.join(iconDir, 'logo.svg');

// Icon sizes needed
const sizes = [32, 128, 256];

async function generateIcons() {
  try {
    console.log('Generating icons from logo.svg...');
    
    for (const size of sizes) {
      const outputPath = path.join(iconDir, size === 256 ? 'icon.png' : `${size}x${size}.png`);
      await sharp(svgPath)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toFile(outputPath);
      console.log(`✓ Created ${size}x${size}.png`);
    }

    // Create 128x128@2x
    await sharp(svgPath)
      .resize(256, 256, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(iconDir, '128x128@2x.png'));
    console.log('✓ Created 128x128@2x.png');

    console.log('\n✓ All icons generated successfully!');
    console.log('Note: For .ico (Windows) and .icns (Mac), use an online converter or tool like:');
    console.log('- https://icoconvert.com/ (for ico)');
    console.log('- https://cloudconvert.com/ (for icns)');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
