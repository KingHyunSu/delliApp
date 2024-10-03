declare interface Todo {
  todo_id: number | null
  title: string
  start_date: string
  end_date: string | null
  complete_id: number | null
  complete_date: string | null
  complete_date_List: string[] | null
  schedule_id: number | null
}

declare interface TodoDetail {
  todo_id: number | null
  title: string
  complete_date_List: string[] | null

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
