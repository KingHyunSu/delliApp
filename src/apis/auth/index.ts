import http from '@/utils/http'
import {joinResponse} from './type'

export const join = () => {
  return http.post<joinResponse>('auth/join')
}

export const login = () => {
  return http.post('auth/login')
}
