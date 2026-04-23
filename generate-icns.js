import pkg from '@fiahfy/icns';
const { ICNS } = pkg;
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconDir = path.join(__dirname, 'src-tauri/icons');
const pngPath = path.join(iconDir, 'icon.png');
const icnsPath = path.join(iconDir, 'icon.icns');

async function convertToIcns() {
  try {
    const icns = new ICNS();
    
    // Read the PNG file
    const pngBuffer = readFileSync(pngPath);
    
    // Add the image to the ICNS (256x256)
    icns.append({
      width: 256,
      height: 256,
      buffer: pngBuffer
    });
    
    // Generate and write the ICNS file
    const icnsBuffer = icns.build();
    writeFileSync(icnsPath, icnsBuffer);
    
    console.log('✓ Created icon.icns');
  } catch (error) {
    console.error('Error creating ICNS:', error.message);
  }
}

convertToIcns();
