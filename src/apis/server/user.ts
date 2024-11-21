import http from '@/utils/http'
import {AccessRequest, AccessResponse} from '@/apis/types/user'

export const access = (data: AccessRequest) => {
  return http.post<any, Response<AccessResponse>>('auth/access', data)
}
