import {GetScheduleActivityLogListParams} from '../types/stats'

export const getCategoryStatsListQuery = () => {
  return `
    SELECT
      schedule_id,
      schedule_category_id,
    	title,
    	start_time,
    	end_time,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun,
      start_date,
      end_date
    FROM 
      SCHEDULE
    WHERE
      disabled = '0'
    AND
      deleted = '0'
    ORDER BY update_date desc
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
