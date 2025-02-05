export interface GetCurrentScheduleListRequest {
  date: string
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
}
export interface GetCurrentScheduleListResponse {
  schedule_id: number
  title: string
  start_time: number
  end_time: number
  start_date: string
  end_date: string
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
  title_x: number
  title_y: number
  title_rotate: number
  font_size: number
  text_align: TextAlign
  text_direction: TextDirection
  background_color: string
  text_color: string
  update_date: string
  schedule_complete_id?: number
  schedule_complete_path?: string
  schedule_complete_memo?: string
  todo_list: ScheduleTodo[]
  routine_list: ScheduleRoutine[]
}

export interface GetOverlapScheduleListRequest {
  schedule_id: number | null
  start_time: number
  end_time: number
  start_date: string
  end_date: string
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
}
export interface GetOverlapScheduleListResponse {
  schedule_id: number
  title: string
  start_time: number
  end_time: number
  start_date: string
  end_date: string
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
}

interface ScheduleForm {
  title: string
  start_time: number
  end_time: number
  start_date: string
  end_date: string
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
  title_x: number
  title_y: number
  title_rotate: number
  font_size: number
  background_color: string
  text_color: string
}

export interface SetScheduleRequest {
  form: ScheduleForm
  disabled_list: number[]
}
export interface SetScheduleResponse {
  schedule_id: number
}

export interface UpdateScheduleRequest {
  form: ScheduleForm
  disabled_list: number[]
  schedule_id: number
}
export interface UpdateScheduleResponse {
  schedule_id: number
}

export interface DeleteScheduleRequest {
  schedule_id: number
}
export interface DeleteScheduleResponse {
  result: boolean
}
