import {useMutation, useQuery} from '@tanstack/react-query'
import * as colorApi from '@/apis/server/color'
import {DeleteScheduleColorRequest, SetScheduleColorRequest} from '@/apis/types/color'

export const useGetScheduleColorList = () => {
  return useQuery({
    queryKey: ['scheduleColorList'],
    queryFn: async () => {
      const response = await colorApi.getScheduleColorList()

      return response.data
    },
    initialData: []
  })
}

export const useSetScheduleColor = () => {
  return useMutation({
    mutationFn: async (params: SetScheduleColorRequest) => {
      const response = await colorApi.setScheduleColor(params)

      return response.data
    }
  })
}

export const useDeleteScheduleColor = () => {
  return useMutation({
    mutationFn: async (params: DeleteScheduleColorRequest) => {
      const response = await colorApi.deleteScheduleColor(params)

      return response.data
    }
  })
}
