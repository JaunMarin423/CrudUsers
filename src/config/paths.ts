// Core Node.js modules
import path from 'path';
import { fileURLToPath } from 'url';

// Third-party modules
import moduleAlias from 'module-alias';

// Get the current directory in an ES module compatible way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register module aliases
const aliases = {
  '@': path.join(__dirname, '..'),
  '@config': path.join(__dirname, '..', 'config'),
  '@controllers': path.join(__dirname, '..', 'controllers'),
  '@interfaces': path.join(__dirname, '..', 'interfaces'),
  '@middlewares': path.join(__dirname, '..', 'middlewares'),
  '@models': path.join(__dirname, '..', 'models'),
  '@routes': path.join(__dirname, '..', 'routes'),
  '@services': path.join(__dirname, '..', 'services'),
  '@types': path.join(__dirname, '..', 'types'),
  '@utils': path.join(__dirname, '..', 'utils'),
};

// Register aliases
Object.entries(aliases).forEach(([alias, aliasPath]) => {
  moduleAlias.addAlias(alias, aliasPath);
});

// This allows TypeScript to detect our aliases
import 'module-alias/register';

export default aliases;
