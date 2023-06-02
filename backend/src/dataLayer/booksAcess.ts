import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Book } from '../models/Book'
import { BookUpdate } from '../models/BookUpdate';
var AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

export class BooksAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly booksTable = process.env.TABLE,
        private readonly searchIndex = process.env.SEARCH_INDEX,
    ) { }

    async findBooksByAuthor(userId: string, author: string): Promise<Book[]> {
        const result = await this.docClient
            .query({
                TableName: this.booksTable,
                IndexName: this.searchIndex,
                KeyConditionExpression: 'userId = :userId and searchAuthor = :author',
                ExpressionAttributeValues: {
                    ':userId': userId,
                    ':author': author.toLowerCase()
                }
            })
            .promise()
        return result.Items as Book[]
    }

    async getAllBooksByUserId(userId: string): Promise<Book[]> {
        const result = await this.docClient
            .query({
                TableName: this.booksTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise()
        return result.Items as Book[]
    }

    async createBook(book: Book): Promise<Book> {
        await this.docClient
            .put({
                TableName: this.booksTable,
                Item: book
            })
            .promise()
        return book as Book
    }

    async updateBookByUserIdAndBookId(userId: string, bookId: string, updateData: BookUpdate): Promise<void> {
        await this.docClient
            .update({
                TableName: this.booksTable,
                Key: { userId, bookId },
                ConditionExpression: 'attribute_exists(bookId)',
                UpdateExpression: 'set #author = :author, dueDate = :dueDate, done = :done',
                ExpressionAttributeNames: {
                    '#author': 'author'
                },
                ExpressionAttributeValues: {
                    ':author': updateData.author,
                    ':dueDate': updateData.dueDate,
                    ':done': updateData.done
                }
            })
            .promise();
    }

    async deleteBook(bookId: string, userId: string): Promise<string> {
        await this.docClient
            .delete({
                TableName: this.booksTable,
                Key: { bookId, userId }
            })
            .promise()
        return bookId as string
    }

    async getBookByUserIdAndBookId(userId: string, bookId: string): Promise<Book> {
        const result = await this.docClient
            .query({
                TableName: this.booksTable,
                KeyConditionExpression: 'userId = :userId and bookId = :bookId',
                ExpressionAttributeValues: {
                    ':userId': userId,
                    ':bookId': bookId
                }
            })
            .promise();
        const book = result.Items[0];
        return book as Book;
    }

}
