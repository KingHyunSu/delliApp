import {useMutation} from '@tanstack/react-query'
import {
  DeleteScheduleCompleteCardRequest,
  GetScheduleCompletePhotoCardUploadUrlRequest,
  GetScheduleCompleteDetailRequest,
  GetScheduleCompleteCardListRequest,
  SetScheduleCompleteRequest,
  UpdateAttachScheduleCompleteCardRequest,
  UpdateScheduleCompleteRecordCardRequest,
  UpdateScheduleCompleteCardRequest
} from '@/apis/types/scheduleComplete'
import * as scheduleCompleteApi from '@/apis/server/scheduleComplete'

export const useGetScheduleCompleteDetail = () => {
  return useMutation({
    mutationFn: async (params: GetScheduleCompleteDetailRequest) => {
      const response = await scheduleCompleteApi.getScheduleCompleteDetail(params)

      return response.data
    }
  })
}

export const useGetScheduleCompleteCardList = () => {
  return useMutation({
    mutationFn: async (params: GetScheduleCompleteCardListRequest) => {
      const response = await scheduleCompleteApi.getScheduleCompleteCardList(params)

      return response.data
    }
  })
}

export const useSetScheduleComplete = () => {
  return useMutation({
    mutationFn: async (params: SetScheduleCompleteRequest) => {
      const response = await scheduleCompleteApi.setScheduleComplete(params)

      return response.data
    }
  })
}

export const useGetScheduleCompletePhotoCardUploadUrl = () => {
  return useMutation({
    mutationFn: async (params: GetScheduleCompletePhotoCardUploadUrlRequest) => {
      const response = await scheduleCompleteApi.getScheduleCompletePhotoCardUploadUrl(params)

      return response.data
    }
  })
}

export const useUpdateScheduleCompleteCard = () => {
  return useMutation({
    mutationFn: async (params: UpdateScheduleCompleteCardRequest) => {
      const response = await scheduleCompleteApi.updateScheduleCompleteCard(params)

      return response.data
    }
  })
}

export const useUpdateScheduleCompleteRecordCard = () => {
  return useMutation({
    mutationFn: async (params: UpdateScheduleCompleteRecordCardRequest) => {
      const response = await scheduleCompleteApi.updateScheduleCompleteRecordCard(params)

      return response.data
    }
  })
}

export const useUpdateAttachScheduleCompleteCard = () => {
  return useMutation({
    mutationFn: async (params: UpdateAttachScheduleCompleteCardRequest) => {
      const response = await scheduleCompleteApi.updateAttachScheduleCompleteCard(params)

      return response.data
    }
  })
}

export const useDeleteScheduleCompleteCard = () => {
  return useMutation({
    mutationFn: async (params: DeleteScheduleCompleteCardRequest) => {
      const response = await scheduleCompleteApi.deleteScheduleCompleteCard(params)

      return response.data
    }
  })
}
