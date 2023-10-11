import {atom} from 'recoil'
import {TimeTableCategory} from '@/types/timetable'

export const activeTimeTableCategoryState = atom<TimeTableCategory>({
  key: 'activeTimeTableCategoryState',
  default: {
    timetable_category_id: null,
    title: ''
  }
})
