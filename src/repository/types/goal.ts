import {GoalSchedule} from '@/@types/goal'

export interface GetGoalResponse {
  goal_id: number
  title: string
  start_date: string | null
  end_date: string | null
  active_end_date: number
  state: number
  focus_time_state: number
  complete_state: number
  total_focus_time: number
  total_complete_count: number
}

export interface GetGoalDetailRequest {
  goal_id: number
}

export interface SetGoalDetailParams {
  goal_id: number | null
  title: string
  start_date: string | null
  end_date: string | null
  active_end_date: number | null
  insertedList: GoalSchedule[]
  updatedList: GoalSchedule[]
  deletedList: GoalSchedule[]
}
