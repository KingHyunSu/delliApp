import http from '@/utils/http'

export const updateScheduleComplete = (data: ScheduleComplete) => {
  return http.post<any, Response<any>>('schedule/complete', data)
}
