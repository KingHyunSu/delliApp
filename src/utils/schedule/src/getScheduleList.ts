import {format} from 'date-fns'
import {getDayOfWeekKey} from '@/utils/helper'
import {scheduleRepository} from '@/repository'

export default async function (date: Date) {
  const targetDate = format(date, 'yyyy-MM-dd')
  const dayOfWeek = getDayOfWeekKey(date.getDay())

  const params = {
    date: targetDate,
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    sat: '',
    sun: '',
    disable: '0'
  }

  if (dayOfWeek) {
    params[dayOfWeek] = '1'
  }

  return await scheduleRepository.getScheduleList(params)
}
