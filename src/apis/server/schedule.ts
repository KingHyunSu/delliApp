import http from '@/utils/http'
import {
  GetCurrentScheduleListRequest,
  GetCurrentScheduleListResponse,
  SetScheduleRequest,
  SetScheduleResponse,
  UpdateScheduleRequest,
  UpdateScheduleResponse,
  GetOverlapScheduleListRequest,
  GetOverlapScheduleListResponse,
  DeleteScheduleRequest,
  DeleteScheduleResponse
} from '@/apis/types/schedule'

export const getCurrentScheduleList = (params: GetCurrentScheduleListRequest) => {
  return http.get<any, Response<GetCurrentScheduleListResponse[]>>('schedule/current/list', {params})
}

export const getOverlapScheduleList = (params: GetOverlapScheduleListRequest) => {
  return http.get<any, Response<GetOverlapScheduleListResponse[]>>('schedule/overlap/list', {params})
}

export const setSchedule = (data: SetScheduleRequest) => {
  return http.post<any, Response<SetScheduleResponse>>('schedule', data)
}

export const updateSchedule = (data: UpdateScheduleRequest) => {
  return http.post<any, Response<UpdateScheduleResponse>>('schedule/update', data)
}

export const deleteSchedule = (data: DeleteScheduleRequest) => {
  return http.post<any, Response<DeleteScheduleResponse>>('schedule/delete', data)
}
