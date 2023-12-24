export interface Schedule {
  schedule_id: number | null
  timetable_category_id: number | null
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
  memo: string
  disable: string
  schedule_complete_id?: number
  state: string
  title_x: number
  title_y: number
  title_rotate: number
  background_color: string
  text_color: string
  complete_start_time?: number
  complete_end_time?: number
  alarm: number

  display_type?: string
  screenDisable?: boolean
}

export interface ScheduleDisable {
  schedule_id: number
}

export interface ScheduleComplete {
  schedule_id: number
  schedule_complete_id?: number
  complete_date: string
  complete_start_time: number
  complete_end_time: number
}
