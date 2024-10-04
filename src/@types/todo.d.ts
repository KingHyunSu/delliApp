declare interface Todo {
  todo_id: number | null
  title: string
  start_date: string
  end_date: string | null
  complete_id: number | null
  complete_date: string | null
  complete_date_list: string[] | null
  schedule_id: number | null
}

declare interface Routine {
  todo_id: number
  title: string
  complete_date_list: string[] | null

  schedule_id: number
  schedule_title: string
  schedule_category_id: number | null
  schedule_start_time: number
  schedule_end_time: number
  schedule_mon: string
  schedule_tue: string
  schedule_wed: string
  schedule_thu: string
  schedule_fri: string
  schedule_sat: string
  schedule_sun: string
  schedule_start_date: string
  schedule_end_date: string
}

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
