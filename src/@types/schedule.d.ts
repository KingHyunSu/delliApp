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
  font_size: number
  background_color: string
  text_color: string
  complete_start_time?: number
  complete_end_time?: number
  todo_list: ScheduleTodo[]
  routine_list: ScheduleRoutine[]
  schedule_category_id?: number | null
  schedule_category_title?: string
  schedule_activity_log_id: number | null
  active_time: number | null
  complete_state: number | null

  create_date?: string
  update_date?: string

  alarm?: number | null
}

// declare interface IncludeScheduleItem {
//   schedule_id: number
//   schedule_title: string
//   schedule_category_id: number | null
//   schedule_start_time: number
//   schedule_end_time: number
//   schedule_mon: string
//   schedule_tue: string
//   schedule_wed: string
//   schedule_thu: string
//   schedule_fri: string
//   schedule_sat: string
//   schedule_sun: string
//   schedule_start_date: string
//   schedule_end_date: string
// }

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
