declare interface Schedule {
  schedule_id: number | null
  // timetable_category_id: number | null
  start_date: string
  end_date: string
  start_time: number
  end_time: number
  title: string
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
  memo?: string
  disable: string
  schedule_complete_id?: number
  title_x: number
  title_y: number
  title_rotate: number
  background_color: string
  text_color: string
  complete_start_time?: number
  complete_end_time?: number
  todo_list: Todo[]
  schedule_category_id?: number | null
  schedule_category_title?: string
  schedule_activity_log_id: null
  complete_state: number | null
  goal_title: string | null
  active_time: number | null
  complete_count: number | null
  focus_time: number | null
  create_date?: string
  update_date?: string

  alarm?: number | null
}

declare interface ScheduleComplete {
  schedule_id: number
  schedule_complete_id?: number
  complete_date: string
  complete_start_time: number
  complete_end_time: number
}

declare interface ExistSchedule {
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
  schedule_category_title: string
}

declare interface UsedColor {
  color: string
}

declare interface FocusModeInfo {
  schedule_activity_log_id: number | null
  schedule_id: number
  seconds: number
}
