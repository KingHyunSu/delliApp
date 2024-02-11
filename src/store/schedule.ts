import {atom} from 'recoil'

import {COLOR_TYPE, RANGE_FLAG} from '@/utils/types'

export const scheduleDateState = atom<Date>({
  key: 'scheduleDateState',
  default: new Date()
})

export const scheduleListState = atom<Schedule[]>({
  key: 'scheduleListState',
  default: []
})

export const disableScheduleListState = atom<ExistSchedule[]>({
  key: 'disableScheduleListState',
  default: []
})

export const existScheduleListState = atom<ExistSchedule[]>({
  key: 'existScheduleListState',
  default: []
})

export const scheduleState = atom<Schedule>({
  key: 'scheduleState',
  default: {
    schedule_id: null,
    timetable_category_id: null,
    start_date: '',
    end_date: '9999-12-31',
    start_time: 0,
    end_time: 360,
    title: '',
    mon: '0',
    tue: '0',
    wed: '0',
    thu: '0',
    fri: '0',
    sat: '0',
    sun: '0',
    memo: '',
    disable: '0',
    state: '0',
    title_x: 10,
    title_y: 45,
    title_rotate: 0,
    alarm: 0,
    todo_list: [],
    background_color: '#ffffff',
    text_color: '#000000'
  }
})

export const scheduleTodoState = atom<Todo>({
  key: 'scheduleTodoState',
  default: {
    schedule_id: null,
    todo_id: null,
    title: '',
    start_date: '',
    end_date: null,
    complete_id: null,
    complete_date: null
  }
})

export const activeTimeFlagState = atom<RANGE_FLAG | null>({
  key: 'activeTimeFlagState',
  default: null
})

export const colorTypeState = atom<COLOR_TYPE>({
  key: 'colorTypeState',
  default: 'background'
})
