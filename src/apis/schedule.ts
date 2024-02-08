import http from '@/utils/http'

export const getScheduleList = (data: GetScheduleListRequest) => {
  return http.post<Schedule[]>('schedule/list', data)
}

export const getExistScheduleList = (data: GetExistScheduleListRequest) => {
  return http.post<ExistSchedule[]>('schedule/exist/list', data)
}

export const setSchedule = (data: SetScheduleRequest) => {
  return http.post<any>('schedule', data)
}

export const setScheduleTodo = (data: Todo) => {
  return http.post<Todo>('schedule/todo', data)
}

export const deleteScheduleTodo = (data: DeleteScheduleTodoReqeust) => {
  return http.post<Todo>('schedule/todo/delete', data)
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
