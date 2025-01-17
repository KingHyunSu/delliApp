import {atom} from 'recoil'

export const showLoginBottomSheetState = atom({
  key: 'showLoginBottomSheetState',
  default: false
})

export const showEditMenuBottomSheetState = atom({
  key: 'showEditMenuBottomSheet',
  default: false
})

export const showTimeTableCategoryBottomSheetState = atom({
  key: 'showTimeTableCategoryBottomSheet',
  default: false
})

export const showDatePickerBottomSheetState = atom({
  key: 'showDatePickerBottomSheetState',
  default: false
})

export const showScheduleCategorySelectorBottomSheetState = atom({
  key: 'showScheduleCategorySelectorBottomSheetState',
  default: false
})

export const showColorSelectorBottomSheetState = atom({
  key: 'showColorSelectorBottomSheetState',
  default: false
})
