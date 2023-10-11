import {atom} from 'recoil'
import {Schedule, TimeFlag} from '@/types/schedule'

export const scheduleDateState = atom<Date>({
  key: 'scheduleDateState',
  default: new Date()
})

export const scheduleListState = atom<Schedule[]>({
  key: 'scheduleListState',
  default: []
})

export const scheduleState = atom<Schedule>({
  key: 'scheduleState',
  default: {
    schedule_id: null,
    timetable_category_id: null,
    start_date: '',
    end_date: '9999-12-31',
    start_time: 300,
    end_time: 500,
    title: '',
    mon: '1',
    tue: '1',
    wed: '1',
    thu: '1',
    fri: '1',
    sat: '1',
    sun: '1',
    memo: '',
    disable: '0',
    alram: false,
    color: ''
  }
})

export const timeFlagState = atom<TimeFlag>({
  key: 'timeFlagState',
  default: 'START'
})
