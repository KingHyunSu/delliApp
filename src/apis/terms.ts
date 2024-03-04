import http from '@/utils/http'

export const getTermsList = (data: GetTermsListReqeust) => {
  return http.post<any, Response<Terms[]>>('terms/list', data)
}
