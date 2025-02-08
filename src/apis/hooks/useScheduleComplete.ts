import {useMutation, useQuery} from '@tanstack/react-query'
import {
  DeleteScheduleCompleteCardRequest,
  GetScheduleCompleteCardUploadUrlRequest,
  GetScheduleCompleteDetailRequest,
  GetScheduleCompleteCardListRequest,
  SetScheduleCompleteRequest,
  UpdateScheduleCompleteRequest,
  UpdateAttachScheduleCompleteCardRequest
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

export const useGetScheduleCompleteList = (params: GetScheduleCompleteCardListRequest) => {
  return useQuery({
    queryKey: ['getScheduleCompleteList', params.id, params.page],
    queryFn: async () => {
      const response = await scheduleCompleteApi.getScheduleCompleteList(params)

      return response.data
    },
    initialData: {
      total: 0,
      schedule_complete_list: []
    }
  })
}

export const useGetScheduleCompleteCardUploadUrl = () => {
  return useMutation({
    mutationFn: async (params: GetScheduleCompleteCardUploadUrlRequest) => {
      const response = await scheduleCompleteApi.getScheduleCompleteCardUploadUrl(params)

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

export const useUpdateScheduleComplete = () => {
  return useMutation({
    mutationFn: async (params: UpdateScheduleCompleteRequest) => {
      const response = await scheduleCompleteApi.updateScheduleComplete(params)

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
