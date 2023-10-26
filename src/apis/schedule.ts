import http from '@/utils/http'
import {Schedule} from '@/types/schedule'

export interface ScheduleListParam {
  timetable_category_id: number
  date: string
  mon?: string
  tue?: string
  wed?: string
  thu?: string
  fri?: string
  sat?: string
  sun?: string
}
export const getScheduleList = (data: ScheduleListParam) => {
  return http.post<Schedule[]>('schedule/list', data)
}

export interface GetScheduleParam {
  schedule_id: number
}
export const getSchedule = (data: GetScheduleParam) => {
  return http.get<Schedule>('schedule', {params: {schedule_id: data.schedule_id}})
}

export interface SetScheduleParam {
  insertSchedue: Schedule
  disableScheduleIdList: number[]
}
export const setSchedule = (data: SetScheduleParam) => {
  return http.post<any>('schedule', data)
}

export const updateScheduleComplete = (data: Schedule) => {
  return http.post<any>('schedule/complete', data)
}
