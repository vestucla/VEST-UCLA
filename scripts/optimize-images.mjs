import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public/images');

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') return;
  
  const originalSize = (await fs.stat(filePath)).size;
  const webpPath = filePath.replace(new RegExp(ext + '$', 'i'), '.webp');
  
  console.log(`Processing: ${filePath}`);
  
  await sharp(filePath)
    .resize(1600, null, { withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(webpPath);
    
  const newSize = (await fs.stat(webpPath)).size;
  console.log(`Saved: ${webpPath} (${(originalSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB)`);
  
  await fs.unlink(filePath); // delete original
}

async function walkDir(dir) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await walkDir(filePath);
    } else {
      await optimizeImage(filePath);
    }
  }
}

async function run() {
  await walkDir(publicDir);
  console.log('Done!');
}

run().catch(console.error);
