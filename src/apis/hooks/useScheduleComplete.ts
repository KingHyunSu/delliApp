import {useMutation} from '@tanstack/react-query'
import {
  GetScheduleCompleteDetailRequest,
  SetScheduleCompleteRequest,
  UpdateScheduleCompleteRequest
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
