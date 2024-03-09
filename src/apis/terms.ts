import http from '@/utils/http'

export const getJoinTermsList = (data: GetJoinTermsListReqeust) => {
  return http.post<any, Response<Terms[]>>('terms/join/list', data)
}
