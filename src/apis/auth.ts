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

export const getLoginType = () => {
  return http.get<any, Response<LoginType>>('auth/logintype')
}

export const leave = (data: LeaveRequest) => {
  return http.post('auth/leave', data)
}
