import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy, Response } from 'aws-serverless-express';
import express from 'express';
import serverless from 'serverless-http';

// Import the Express app from app.ts with .js extension
import app from './app.js';

// Create a new Express app for Lambda
const lambdaApp = express();

// Mount the main app
lambdaApp.use('/', app);

// Create the server
const server = createServer(lambdaApp, undefined, [
  'application/json',
  'application/x-www-form-urlencoded',
  'multipart/form-data',
]);

// Lambda handler function
export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  // Required for AWS Lambda to properly handle binary responses
  event.path = event.path || '';
  event.path = event.path.replace(/^\/api\/v1/, ''); // Remove API version prefix if present
  
  // Handle base path mapping for API Gateway custom domains
  if (event.requestContext && event.requestContext.path) {
    const basePath = event.requestContext.path.split('/').slice(0, 3).join('/');
    if (event.path.startsWith(basePath)) {
      event.path = event.path.substring(basePath.length) || '/';
    }
  }

  // Log the incoming request
  console.log('Incoming event:', JSON.stringify(event));
  
  // Return the response from the server
  return proxy(server, event, context, 'PROMISE').promise;
};

// Export the handler for serverless-http
export const serverlessHandler = serverless(lambdaApp);

// For local development with serverless-offline
export const localHandler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
  // Create a mock context for local development
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Set up the request
  const request: APIGatewayProxyEvent = {
    ...event,
    path: event.path || '/',
    httpMethod: event.httpMethod || 'GET',
    headers: event.headers || {},
    queryStringParameters: event.queryStringParameters || null,
    pathParameters: event.pathParameters || null,
    body: event.body || null,
    isBase64Encoded: event.isBase64Encoded || false,
    requestContext: event.requestContext || {},
    resource: event.resource || '',
    multiValueQueryStringParameters: event.multiValueQueryStringParameters || null,
    multiValueHeaders: event.multiValueHeaders || {},
    stageVariables: event.stageVariables || null,
  };
  
  // Call the handler
  return handler(request, context);
};
