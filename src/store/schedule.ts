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

export const editScheduleFormState = atom<EditScheduleForm>({
  key: 'editScheduleFormState',
  default: {
    schedule_id: null,
    title: '',
    start_date: '',
    end_date: '9999-12-31',
    start_time: 0,
    end_time: 360,
    mon: '1',
    tue: '1',
    wed: '1',
    thu: '1',
    fri: '1',
    sat: '1',
    sun: '1',
    title_x: 10,
    title_y: 45,
    title_rotate: 0,
    font_size: 16,
    background_color: '#ffffff',
    text_color: '#000000'
  }
})

export const editScheduleTimeState = atom({
  key: 'editScheduleTimeState',
  default: {
    start: 0,
    end: 360
  }
})

export const scheduleCategoryListState = atom<ScheduleCategory[]>({
  key: 'scheduleCategoryListState',
  default: [
    {
      schedule_category_id: 1,
      icon: '📖',
      image: require('@/assets/icons/3d/open-book.png'),
      title: '공부',
      color: '#6EB5FF'
    },
    {
      schedule_category_id: 2,
      icon: '💪',
      image: require('@/assets/icons/3d/work-out.png'),
      title: '운동',
      color: '#FF5353'
    },
    {
      schedule_category_id: 3,
      icon: '🧸',
      image: require('@/assets/icons/3d/teddy-bear.png'),
      title: '취미',
      color: '#FDAC68'
    },
    // {schedule_category_id: 4, icon: '✈️', title: '여행', color: ''},
    {
      schedule_category_id: 5,
      icon: '💼',
      image: require('@/assets/icons/3d/briefcase.png'),
      title: '업무',
      color: '#CE9D73'
    },
    // {schedule_category_id: 6, icon: '🥂', title: '모임', color: ''},
    {
      schedule_category_id: 7,
      icon: '🌱',
      image: require('@/assets/icons/3d/seedling.png'),
      title: '자기개발',
      color: '#30E584'
    },
    {
      schedule_category_id: 8,
      icon: '🫧',
      image: require('@/assets/icons/3d/bubbles.png'),
      title: '휴식',
      color: '#FFDB45'
    }
    // {schedule_category_id: 9, icon: '💌', title: '연애', color: ''}
  ]
})

export const activeTimeFlagState = atom<RANGE_FLAG | null>({
  key: 'activeTimeFlagState',
  default: null
})

export const isInputModeState = atom<Boolean>({
  key: 'isInputModeState',
  default: true
})

export const focusModeInfoState = atom<FocusModeInfo | null>({
  key: 'focusModeInfoState',
  default: null
})

export type ColorType = 'background' | 'font' | 'border'
export const colorToChangeState = atom<ColorType>({
  key: 'colorToChangeState',
  default: 'background'
})

export const isFixedAlignCenterState = atom({
  key: 'isFixedAlignCenterState',
  default: false
})
