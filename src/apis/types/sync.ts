export interface GetScheduleListResponse {
  schedule_id: number
  title: string
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
  title_x: number
  title_y: number
  title_rotate: number
  font_size: number
  background_color: string
  text_color: string
  deleted: string
  disabled: string
  deleted_date: string
  disabled_date: string
  create_date: string
  update_date: string
}

export interface GetScheduleTodoListResponse {
  schedule_todo_id: number
  title: string
  memo: string
  complete_date: string
  schedule_id: number
}

export interface GetRoutineListResponse {
  routine_id: number
  title: string
  end_date: string
  schedule_id: number
}

export interface GetRoutineCompleteListResponse {
  complete_id: number
  complete_date: string
  routine_id: number
}
