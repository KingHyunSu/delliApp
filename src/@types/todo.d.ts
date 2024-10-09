declare interface Todo {
  todo_id: number
  title: string
  complete_id: number | null
  complete_date: string | null
  schedule_id: number | null
}

declare interface Routine {
  todo_id: number
  title: string
  complete_id: number | null
  complete_date: string | null
  complete_date_list: string[]
  schedule_id: number
}

declare type RoutineListItem = Omit<Routine, 'complete_id' | 'complete_date'> & IncludeScheduleItem

declare interface TodoDetail {
  todo_id: number | null
  title: string

  schedule_id: number | null
  schedule_title: string | null
  schedule_category_id: number | null
  schedule_start_time: number | null
  schedule_end_time: number | null
  schedule_mon: string | null
  schedule_tue: string | null
  schedule_wed: string | null
  schedule_thu: string | null
  schedule_fri: string | null
  schedule_sat: string | null
  schedule_sun: string | null
  schedule_start_date: string | null
  schedule_end_date: string | null
}

declare interface TodoComplete {
  complete_date: string
}
