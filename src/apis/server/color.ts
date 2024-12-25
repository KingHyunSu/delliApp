import http from '@/utils/http'
import {
  DeleteScheduleColorRequest,
  DeleteScheduleColorResponse,
  GetScheduleColorListResponse,
  SetScheduleColorRequest,
  SetScheduleColorResponse
} from '@/apis/types/color'

export const getScheduleColorList = () => {
  return http.get<any, Response<GetScheduleColorListResponse[]>>('color/schedule/list')
}

export const setScheduleColor = (data: SetScheduleColorRequest) => {
  return http.post<any, Response<SetScheduleColorResponse>>('color/schedule', data)
}

export const deleteScheduleColor = (data: DeleteScheduleColorRequest) => {
  return http.post<any, Response<DeleteScheduleColorResponse>>('color/schedule/delete', data)
}
