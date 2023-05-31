export interface Book {
  userId: string
  bookId: string
  createdAt: string
  author: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
