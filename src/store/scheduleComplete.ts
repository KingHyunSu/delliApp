import {atom} from 'recoil'

export const editScheduleCompleteCacheListState = atom<EditScheduleCompleteForm[]>({
  key: 'editScheduleCompleteCacheListState',
  default: []
})

export const editScheduleCompleteFormState = atom<EditScheduleCompleteForm | null>({
  key: 'editScheduleCompleteFormState',
  default: null
})

export const editScheduleCompleteCardFormState = atom<EditScheduleCompleteCardForm>({
  key: 'editScheduleCompleteCardFormState',
  default: {
    imageUrl: null,
    record: ''
  }
})

export const editScheduleCompletePhotoCardFormState = atom<EditScheduleCompletePhotoCardForm>({
  key: 'editScheduleCompletePhotoCardFormState',
  default: {
    originalImageUrl: null,
    photoCardTextList: []
  }
})
