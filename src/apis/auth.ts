import http from '@/utils/http'

export const join = () => {
  return http.post<joinResponse>('auth/join')
}

export const login = (data: LoginParam) => {
  return http.post<loginResponse>('auth/login', data)
}
