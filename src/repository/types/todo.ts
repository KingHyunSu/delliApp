export interface GetTodoList {
  todo_id: number
  date: string
}

export interface SetTodo {
  schedule_id: number
  todo_id?: number | null
  title: string
  start_date: string
  end_date: string | null
  date: string
}

export interface DeleteTodo {
  todo_id: number
}

export interface SetRoutine {
  routine_id: number | null
  title: string
  repeat_complete_type: number // 1: 매일, 2: 이틀, 3: 일주일
  repeat_complete_count: 1 | 2 | 3 | 4 | 5 | 6
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
