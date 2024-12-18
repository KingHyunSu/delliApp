declare interface Response<T> {
  code: String
  data: T
}

declare interface ReissueRequest {
  token: string
}

declare interface LoginResponse {
  token: string
}

declare interface ScheduleDisableReqeust {
  schedule_id: number
}
