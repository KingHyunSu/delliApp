import http from '@/utils/http'
import {
  UpdateCustomRequest,
  UpdateCustomResponse,
  SetBackgroundRequest,
  SetBackgroundResponse,
  GetBackgroundListResponse,
  GetOutlineListResponse
} from '@/apis/types/user'

export const updateCustom = (data: UpdateCustomRequest) => {
  return http.post<any, Response<UpdateCustomResponse>>('user/update/custom', data)
}

export const setBackground = (data: SetBackgroundRequest) => {
  return http.post<any, Response<SetBackgroundResponse>>('user/background', data)
}

export const getBackgroundList = () => {
  return http.post<any, Response<GetBackgroundListResponse[]>>('user/background/list')
}

export const getOutlineList = () => {
  return http.get<any, Response<GetOutlineListResponse[]>>('user/outline/list')
}
