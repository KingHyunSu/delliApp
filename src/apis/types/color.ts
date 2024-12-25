export interface GetScheduleColorListResponse {
  schedule_color_id: number
  color: string
}

export interface SetScheduleColorRequest {
  color: string
}
export interface SetScheduleColorResponse {
  schedule_color_id: boolean
}

export interface DeleteScheduleColorRequest {
  delete_list: number[]
}
export interface DeleteScheduleColorResponse {
  result: boolean
}
