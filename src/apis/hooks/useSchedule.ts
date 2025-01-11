import {format} from 'date-fns'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import {scheduleDateState} from '@/store/schedule'
import {isLoadingState, loginState} from '@/store/system'
import {useMutation, useQuery} from '@tanstack/react-query'
import * as scheduleApi from '@/apis/server/schedule'
import {getDayOfWeekKey} from '@/utils/helper'
import {
  DeleteScheduleRequest,
  GetOverlapScheduleListRequest,
  SetScheduleRequest,
  UpdateScheduleRequest
} from '@/apis/types/schedule'

export const useGetCurrentScheduleList = () => {
  const isLogin = useRecoilValue(loginState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const setIsLoading = useSetRecoilState(isLoadingState)
  const formatDate = format(scheduleDate, 'yyyy-MM-dd')

  return useQuery({
    queryKey: ['scheduleList', formatDate],
    queryFn: async () => {
      setIsLoading(true)

      const targetDate = format(scheduleDate, 'yyyy-MM-dd')
      const dayOfWeek = getDayOfWeekKey(scheduleDate.getDay())

      const params = {
        date: targetDate,
        mon: '',
        tue: '',
        wed: '',
        thu: '',
        fri: '',
        sat: '',
        sun: ''
      }

      if (dayOfWeek) {
        params[dayOfWeek] = '1'
      }

      setIsLoading(false)

      const response = await scheduleApi.getCurrentScheduleList(params)

      return response.data
    },
    enabled: isLogin,
    initialData: []
  })
}

export const useGetOverlapScheduleList = () => {
  return useMutation({
    mutationFn: async (data: GetOverlapScheduleListRequest) => {
      const response = await scheduleApi.getOverlapScheduleList(data)

      return response.data
    }
  })
}

export const useSetSchedule = () => {
  return useMutation({
    mutationFn: async (params: SetScheduleRequest) => {
      const response = await scheduleApi.setSchedule(params)

      return response.data
    }
  })
}

export const useUpdateSchedule = () => {
  return useMutation({
    mutationFn: async (params: UpdateScheduleRequest) => {
      const response = await scheduleApi.updateSchedule(params)

      return response.data
    }
  })
}

export const useUpdateScheduleDeleted = () => {
  return useMutation({
    mutationFn: async (data: DeleteScheduleRequest) => {
      return await scheduleApi.deleteSchedule(data)
    }
  })
}
