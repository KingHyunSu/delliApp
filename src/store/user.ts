import {atom, selector} from 'recoil'

export const loginInfoState = atom<LoginInfo | null>({
  key: 'loginInfoState',
  default: null
})

export const isLoginState = selector({
  key: 'isLoginState',
  get: ({get}) => {
    const loginInfo = get(loginInfoState)

    return loginInfo && loginInfo.login_type !== 0
  }
})
