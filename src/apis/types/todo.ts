export interface GetTodoListByScheduleResponse {
  todo_id: number
  title: string
  complete_id: number | null
  complete_date: string | null
  schedule_id: number
}

export interface GetTodoDetailRequest {
  todo_id: number
}

export interface GetTodoDetailResponse {
  todo_id: number
  title: string
  schedule_id: number
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

export interface DeleteTodoRequest {
  todo_id: number
}

export interface SetTodoCompleteRequest {
  todo_id: number
  complete_date: string
}

export interface DeleteTodoCompleteRequest {
  complete_id: number
}
