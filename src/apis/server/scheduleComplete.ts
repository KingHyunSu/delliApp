import {
  GetScheduleCompleteDetailRequest,
  GetScheduleCompleteDetailResponse,
  SetScheduleCompleteRequest,
  UpdateScheduleCompleteRequest,
  UpdateScheduleCompleteResponse
} from '@/apis/types/scheduleComplete'
import http from '@/utils/http'

export const getScheduleCompleteDetail = (params: GetScheduleCompleteDetailRequest) => {
  return http.get<any, Response<GetScheduleCompleteDetailResponse>>('schedule/complete', {params})
}

export const setScheduleComplete = (data: SetScheduleCompleteRequest) => {
  return http.post<any, Response<GetScheduleCompleteDetailResponse>>('schedule/complete', data)
}

export const updateScheduleComplete = (data: UpdateScheduleCompleteRequest) => {
  return http.post<any, Response<UpdateScheduleCompleteResponse>>('schedule/complete/update', data)
}
