import pngToIco from 'png-to-ico';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconDir = path.join(__dirname, 'src-tauri/icons');
const pngPath = path.join(iconDir, 'icon.png');
const icoPath = path.join(iconDir, 'icon.ico');

async function convertToIco() {
  try {
    await pngToIco(pngPath, icoPath);
    console.log('✓ Created icon.ico');
  } catch (error) {
    console.error('Error creating ICO:', error.message);
  }
}

convertToIco();
