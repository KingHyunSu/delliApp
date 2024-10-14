export interface GetScheduleActivityLogListParams {
  startDate: string
}

export interface GetCategoryStatsListResponse {
  schedule_id: number
  schedule_category_id: number
  title: string
  start_time: number
  end_time: number
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
  start_date: string
  end_date: string
}

export interface GetScheduleActivityLogListResponse {
  schedule_activity_log_id: number
  schedule_id: number
  active_time: number
  complete_state: number
  date: string
}
