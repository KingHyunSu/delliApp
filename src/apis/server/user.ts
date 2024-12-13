import http from '@/utils/http'
import {AccessRequest, AccessResponse, UpdateCustomRequest, UpdateCustomResponse} from '@/apis/types/user'

export const access = (data: AccessRequest) => {
  return http.post<any, Response<AccessResponse>>('auth/access', data)
}

export const updateCustom = (data: UpdateCustomRequest) => {
  return http.post<any, Response<UpdateCustomResponse>>('auth/update/custom', data)
}
