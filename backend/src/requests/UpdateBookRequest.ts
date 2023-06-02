/**
 * Fields in a request to update a single item.
 */
export interface UpdateBooksRequest {
  author: string
  dueDate: string
  done: boolean
}