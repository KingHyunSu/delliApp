export interface GetRoutineListByScheduleResponse {
  schedule_routine_id: number
  title: string
  schedule_routine_complete_id: number | null
  complete_date: string | null
  complete_date_list: string[]
  schedule_id: number
}

export interface GetScheduleRoutineDetailRequest {
  schedule_routine_id: number
}
export interface GetScheduleRoutineDetailResponse {
  schedule_routine_id: number
  title: string
  schedule_id: number
}

export interface SetScheduleRoutineRequest {
  title: string
  schedule_id: number
}
export interface SetScheduleRoutineResponse {
  schedule_routine_id: number
}

export interface UpdateScheduleRoutineRequest {
  schedule_routine_id: number
  title: string
}
export interface UpdateScheduleRoutineResponse {
  schedule_routine_id: number
}

export interface DeleteScheduleRoutineRequest {
  schedule_routine_id: number
}
export interface DeleteScheduleRoutineResponse {
  result: boolean
}

export interface GetScheduleRoutineCompleteListRequest {
  id: number
  start_date: string
  end_date: string
}
export interface GetScheduleRoutineCompleteListResponse {
  complete_date: string
}

export interface CompleteScheduleRoutineRequest {
  schedule_routine_id: number
  complete_date: string
}
export interface CompleteScheduleRoutineResponse {
  schedule_routine_complete_id: number
}

export interface IncompleteScheduleRoutineRequest {
  schedule_routine_complete_id: number
}
export interface IncompleteScheduleRoutineResponse {
  schedule_routine_complete_id: number
}
