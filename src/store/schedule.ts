import {atom} from 'recoil'
import {Schedule} from '@/types/schedule'

export const scheduleState = atom<Schedule>({
  key: 'scheduleState',
  default: {
    schedule_id: -1,
    timetable_category_id: -1,
    start_date: '',
    end_date: '9999-12-31',
    start_time: 300,
    end_time: 500,
    title: '',
    memo: '',
    alram: false,
    color: ''
  }
})
