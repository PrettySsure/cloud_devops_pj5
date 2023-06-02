import { BooksAccess } from '../dataLayer/booksAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { Book } from '../models/Book'
import { CreateBookRequest } from '../requests/CreateBookRequest'
import { UpdateBooksRequest } from '../requests/UpdateBookRequest'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const attachmentUtils = new AttachmentUtils()
const booksAccess = new BooksAccess()


export async function findBooksByAuthor(userId: string, author: string): Promise<Book[]> {
    return booksAccess.findBooksByAuthor(userId, author)
}

export async function createBook(newBook: CreateBookRequest, userId: string): Promise<Book> {
    const bookId = uuid.v4()
    const attachmentUrl = attachmentUtils.getAttachmentUrl(bookId)
    const searchAuthor = newBook.author.toLowerCase().replace(/\s/g,'')
    const newItem = {
        userId,
        bookId,
        createdAt: new Date().toISOString(),
        done: false,
        searchAuthor,
        attachmentUrl: attachmentUrl,
        ...newBook
    }
    return await booksAccess.createBook(newItem)
}

export async function updateBook(bookId: string, updateBooksRequest: UpdateBooksRequest, userId: string): Promise<void> {
    const book = await booksAccess.getBookByUserIdAndBookId(userId, bookId);
    await booksAccess.updateBookByUserIdAndBookId(book.userId, book.bookId, {
        author: updateBooksRequest.author,
        done: updateBooksRequest.done,
        dueDate: updateBooksRequest.dueDate,
    });
}

export async function createAttachmentUrl(bookId: string): Promise<string> {
    return attachmentUtils.getUploadUrl(bookId)
}

export async function deleteBook(userId: string, bookId: string): Promise<string> {
    return booksAccess.deleteBook(bookId, userId)
}

export async function getBooksByUserId(userId: string): Promise<Book[]> {
    return booksAccess.getAllBooksByUserId(userId)
}
