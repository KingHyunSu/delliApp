import http from '@/utils/http'

interface GetToken {
  id: string
}
export const getToken = (data: GetToken) => {
  console.log('getToken data', data)
  return http.post<any, Response<LoginResponse>>('auth/token/generate', data)
}

export const getNewToken = (data: ReissueRequest) => {
  return http.post<any, Response<LoginResponse>>('auth/token/reissue', data)
}
