import http from '@/utils/http'
import {TimeTableCategory} from '@/types/timetable'

export const getTimetableCategoryList = () => {
  return http.get<TimeTableCategory[]>('/timetable/category/list')
}

export const getTimetableCategory = () => {
  return http.get<TimeTableCategory>('/timetable/category')
}

export const setTimetableCategory = (data: TimeTableCategory) => {
  return http.post<TimeTableCategory>('/timetable/category', data)
}

export const deleteTimetableCategory = (data: TimeTableCategory) => {
  return http.post<TimeTableCategory>('/timetable/category/delete', data)
}
