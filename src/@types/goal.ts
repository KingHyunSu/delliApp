export interface Goal {
  goal_id: number | null
  title: string
  start_date: string | null
  end_date: string | null
  active_end_date: number
  state: number
  scheduleList: GoalSchedule[]
}

export interface GoalSchedule {
  goal_schedule_id: number | null
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
  total_focus_time: number | null
  total_complete_count: number | null
  activity_focus_time: number | null
  activity_complete_count: number | null
}
