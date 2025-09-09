import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// Define common HTTP status codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

// Define common error messages
export enum ErrorMessage {
  INVALID_REQUEST = 'Invalid request',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'Resource not found',
  INTERNAL_ERROR = 'Internal server error',
  METHOD_NOT_ALLOWED = 'Method not allowed',
  VALIDATION_ERROR = 'Validation error'
}

// Define common headers for CORS
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Requested-With'
};

export abstract class BaseHandler {
  abstract handle(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>;

  /**
   * Handle OPTIONS request for CORS preflight
   */
  protected handleOptions(): APIGatewayProxyResult {
    return {
      statusCode: HttpStatus.OK,
      headers: DEFAULT_HEADERS,
      body: ''
    };
  }

  /**
   * Successful response helper
   */
  protected success<T extends Record<string, any>>(
    data: T,
    statusCode: HttpStatus = HttpStatus.OK,
    meta?: Record<string, any>
  ): APIGatewayProxyResult {
    const response: Record<string, any> = {
      success: true,
      data
    };

    if (meta) {
      response.meta = meta;
    }

    return {
      statusCode,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(response, null, 2)
    };
  }

  /**
   * Error response helper
   */
  protected error(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    code?: string,
    details?: any
  ): APIGatewayProxyResult {
    const errorResponse: Record<string, any> = {
      success: false,
      error: {
        message,
        status: statusCode,
        ...(code && { code }),
        ...(details && { details })
      }
    };

    return {
      statusCode,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(errorResponse, null, 2)
    };
  }

  /**
   * Parse request body
   */
  protected parseBody<T = any>(event: APIGatewayProxyEvent): T {
    if (!event.body) {
      throw new Error('Request body is empty');
    }

    try {
      return typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (error) {
      throw new Error('Invalid JSON in request body');
    }
  }

  /**
   * Get path parameters
   */
  protected getPathParams<T = any>(event: APIGatewayProxyEvent): T {
    return (event.pathParameters || {}) as unknown as T;
  }

  /**
   * Get query string parameters
   */
  protected getQueryParams<T = any>(event: APIGatewayProxyEvent): T {
    return (event.queryStringParameters || {}) as unknown as T;
  }

  /**
   * Get request headers
   */
  protected getHeaders(event: APIGatewayProxyEvent): Record<string, string> {
    const headers: Record<string, string> = {};
    if (event.headers) {
      Object.entries(event.headers).forEach(([key, value]) => {
        if (value !== undefined) {
          headers[key] = value;
        }
      });
    }
    return headers;
  }

  /**
   * Get authorization token from headers
   */
  protected getAuthToken(event: APIGatewayProxyEvent): string | null {
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return null;
    }
    
    return parts[1];
  }
}
