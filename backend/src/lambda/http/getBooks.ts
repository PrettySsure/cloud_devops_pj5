import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getBooksByUserId } from '../../businessLogic/books'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const items = await getBooksByUserId(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: items
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
