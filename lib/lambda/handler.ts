import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

// import { v4 as uuidv4 } from 'uuid'

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  // console.log('UUID test: ', uuidv4())

  return {
    body: 'Hello from the lambda function',
    statusCode: 200
  }
}