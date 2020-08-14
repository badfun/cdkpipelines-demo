import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
// import { Stripe } from 'stripe'

// const stripe = new Stripe('sk_0HA7TRg4Y86YGH7dcV0gBQ4Gge6d3' || '', { apiVersion: '2020-03-02'})

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return {
    body: 'Hello from lambda function',
    statusCode: 200
  }
}