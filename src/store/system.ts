import {atom} from 'recoil'

export const loginState = atom({
  key: 'loginState',
  default: false
})

export const isEditState = atom({
  key: 'isEdit',
  default: false
})
