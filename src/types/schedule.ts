export interface Schedule {
  schedule_id: number
  timetable_category_id: number
  start_date: string
  end_date: string
  start_time: number
  end_time: number
  title: string
  memo: string
  alram: boolean
  color: string
}

export type TimeFlag = 'START' | 'END'
