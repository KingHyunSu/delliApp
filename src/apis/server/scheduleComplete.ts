import {
  DeleteScheduleCompleteCardRequest,
  DeleteScheduleCompleteCardResponse,
  GetScheduleCompletePhotoCardUploadUrlRequest,
  GetScheduleCompletePhotoCardUploadUrlResponse,
  GetScheduleCompleteDetailRequest,
  GetScheduleCompleteDetailResponse,
  GetScheduleCompleteCardListRequest,
  GetScheduleCompleteCardListResponse,
  SetScheduleCompleteRequest,
  SetScheduleCompleteResponse,
  UpdateAttachScheduleCompleteCardRequest,
  UpdateAttachScheduleCompleteCardResponse,
  UpdateScheduleCompleteRecordCardRequest,
  UpdateScheduleCompleteRecordCardResponse,
  UpdateScheduleCompleteCardRequest,
  UpdateScheduleCompleteCardResponse
} from '@/apis/types/scheduleComplete'
import http from '@/utils/http'

export const getScheduleCompleteDetail = (params: GetScheduleCompleteDetailRequest) => {
  return http.get<any, Response<GetScheduleCompleteDetailResponse>>('schedule/complete', {params})
}

export const setScheduleComplete = (data: SetScheduleCompleteRequest) => {
  return http.post<any, Response<SetScheduleCompleteResponse>>('schedule/complete', data)
}

export const getScheduleCompleteCardList = (params: GetScheduleCompleteCardListRequest) => {
  return http.get<any, Response<GetScheduleCompleteCardListResponse[]>>('schedule/complete/card/list', {params})
}

export const getScheduleCompletePhotoCardUploadUrl = (params: GetScheduleCompletePhotoCardUploadUrlRequest) => {
  return http.get<any, Response<GetScheduleCompletePhotoCardUploadUrlResponse>>(
    'schedule/complete/card/photo/upload/url',
    {
      params
    }
  )
}

export const updateScheduleCompleteCard = (data: UpdateScheduleCompleteCardRequest) => {
  return http.post<any, Response<UpdateScheduleCompleteCardResponse>>('schedule/complete/card/update', data)
}

export const updateScheduleCompleteRecordCard = (data: UpdateScheduleCompleteRecordCardRequest) => {
  return http.post<any, Response<UpdateScheduleCompleteRecordCardResponse>>(
    'schedule/complete/card/record/update',
    data
  )
}

export const updateAttachScheduleCompleteCard = (data: UpdateAttachScheduleCompleteCardRequest) => {
  return http.post<any, Response<UpdateAttachScheduleCompleteCardResponse>>('schedule/complete/card/attach', data)
}

export const deleteScheduleCompleteCard = (data: DeleteScheduleCompleteCardRequest) => {
  return http.post<any, Response<DeleteScheduleCompleteCardResponse>>('schedule/complete/card/delete', data)
}
