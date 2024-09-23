export interface GetGoalResponse {
  goal_id: number
  title: string
  end_date: string
  state: number
  focus_time_state: number
  complete_state: number
  total_focus_time: number
  total_complete_count: number
}

export interface GetGoalDetailRequest {
  goal_id: number
}

export interface GetGoalDetailResponse {
  goal_id: number
  title: string
  end_date: string
  state: number
}

export interface GetGoalScheduleListResponse {
  focus_time: number | null
  complete_count: number | null
  schedule_category_id: number | null
  schedule_id: number
  title: string
  start_time: number
  end_time: number
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
  start_date: string
  end_date: string
}
