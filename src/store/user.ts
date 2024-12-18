import {atom} from 'recoil'

export const loginInfoState = atom<LoginInfo | null>({
  key: 'loginInfoState',
  default: null
})
