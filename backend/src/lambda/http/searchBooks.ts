import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { findBooksByAuthor } from '../../businessLogic/books'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const books = await findBooksByAuthor(getUserId(event), event.pathParameters.author)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: books
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
