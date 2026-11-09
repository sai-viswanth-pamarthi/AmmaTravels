const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetBmw = path.join(__dirname, '..', 'public', 'models', 'bmw-m3-touring');
const targetAudi = path.join(__dirname, '..', 'public', 'models', 'audi-a6-c8');

fs.mkdirSync(targetBmw, { recursive: true });
fs.mkdirSync(targetAudi, { recursive: true });

console.log('Extracting BMW...');
execSync(`tar -xf "c:/Users/saivi/Downloads/2023-bmw-m3-touring/source/FINAL_MODEL_TOURING.zip" -C "${targetBmw.replace(/\\/g, '/')}"`);

console.log('Extracting Audi...');
execSync(`tar -xf "c:/Users/saivi/Downloads/audi-a6-c8-limousine/source/Audi A6 C8 Limousine.zip" -C "${targetAudi.replace(/\\/g, '/')}"`);

// Also copy textures folder if any textures are missing
const bmwTexturesSrc = 'c:/Users/saivi/Downloads/2023-bmw-m3-touring/textures';
if (fs.existsSync(bmwTexturesSrc)) {
  for (const file of fs.readdirSync(bmwTexturesSrc)) {
    const dest = path.join(targetBmw, file);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(path.join(bmwTexturesSrc, file), dest);
    }
  }
}

const audiTexturesSrc = 'c:/Users/saivi/Downloads/audi-a6-c8-limousine/textures';
if (fs.existsSync(audiTexturesSrc)) {
  for (const file of fs.readdirSync(audiTexturesSrc)) {
    const dest = path.join(targetAudi, file);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(path.join(audiTexturesSrc, file), dest);
    }
  }
}

console.log('BMW extracted files count:', fs.readdirSync(targetBmw).length);
console.log('Audi extracted files count:', fs.readdirSync(targetAudi).length);
