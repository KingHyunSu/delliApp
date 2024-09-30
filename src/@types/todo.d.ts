export interface Routine {
  todo_id: number
  title: string
  start_date: string
  end_date: string
  repeat_complete_type: number // 1: 매일, 2: 이틀, 3: 일주일
  repeat_complete_count: number
  complete_date_list: string[]
}
