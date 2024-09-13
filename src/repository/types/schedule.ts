export interface GetScheduleList {
  date: string
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
  disable: string
}

export interface GetExistScheduleList {
  schedule_id: number | null
  start_time: number
  end_time: number
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
  start_date: string
  end_date: string
}

export interface SetSchedule {
  schedule: Schedule
}

export interface UpdateScheduleDisable {
  schedule_id: number
}

export interface UpdateScheduleDeleted {
  schedule_id: number
}

export interface SetScheduleCompleteParams {
  schedule_id: number
  date: string
}

export interface UpdateScheduleCompleteParams {
  schedule_activity_log_id: number
}

export interface SetScheduleFocusTimeParams {
  schedule_id: number
  active_time: number
  date: string
}

export interface UpdateScheduleFocusTimeParams {
  schedule_activity_log_id: number
  active_time: number
}
