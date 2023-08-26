import http from '@/utils/http'
import {joinResponse, loginRequest} from './type'

export const join = () => {
  return http.post<joinResponse>('auth/join')
}

export const login = (data: loginRequest) => {
  return http.post('auth/login', data)
}
