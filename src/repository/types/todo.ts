export interface GetTodoList {
  todo_id: number
  date: string
}

export interface SetTodo {
  schedule_id: number
  todo_id?: number | null
  title: string
  start_date: string
  end_date: string | null
  date: string
}

export interface DeleteTodo {
  todo_id: number
}

export interface GetRoutineDetailRequest {
  todo_id: number
}

export interface SetRoutineRequest {
  todo_id: number | null
  title: string
  start_date: string
  schedule_id: number
}
