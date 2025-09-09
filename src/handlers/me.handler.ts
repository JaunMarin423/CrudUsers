import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { BaseHandler, HttpStatus, ErrorMessage } from '../utils/baseHandler.js';
import { UserService } from '../services/user.service.js';

export class MeHandler extends BaseHandler {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  async handle(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return this.handleOptions();
    }

    try {
      if (event.httpMethod === 'GET') {
        return await this.getCurrentUser(event);
      }

      return this.error(ErrorMessage.METHOD_NOT_ALLOWED, HttpStatus.METHOD_NOT_ALLOWED, 'METHOD_NOT_ALLOWED');
    } catch (error: unknown) {
      console.error('MeHandler error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return this.error(error.message, HttpStatus.NOT_FOUND, 'NOT_FOUND');
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

  private async getCurrentUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      // Get user ID from the authorizer context (set by API Gateway)
      const userId = event.requestContext?.authorizer?.principalId;
      
      if (!userId) {
        return this.error('Unauthorized', 401);
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        return this.error('User not found', 404);
      }

      return this.success({
        success: true,
        data: user,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.error(error.message, HttpStatus.BAD_REQUEST, 'BAD_REQUEST');
      }
      return this.error(
        ErrorMessage.INTERNAL_ERROR, 
        HttpStatus.INTERNAL_SERVER_ERROR, 
        'INTERNAL_ERROR'
      );
    }
  }
}

// Lambda handler function
export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  const meHandler = new MeHandler();
  return meHandler.handle(event, context);
};
