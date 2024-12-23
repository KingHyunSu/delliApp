import http from '@/utils/http'

export const getToken = () => {
  return http.post<any, Response<LoginResponse>>('auth/token/generate')
}

export const getNewToken = (data: ReissueRequest) => {
  return http.post<any, Response<LoginResponse>>('auth/token/reissue', data)
}
