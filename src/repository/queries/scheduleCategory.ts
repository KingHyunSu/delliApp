import {SetScheduleCategory} from '../types/scheduleCategory'

export const getScheduleCategoryListQuery = () => {
  return `SELECT * FROM SCHEDULE_CATEGORY;`
}

export const setScheduleCategory = (params: SetScheduleCategory) => {
  return `INSERT INTO SCHEDULE_CATEGORY (title) VALUES ("${params.title}");`
}
