import {
  DeleteScheduleCompleteCardRequest,
  DeleteScheduleCompleteCardResponse,
  GetScheduleCompleteCardUploadUrlRequest,
  GetScheduleCompleteCardUploadUrlResponse,
  GetScheduleCompleteDetailRequest,
  GetScheduleCompleteDetailResponse,
  GetScheduleCompleteCardListRequest,
  GetScheduleCompleteCardListResponse,
  SetScheduleCompleteRequest,
  SetScheduleCompleteResponse,
  UpdateScheduleCompleteRequest,
  UpdateScheduleCompleteResponse,
  UpdateAttachScheduleCompleteCardRequest,
  UpdateAttachScheduleCompleteCardResponse
} from '@/apis/types/scheduleComplete'
import http from '@/utils/http'

export const getScheduleCompleteDetail = (params: GetScheduleCompleteDetailRequest) => {
  return http.get<any, Response<GetScheduleCompleteDetailResponse>>('schedule/complete', {params})
}

export const getScheduleCompleteList = (params: GetScheduleCompleteCardListRequest) => {
  return http.get<any, Response<GetScheduleCompleteCardListResponse>>('schedule/complete/list', {params})
}

export const getScheduleCompleteCardUploadUrl = (params: GetScheduleCompleteCardUploadUrlRequest) => {
  return http.get<any, Response<GetScheduleCompleteCardUploadUrlResponse>>('schedule/complete/card/upload/url', {
    params
  })
}

export const setScheduleComplete = (data: SetScheduleCompleteRequest) => {
  return http.post<any, Response<SetScheduleCompleteResponse>>('schedule/complete', data)
}

export const updateScheduleComplete = (data: UpdateScheduleCompleteRequest) => {
  return http.post<any, Response<UpdateScheduleCompleteResponse>>('schedule/complete/update', data)
}

export const updateAttachScheduleCompleteCard = (data: UpdateAttachScheduleCompleteCardRequest) => {
  return http.post<any, Response<UpdateAttachScheduleCompleteCardResponse>>('schedule/complete/card/attach', data)
}

export const deleteScheduleCompleteCard = (data: DeleteScheduleCompleteCardRequest) => {
  return http.post<any, Response<DeleteScheduleCompleteCardResponse>>('schedule/complete/delete', data)
}
