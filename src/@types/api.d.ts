declare interface joinResponse {
  token: string
}

declare interface LoginRequest {
  token: string
  type: string
}

declare interface ReissueRequest {
  token: string
}

declare interface LoginResponse {
  token: string
}

// schedule
declare interface GetScheduleListRequest {
  timetable_category_id: number
  date: string
  mon?: string
  tue?: string
  wed?: string
  thu?: string
  fri?: string
  sat?: string
  sun?: string
}

declare interface GetExistScheduleListRequest {
  start_date: string
  end_date: string
  start_time: number
  end_time: number
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
}

interface disableScheduleId {
  schedule_id: number
}
declare interface SetScheduleRequest {
  schedule: Schedule
  disableScheduleIdList: disableScheduleId[]
}

declare interface SetScheduleTodoCompleteRequest {
  todo_id: number
  complete_date: string
}

declare interface DeleteScheduleTodoCompleteRequest {
  complete_id: number
}
