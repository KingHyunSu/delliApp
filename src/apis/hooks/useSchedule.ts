import {format} from 'date-fns'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import {focusModeInfoState, scheduleDateState, scheduleState} from '@/store/schedule'
import {isLoadingState} from '@/store/system'
import {useMutation, useQuery} from '@tanstack/react-query'
import {scheduleRepository} from '../local'
import * as scheduleApi from '@/apis/server/schedule'
import {getDayOfWeekKey} from '@/utils/helper'
import {UpdateScheduleDisable} from '@/apis/local/types/schedule'
import {EditColorThemeRequest, EditColorThemeResponse} from '@/apis/types/schedule'

export const useGetCurrentScheduleList = () => {
  const scheduleDate = useRecoilValue(scheduleDateState)
  const setIsLoading = useSetRecoilState(isLoadingState)

  return useQuery({
    queryKey: ['scheduleList', scheduleDate],
    queryFn: () => {
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
        sun: '',
        disable: '0'
      }

      if (dayOfWeek) {
        params[dayOfWeek] = '1'
      }

      setIsLoading(false)
      return scheduleRepository.getCurrentScheduleList(params)
    },
    initialData: []
  })
}

export const useSetSchedule = () => {
  return useMutation({
    mutationFn: async (params: Schedule) => {
      if (params.schedule_id) {
        return await scheduleRepository.updateSchedule(params)
      }

      return await scheduleRepository.setSchedule(params)
    }
  })
}

export const useUpdateScheduleDeleted = () => {
  return useMutation({
    mutationFn: (data: ScheduleDisableReqeust) => {
      return scheduleRepository.updateScheduleDeleted(data)
    }
  })
}

export const useUpdateScheduleDisable = () => {
  return useMutation({
    mutationFn: (data: UpdateScheduleDisable) => {
      return scheduleRepository.updateScheduleDisable(data)
    }
  })
}

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

export const useGetExistScheduleList = () => {
  const schedule = useRecoilValue(scheduleState)
  const params = {
    schedule_id: schedule.schedule_id,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
    mon: schedule.mon,
    tue: schedule.tue,
    wed: schedule.wed,
    thu: schedule.thu,
    fri: schedule.fri,
    sat: schedule.sat,
    sun: schedule.sun,
    start_date: schedule.start_date,
    end_date: schedule.end_date
  }

  return useMutation({
    mutationFn: () => {
      return scheduleRepository.getExistScheduleList(params)
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

export const useEditColorTheme = () => {
  return useMutation({
    mutationFn: async (params: EditColorThemeRequest) => {
      const response = await scheduleApi.editColorTheme(params)

      return response.data as EditColorThemeResponse
    }
  })
}
