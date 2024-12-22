export interface GetTodoListByScheduleIdResponse {
  schedule_todo_id: number
  title: string
  complete_date: string | null
  schedule_id: number
}

export interface GetScheduleTodoDetailRequest {
  schedule_todo_id: number
}

export interface GetScheduleTodoDetailResponse {
  schedule_todo_id: number
  title: string
  memo: string
  complete_date: string
  schedule_id: number
}

export interface SetScheduleTodoRequest {
  title: string
  memo: string
  schedule_id: number
}
export interface SetScheduleTodoResponse {
  schedule_todo_id: number
}

export interface UpdateScheduleTodoRequest {
  schedule_todo_id: number
  title: string
  memo: string
}
export interface UpdateScheduleTodoResponse {
  schedule_todo_id: number
}

export interface DeleteScheduleTodoRequest {
  schedule_todo_id: number
}
export interface DeleteScheduleTodoResponse {
  result: boolean
}

export interface CompleteScheduleTodoRequest {
  schedule_todo_id: number
  complete_date: string | null
}
export interface CompleteScheduleTodoResponse {
  result: boolean
}
