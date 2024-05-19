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
}

export interface SetSchedule {
  schedule: Schedule
  disableScheduleIdList?: UpdateScheduleDisable[]
}

export interface UpdateScheduleDisable {
  schedule_id: number
}
