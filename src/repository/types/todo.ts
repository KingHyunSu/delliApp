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

export interface SetTodoRequest {
  title: string
  start_date: string
  end_date: string
  schedule_id: number
}

export interface UpdateTodoRequest {
  todo_id: number
  title: string
}

export interface GetRoutineDetailRequest {
  todo_id: number
}

export interface GetRoutineCompleteListRequest {
  todo_id: number
  startDate: string
}

export interface SetRoutineRequest {
  todo_id: number | null
  title: string
  start_date: string
  schedule_id: number
}
