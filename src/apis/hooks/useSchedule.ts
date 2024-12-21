import {format} from 'date-fns'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import {focusModeInfoState, scheduleDateState, scheduleState} from '@/store/schedule'
import {isLoadingState} from '@/store/system'
import {useMutation, useQuery} from '@tanstack/react-query'
import {scheduleRepository} from '../local'
import * as scheduleApi from '@/apis/server/schedule'
import {getDayOfWeekKey} from '@/utils/helper'
import {
  DeleteScheduleRequest,
  GetOverlapScheduleListRequest,
  SetScheduleRequest,
  UpdateScheduleRequest
} from '@/apis/types/schedule'
import {isLoginState} from '@/store/user'

export const useGetCurrentScheduleList = () => {
  const isLogin = useRecoilValue(isLoginState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const setIsLoading = useSetRecoilState(isLoadingState)

  return useQuery({
    queryKey: ['scheduleList', scheduleDate],
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

      if (isLogin) {
        const response = await scheduleApi.getCurrentScheduleList(params)

        return response.data
      }
      return await scheduleRepository.getCurrentScheduleList(params)
    },
    initialData: []
  })
}

export const useGetOverlapScheduleList = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (data: GetOverlapScheduleListRequest) => {
      if (isLogin) {
        const response = await scheduleApi.getOverlapScheduleList(data)

        return response.data
      }
      return await scheduleRepository.getOverlapScheduleList(data)
    }
  })
}

export const useSetSchedule = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: SetScheduleRequest) => {
      if (isLogin) {
        return await scheduleApi.setSchedule(params)
      }
      return await scheduleRepository.setSchedule(params)
    }
  })
}

export const useUpdateSchedule = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: UpdateScheduleRequest) => {
      if (isLogin) {
        return await scheduleApi.updateSchedule(params)
      }
      return await scheduleRepository.updateSchedule(params)
    }
  })
}

export const useUpdateScheduleDeleted = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (data: DeleteScheduleRequest) => {
      if (isLogin) {
        return await scheduleApi.deleteSchedule(data)
      }

      return await scheduleRepository.updateScheduleDeleted(data)
    }
  })
}

// --------

export const useSetScheduleComplete = () => {
  const schedule = useRecoilValue(scheduleState)
  const scheduleDate = useRecoilValue(scheduleDateState)

  return useMutation({
    mutationFn: () => {
      if (schedule.schedule_activity_log_id) {
        const params = {
          schedule_activity_log_id: schedule.schedule_activity_log_id
        }

        return scheduleRepository.updateScheduleComplete(params)
      } else {
        const params = {
          schedule_id: schedule.schedule_id!,
          date: format(scheduleDate, 'yyyy-MM-dd')
        }

        return scheduleRepository.setScheduleComplete(params)
      }
    }
  })
}

export const useSetScheduleFocusTime = () => {
  const focusModeInfo = useRecoilValue(focusModeInfoState)
  const scheduleDate = useRecoilValue(scheduleDateState)

  return useMutation({
    mutationFn: () => {
      if (!focusModeInfo) {
        throw new Error('focusModeInfo empty')
      }

      if (focusModeInfo.schedule_activity_log_id) {
        const params = {
          schedule_activity_log_id: focusModeInfo.schedule_activity_log_id,
          active_time: focusModeInfo.seconds
        }

        return scheduleRepository.updateScheduleFocusTime(params)
      } else {
        const params = {
          schedule_id: focusModeInfo.schedule_id,
          active_time: focusModeInfo.seconds,
          date: format(scheduleDate, 'yyyy-MM-dd')
        }

        return scheduleRepository.setScheduleFocusTime(params)
      }
    }
  })
}

export const useGetSearchScheduleList = () => {
  return useQuery({
    queryKey: ['getSearchScheduleList'],
    queryFn: () => {
      return scheduleRepository.getSearchScheduleList()
    },
    initialData: []
  })
}
