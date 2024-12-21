export {}

declare global {
  interface ScheduleTodo {
    schedule_todo_id: number
    title: string
    complete_date: string | null
    schedule_id: number
  }
  interface EditTodoForm {
    schedule_todo_id: number | null
    title: string
    memo: string
    complete_date: string | null
    schedule_id: number | null
  }
}
