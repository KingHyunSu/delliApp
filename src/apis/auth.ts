import http from '@/utils/http'

export const join = (data: JoinReqeust) => {
  return http.post<any, Response<JoinResponse>>('auth/join', data)
}

export const login = (data: LoginRequest) => {
  return http.post<any, Response<LoginResponse>>('auth/login', data)
}

export const getNewToken = (data: ReissueRequest) => {
  return http.post<any, Response<LoginResponse>>('auth/reissue', data)
}

export const updateAccess = () => {
  return http.post('auth/update/access')
}
