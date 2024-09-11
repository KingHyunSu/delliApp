import {GetScheduleActivityLogListParams} from '@/repository/types/stats'

export const getCategoryStatsListQuery = () => {
  return `
    SELECT
      schedule_id,
      schedule_category_id,
    	title,
    	start_time,
    	end_time
    FROM 
      SCHEDULE
    WHERE
      disabled = '0'
    AND
      deleted = '0'
  `
}

export const getScheduleActivityLogListQuery = (params: GetScheduleActivityLogListParams) => {
  return `
    SELECT
      *
    FROM
      SCHEDULE_ACTIVITY_LOG
    WHERE
      date >= "${params.startDate}"
  `
}
