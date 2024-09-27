import {GoalSchedule} from '@/@types/goal'

export interface GetGoalResponse {
  goal_id: number
  title: string
  start_date: string | null
  end_date: string | null
  active_end_date: number
  state: number
  total_focus_time: number | null
  total_complete_count: number | null
  activity_focus_time: number | null
  activity_complete_count: number | null
}

export interface GetGoalDetailRequest {
  goal_id: number
}

export interface GetGoalScheduleListRequest {
  goal_id: number
  start_date: number | null
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

export interface DeleteGoalDetailRequest {
  goal_id: number
}
