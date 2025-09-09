import path from 'path';
import { fileURLToPath } from 'url';
import { addAlias } from 'module-alias';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register module aliases for development
const aliases = {
  '@': path.join(__dirname, 'src'),
  '@config': path.join(__dirname, 'src/config'),
  '@controllers': path.join(__dirname, 'src/controllers'),
  '@interfaces': path.join(__dirname, 'src/interfaces'),
  '@middlewares': path.join(__dirname, 'src/middlewares'),
  '@models': path.join(__dirname, 'src/models'),
  '@routes': path.join(__dirname, 'src/routes'),
  '@services': path.join(__dirname, 'src/services'),
  '@types': path.join(__dirname, 'src/types'),
  '@utils': path.join(__dirname, 'src/utils')
};

// Register aliases
Object.entries(aliases).forEach(([alias, aliasPath]) => {
  addAlias(alias, aliasPath);
});

// This allows TypeScript to detect our aliases
require('module-alias/register');

console.log('Path aliases registered:');
console.log(aliases);
