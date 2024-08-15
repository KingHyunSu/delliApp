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
