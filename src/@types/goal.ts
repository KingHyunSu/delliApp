export interface Goal {
  goal_id: number | null
  title: string
  end_date: string | null
  active_end_date: number
  state: number
  scheduleList: GoalSchedule[]
}

export interface GoalSchedule {
  goal_schedule_id?: number
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
  focus_time: number | null
  complete_count: number | null
}
