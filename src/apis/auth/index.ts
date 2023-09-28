import http from '@/utils/http'
import {joinResponse, loginRequest, loginResponse} from './type'

export const join = () => {
  return http.post<joinResponse>('auth/join')
}

export const login = (data: loginRequest) => {
  return http.post<loginResponse>('auth/login', data)
}
