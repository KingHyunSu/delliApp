import {atom} from 'recoil'

export const isLoginState = atom<Boolean>({
  key: 'isLoginState',
  default: false
})
