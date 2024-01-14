import http from '@/utils/http'

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

export interface SetScheduleParam {
  schedule: Schedule
  disableScheduleIdList: number[]
}

export const setSchedule = (data: SetScheduleParam) => {
  return http.post<any>('schedule', data)
}

export const updateScheduleDisable = (data: ScheduleDisable) => {
  return http.post<any>('schedule/disable', data)
}

export const setScheduleTodo = (data: Todo) => {
  return http.post<Todo>('schedule/todo', data)
}

export const setScheduleTodoComplete = (data: SetScheduleTodoCompleteRequest) => {
  return http.post<any>('schedule/todo/complete', data)
}

export const deleteScheduleTodoComplete = (data: DeleteScheduleTodoCompleteRequest) => {
  return http.post<any>('schedule/todo/complete/delete', data)
}

export const updateScheduleComplete = (data: ScheduleComplete) => {
  return http.post<any>('schedule/complete', data)
}
