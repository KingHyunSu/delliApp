import {atom} from 'recoil'

export const loginState = atom({
  key: 'loginState',
  default: false
})

export const isEditState = atom({
  key: 'isEdit',
  default: false
})

export const isLoadingState = atom({
  key: 'isLoading',
  default: false
})
