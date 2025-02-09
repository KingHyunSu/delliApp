export interface GetScheduleCompleteDetailRequest {
  id: number
  date: string
}

export interface GetScheduleCompleteDetailResponse {
  schedule_complete_id: number
  complete_date: string
  start_time: number
  end_time: number
  file_name: string
  record: string
  schedule_id: number
  complete_count: number
  main_path: string
  thumb_path: string
  total: number
}

export interface GetScheduleCompleteCardListRequest {
  id: number
  page: number
}
export interface GetScheduleCompleteCardListResponse {
  schedule_complete_id: number
  record: string
  main_path: string
  thumb_path: string
}

export interface GetScheduleCompletePhotoCardUploadUrlRequest {
  name: string
}
export interface GetScheduleCompletePhotoCardUploadUrlResponse {
  main_url: string
  thumb_url: string
  timetable_url: string
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
  record: string
  file_name: string | null
}
export interface UpdateScheduleCompleteResponse {
  main_path: string
  thumb_path: string
  timetable_path: string
  record: string
}

export interface UpdateScheduleCompleteRecordCardRequest {
  schedule_complete_id: number
  record: string
}
export interface UpdateScheduleCompleteRecordCardResponse {
  result: boolean
}

export interface UpdateAttachScheduleCompleteCardRequest {
  schedule_complete_id: number
  x: number
  y: number
}
export interface UpdateAttachScheduleCompleteCardResponse {
  result: boolean
}

export interface DeleteScheduleCompleteCardRequest {
  schedule_complete_id: number
}

export interface DeleteScheduleCompleteCardResponse {
  result: boolean
}
