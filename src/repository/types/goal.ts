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
