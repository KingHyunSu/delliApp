import {atom} from 'recoil'

export const joinInfoState = atom<JoinReqeust>({
  key: 'joinInfoState',
  default: {
    token: '',
    type: '',
    terms_agree_list: []
  }
})
