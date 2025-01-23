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
  main_image_url: string
  thumb_image_url: string
  schedule_id: number
  complete_count: number
}

export interface SetScheduleCompleteRequest {
  date: string
  start_time: number
  end_time: number
  schedule_id: number
}
export interface SetScheduleCompleteResponse {
  schedule_complete_id: number
  complete_count: number
}

export interface UpdateScheduleCompleteRequest {
  schedule_complete_id: number
  complete_date: string
  memo: string
  image_name: string | null
}
export interface UpdateScheduleCompleteResponse {
  main_image_url: string
  thumb_image_url: string
}
