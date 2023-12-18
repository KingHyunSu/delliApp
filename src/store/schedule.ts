import {atom} from 'recoil'

import {Schedule} from '@/types/schedule'
import {COLOR_TYPE, RANGE_FLAG} from '@/utils/types'

export const scheduleDateState = atom<Date>({
  key: 'scheduleDateState',
  default: new Date()
})

export const scheduleListState = atom<Schedule[]>({
  key: 'scheduleListState',
  default: [
    {
      schedule_id: 1,
      timetable_category_id: null,
      start_date: '2023-10-21',
      end_date: '2023-12-31',
      start_time: 60,
      end_time: 370,
      title: '테스트 데이터',
      mon: '0',
      tue: '1',
      wed: '1',
      thu: '0',
      fri: '0',
      sat: '1',
      sun: '1',
      memo: '',
      disable: '0',
      state: '0',
      title_x: 30,
      title_y: 37,
      title_rotate: -20,
      alram: false,
      background_color: '#ffffff',
      text_color: '#000'
    },
    {
      schedule_id: 2,
      timetable_category_id: null,
      start_date: '2023-10-21',
      end_date: '2023-12-31',
      start_time: 370,
      end_time: 570,
      title: '테스트 데이터 2',
      mon: '1',
      tue: '1',
      wed: '1',
      thu: '1',
      fri: '1',
      sat: '1',
      sun: '1',
      memo: '',
      disable: '0',
      state: '0',
      title_x: 30,
      title_y: -18,
      title_rotate: 10,
      alram: false,
      background_color: '#ffffff',
      text_color: '#000'
    }
  ]
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
    state: '0',
    title_x: 0,
    title_y: 0,
    title_rotate: 0,
    alram: false,
    background_color: '#ffffff',
    text_color: '#000000'
  }
})

export const editStartAngleState = atom({
  key: 'editStartAngleState',
  default: 0
})

export const editEndAngleState = atom({
  key: 'editEndAngleState',
  default: 90
})

export const activeTimeFlagState = atom<RANGE_FLAG | null>({
  key: 'activeTimeFlagState',
  default: null
})

export const colorTypeState = atom<COLOR_TYPE>({
  key: 'colorTypeState',
  default: 'background'
})
