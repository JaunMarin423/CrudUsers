import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { BaseHandler, HttpStatus, ErrorMessage } from '../utils/baseHandler.js';
import { AuthService } from '../services/auth.service.js';

export class AuthHandler extends BaseHandler {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  async handle(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return this.handleOptions();
    }

    try {
      const path = event.path || '';
      const httpMethod = event.httpMethod;

      // Route the request to the appropriate method
      if (httpMethod === 'POST' && path.endsWith('/register')) {
        return await this.register(event);
      } else if (httpMethod === 'POST' && path.endsWith('/login')) {
        return await this.login(event);
      } else if (httpMethod === 'POST' && path.endsWith('/logout')) {
        return await this.logout(event);
      }

      return this.error(ErrorMessage.INVALID_REQUEST, HttpStatus.METHOD_NOT_ALLOWED, 'METHOD_NOT_ALLOWED');
    } catch (error: unknown) {
      console.error('AuthHandler error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return this.error(error.message, HttpStatus.NOT_FOUND, 'NOT_FOUND');
        } else if (error.message.includes('invalid') || error.message.includes('missing')) {
          return this.error(error.message, HttpStatus.BAD_REQUEST, 'INVALID_INPUT');
        } else if (error.message.includes('unauthorized') || error.message.includes('credentials')) {
          return this.error(error.message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
        }
        return this.error(error.message, HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_ERROR');
      }
      
      return this.error(
        ErrorMessage.INTERNAL_ERROR, 
        HttpStatus.INTERNAL_SERVER_ERROR, 
        'INTERNAL_ERROR'
      );
    }
  }

  private async register(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const body = JSON.parse(event.body || '{}');
    const { name, email, password, username, phoneNumber, lastName, motherLastName } = body;

    try {
      const { user, token } = await this.authService.register({
        name,
        email,
        password,
        username,
        phoneNumber,
        lastName,
        motherLastName,
      });

      return this.success({
        success: true,
        data: { user, token },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.error(error.message, 400);
      }
      return this.error('Registration failed', 400);
    }
  }

  private async login(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const body = JSON.parse(event.body || '{}');
    const { identifier, password } = body;

    try {
      const { user, token } = await this.authService.login(identifier, password);
      return this.success({
        success: true,
        data: { user, token },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.error(error.message, 400);
      }
      return this.error('Login failed', 400);
    }
  }

  private async logout(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      // In a real app, you might want to invalidate the token here
      return this.success({
        success: true,
        message: 'Successfully logged out',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.error(error.message, 400);
      }
      return this.error('Logout failed', 400);
    }
  }
}

// Lambda handler function
export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  const authHandler = new AuthHandler();
  return authHandler.handle(event, context);
};
