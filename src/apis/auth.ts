import http from '@/utils/http'

export const join = () => {
  return http.post<joinResponse>('auth/join')
}

export const login = (data: LoginRequest) => {
  return http.post<LoginResponse>('auth/login', data)
}

export const getNewToken = (data: ReissueRequest) => {
  return http.post<LoginResponse>('auth/reissue', data)
}
