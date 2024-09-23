import {GetGoalScheduleListResponse} from '@/repository/types/goal'

export interface Goal {
  goal_id: number | null
  title: string
  end_date: string | null
  active_end_date: number
  state: number
  scheduleList: GetGoalScheduleListResponse[]
}
