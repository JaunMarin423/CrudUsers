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
- `format`: Format code
- `deploy`: Deploy to AWS
- `remove`: Remove AWS deployment

## 🚀 Production Deployment

1. Set up your production environment variables
2. Build the application:
   ```bash
   npm run build
   ```
3. Deploy to AWS:
   ```bash
   npm run deploy -- --stage production
   ```

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md) to get started.

## 📧 Contact

For questions or feedback, please open an issue or contact the maintainers.

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/crud-users-api.git
   cd crud-users-api
   ```

2. Instalar dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Editar el archivo `.env` con tus configuraciones.

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# API Configuration
API_PREFIX=/api/v1

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/crud_users

# JWT Configuration
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000  # 1 hora en milisegundos
RATE_LIMIT_MAX=100  # 100 peticiones por ventana

# Logging
LOG_LEVEL=info
LOG_FORMAT=dev
```

## Uso

### Desarrollo

```bash
# Ejecutar en modo desarrollo con recarga en caliente
yarn dev
# o
npm run dev
```

### Producción

```bash
# Compilar TypeScript a JavaScript
yarn build
# o
npm run build

# Iniciar servidor en producción
yarn start
# o
npm start
```

## Estructura del Proyecto

```
src/
├── config/           # Configuraciones (base de datos, variables de entorno)
├── controllers/      # Controladores de la aplicación
├── interfaces/       # Interfaces TypeScript
├── middlewares/      # Middlewares (auth, validación, etc.)
├── models/           # Modelos de MongoDB
├── routes/           # Rutas de la API
├── services/         # Lógica de negocio
├── types/            # Tipos personalizados
├── utils/            # Utilidades
├── app.ts            # Aplicación Express
└── server.ts         # Punto de entrada del servidor
```

## API Endpoints

### Autenticación

- `POST /api/v1/auth/register` - Registrar un nuevo usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/logout` - Cerrar sesión
- `GET /api/v1/auth/me` - Obtener perfil del usuario actual

### Usuarios

- `GET /api/v1/users` - Obtener todos los usuarios (con paginación)
- `GET /api/v1/users/:id` - Obtener un usuario por ID
- `PATCH /api/v1/users/:id` - Actualizar un usuario
- `DELETE /api/v1/users/:id` - Eliminar un usuario (borrado lógico)
- `GET /api/v1/users/me` - Obtener perfil del usuario actual

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tuusuario](https://twitter.com/tuusuario) - email@ejemplo.com

Enlace del proyecto: [https://github.com/tuusuario/crud-users-api](https://github.com/tuusuario/crud-users-api)
