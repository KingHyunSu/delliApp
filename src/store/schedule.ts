import {atom} from 'recoil'

import {RANGE_FLAG} from '@/utils/types'

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
    // timetable_category_id: null,
    start_date: '',
    end_date: '9999-12-31',
    start_time: 0,
    end_time: 360,
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
    title_x: 10,
    title_y: 45,
    title_rotate: 0,
    alarm: 0,
    todo_list: [],
    background_color: '#ffffff',
    text_color: '#000000',
    schedule_category_id: null,
    schedule_category_title: ''
  }
})

export const scheduleCategoryListState = atom<ScheduleCategory[]>({
  key: 'scheduleCategoryListState',
  default: [
    {schedule_category_id: 1, icon: '📖', title: '공부'},
    {schedule_category_id: 2, icon: '💪', title: '운동'},
    {schedule_category_id: 3, icon: '🧸', title: '취미'},
    // {schedule_category_id: 4, icon: '✈️', title: '여행'},
    {schedule_category_id: 5, icon: '💼', title: '업무'},
    // {schedule_category_id: 6, icon: '🥂', title: '모임'},
    {schedule_category_id: 7, icon: '🌱', title: '자기개발'},
    {schedule_category_id: 8, icon: '🫧', title: '휴식'}
    // {schedule_category_id: 9, icon: '💌', title: '연애'}
  ]
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

export const isInputModeState = atom<Boolean>({
  key: 'isInputModeState',
  default: true
})
