export interface Routine {
  routine_id: number
  title: string
  routine_type: number // 1: 매일, 2: 이틀, 3: 일주일
  routine_count: number
  complete_date_list: string[]
}

export interface EditRoutineForm {
  routine_id: number | null
  title: string
  routine_type: number // 1: 매일, 2: 이틀, 3: 일주일
  routine_count: number
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
