import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateBook } from '../../businessLogic/books'
import { UpdateBooksRequest } from '../../requests/UpdateBookRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const bookId = event.pathParameters.bookId
    const updatedBook: UpdateBooksRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    await updateBook(bookId, updatedBook, userId);
    return {
      statusCode: 204,
      body: ''
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
