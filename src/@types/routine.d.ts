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

export interface RoutineDetail {
  routine_id: number
  title: string
  routine_type: number
  routine_count: number
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
  complete_date_list: string[]
}
