const fs = require('fs');
const path = require('path');

// Define the directories to create
const dirs = [
  'src/config',
  'src/controllers',
  'src/interfaces',
  'src/middlewares',
  'src/models',
  'src/routes',
  'src/services',
  'src/types',
  'src/utils'
];

// Create directories if they don't exist
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
});

// Create index.ts files for each directory to enable path aliases
const indexFiles = [
  'src/config/index.ts',
  'src/controllers/index.ts',
  'src/interfaces/index.ts',
  'src/middlewares/index.ts',
  'src/models/index.ts',
  'src/routes/index.ts',
  'src/services/index.ts',
  'src/types/index.ts',
  'src/utils/index.ts'
];

indexFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '// Auto-generated index file\n');
    console.log(`Created file: ${filePath}`);
  }
});

console.log('Setup complete!');
