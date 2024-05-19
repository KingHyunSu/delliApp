export interface GetTodoList {
  todo_id: number
}

export interface SetTodo {
  schedule_id: number
  todo_id?: number | null
  title: string
  start_date: string
  end_date: string | null
}

export interface DeleteTodo {
  todo_id: number
}
