import {atom} from 'recoil'

export const editScheduleCompleteCacheListState = atom<EditScheduleCompleteForm[]>({
  key: 'editScheduleCompleteCacheListState',
  default: []
})

export const editScheduleCompleteFormState = atom<EditScheduleCompleteForm | null>({
  key: 'editScheduleCompleteFormState',
  default: null
})
