import http from '@/utils/http'

export const getTermsUrl = (type: string) => {
  return http.get<any, Response<TermsUrl>>('terms/url', {params: {type}})
}

export const getJoinTermsList = (data: GetJoinTermsListReqeust) => {
  return http.post<any, Response<Terms[]>>('terms/join/list', data)
}
