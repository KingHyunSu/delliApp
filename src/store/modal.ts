import {atom} from 'recoil'

export const showScheduleCompleteModalState = atom({
  key: 'scheduleCompleteModal',
  default: false
})

export const showCompleteModalState = atom({
  key: 'showCompleteModalState',
  default: false
})

export const showColorPickerModalState = atom({
  key: 'showColorPickerModalState',
  default: false
})

export const showOutlineColorPickerModalState = atom({
  key: 'showOutlineColorPickerModalState',
  default: false
})

export const showPurchaseCompleteModalState = atom({
  key: 'showPurchaseCompleteModalState',
  default: false
})
