# User Management API (AWS Lambda)

A serverless RESTful API for user management built with Node.js, TypeScript, AWS Lambda, API Gateway, and MongoDB Atlas. The application follows best practices for serverless architecture and includes features like authentication, authorization, and comprehensive error handling.

## ✨ Features

- **Serverless Architecture**: Deployed on AWS Lambda with API Gateway
- **Authentication**: JWT-based authentication with refresh tokens
- **User Management**: Complete CRUD operations for users
- **Validation**: Request validation using express-validator
- **Security**:
  - CORS protection
  - Rate limiting
  - Input sanitization
  - Secure headers
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Logging**: Structured logging with context
- **Type Safety**: Full TypeScript support
- **CI/CD**: Ready for continuous integration and deployment
- **Environment-based Configuration**: Easy configuration management

## 🚀 Prerequisites

- Node.js v18.x or later
- npm v9.x or later or Yarn
- AWS Account with appropriate permissions
- AWS CLI configured with credentials
- MongoDB Atlas or self-hosted MongoDB instance
- Serverless Framework (`npm install -g serverless`)

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crud-users-api
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Copy the example environment file and update the values:
   ```bash
   cp .env.example .env
   ```

4. Install dependencies and start the development server:
   ```bash
   # Install tsx globally and project dependencies
   npm install -g tsx
   npm install --legacy-peer-deps
   
   # Start the development server
   npx tsx src/server.ts
   ```

4. Update the `.env` file with your configuration:
   - Set up MongoDB connection string
   - Configure JWT secret and expiration
   - Add AWS credentials and region
   - Set up Cognito User Pool ID and Client ID

## 🚀 Deployment

### Local Development

Start the local development server:

```bash
npm run dev
# or
yarn dev
```

### AWS Deployment

1. Deploy to AWS:
   ```bash
   npm run deploy
   # or
   yarn deploy
   ```

2. Deploy to a specific stage:
   ```bash
   npm run deploy -- --stage staging
   # or
   yarn deploy --stage staging
   ```

3. Deploy a single function:
   ```bash
   serverless deploy function -f functionName
   ```

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh-token` - Refresh access token

### Users
- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `PUT /users/:id` - Update user (protected)
- `DELETE /users/:id` - Delete user (protected)

### Profile
- `GET /me` - Get current user profile (protected)
- `PUT /me` - Update current user profile (protected)

## 🔒 Authentication

All protected endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## 🛡️ Security

- JWT tokens with expiration
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation
- Secure HTTP headers
- Environment-based configuration

## 📝 Environment Variables

Copy `.env.example` to `.env` and update the values:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/crud_users

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# AWS
AWS_ACCOUNT_ID=your_aws_account_id
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# Cognito
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id
COGNITO_CLIENT_SECRET=your_client_secret
```

## 🧪 Testing

Run tests:

```bash
npm test
# or
yarn test
```

## 📦 Scripts

- `dev`: Start development server
- `build`: Build the application
- `start`: Start production server
- `test`: Run tests
- `lint`: Run linter
npm run dev

# Build for production / Compilar para producción
npm run build

# Start production server / Iniciar servidor en producción
npm start
```

## API Endpoints / Puntos de Acceso

### Authentication / Autenticación

- `POST /api/v1/auth/register` - Register new user / Registrar nuevo usuario
- `POST /api/v1/auth/login` - Login / Iniciar sesión
- `GET /api/v1/auth/me` - Get current user profile / Obtener perfil del usuario actual
- `POST /api/v1/auth/refresh-token` - Refresh access token / Renovar token de acceso
- `POST /api/v1/auth/logout` - Logout / Cerrar sesión

### Users / Usuarios

- `GET /api/v1/users` - Get all users (admin) / Obtener todos los usuarios (admin)
- `GET /api/v1/users/:id` - Get user by ID / Obtener usuario por ID
- `PATCH /api/v1/users/:id` - Update user / Actualizar usuario
- `DELETE /api/v1/users/:id` - Delete user (admin) / Eliminar usuario (admin)

## Deployment / Despliegue

This project is configured to deploy on [Render](https://render.com).

Este proyecto está configurado para desplegarse en [Render](https://render.com).

1. Click the "Deploy to Render" button at the top of this README
2. Connect your GitHub repository
3. Set up environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_uri`
   - `JWT_SECRET=your_jwt_secret`
   - `JWT_EXPIRES_IN=30d`
   - `CLIENT_URL=your_frontend_url`

1. Haz clic en el botón "Deploy to Render" al inicio de este README
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno:
   - `NODE_ENV=production`
   - `MONGODB_URI=tu_uri_de_mongodb`
   - `JWT_SECRET=tu_clave_secreta_jwt`
   - `JWT_EXPIRES_IN=30d`
   - `CLIENT_URL=tu_url_frontend`

## Project Structure / Estructura del Proyecto

```
src/
├── config/           # Configurations / Configuraciones
├── controllers/      # Route controllers / Controladores de rutas
├── handlers/         # Route handlers / Manejadores de rutas
├── interfaces/       # TypeScript interfaces / Interfaces TypeScript
├── middlewares/      # Express middlewares / Middlewares de Express
├── models/           # MongoDB models / Modelos de MongoDB
├── routes/           # API routes / Rutas de la API
├── services/         # Business logic / Lógica de negocio
├── types/            # Custom types / Tipos personalizados
└── utils/            # Utility functions / Funciones de utilidad
```

## Environment Variables / Variables de Entorno

| Variable | Description / Descripción | Default / Valor por defecto |
|----------|--------------------------|----------------------|
| NODE_ENV | Application environment / Entorno de la aplicación | development |
| PORT | Server port / Puerto del servidor | 5000 |
| MONGODB_URI | MongoDB connection string / Cadena de conexión a MongoDB | - |
| JWT_SECRET | Secret key for JWT / Clave secreta para JWT | - |
| JWT_EXPIRES_IN | JWT expiration time / Tiempo de expiración del JWT | 30d |
| CLIENT_URL | Client URL for CORS / URL del cliente para CORS | http://localhost:3000 |

## Contributing / Contribución

Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md) first.

¡Las contribuciones son bienvenidas! Por favor lee la [guía de contribución](CONTRIBUTING.md) primero.

## License / Licencia

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.
