export interface GetTodoListResponse {
  todo_id: number
  title: string
  complete_date_list: string[]
  schedule_title: string
}

export interface GetRoutineListByScheduleResponse {
  routine_id: number
  title: string
  complete_id: number | null
  complete_date: string | null
  complete_date_list: string[]
  schedule_id: number
}

export interface GetRoutineDetailRequest {
  routine_id: number
}

export interface GetRoutineDetailResponse {
  routine_id: number
  title: string
  schedule_id: number
}

export interface GetRoutineCompleteListRequest {
  routine_id: number
  start_date: string
  end_date: string
}

export interface GetRoutineCompleteListResponse {
  complete_date: string
}

export interface SetRoutineRequest {
  title: string
  schedule_id: number
}

export interface UpdateRoutineRequest {
  routine_id: number
  title: string
}

export interface DeleteRoutineRequest {
  routine_id: number
}

export interface SetRoutineDeleteRequest {
  routine_id: number
  complete_date: string
}

export interface DeleteRoutineDeleteRequest {
  complete_id: number
}
