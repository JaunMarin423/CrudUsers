import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register TypeScript loader
register('ts-node/esm', pathToFileURL('./'));

// Set up module aliases
import moduleAlias from 'module-alias';

// Set up aliases from package.json
moduleAlias.addAliases({
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
});
