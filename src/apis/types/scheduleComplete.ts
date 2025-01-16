export interface GetScheduleCompleteDetailRequest {
  id: number
  date: string
}

export interface GetScheduleCompleteDetailResponse {
  schedule_complete_id: number
  complete_date: string
  start_time: number
  end_time: number
  memo: string
  image_url: string
  schedule_id: number
  schedule_title: string
  complete_count: number
}

export interface SetScheduleCompleteRequest {
  date: string
  start_time: number
  end_time: number
  schedule_id: number
}

export interface UpdateScheduleCompleteRequest {
  schedule_complete_id: number
  memo: string
  image_name: string
}
export interface UpdateScheduleCompleteResponse {
  result: boolean
}
