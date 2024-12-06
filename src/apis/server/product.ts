import http from '@/utils/http'
import {
  GetMyBackgroundListResponse,
  GetMyOutlineListResponse,
  GetProductBackgroundDetailResponse,
  GetProductBackgroundListResponse,
  GetProductColorThemeListResponse,
  SetMyBackgroundRequest,
  SetMyBackgroundResponse,
  UpdateOutlineColorRequest,
  UpdateOutlineColorResponse
} from '@/apis/types/product'

export const getProductBackgroundList = () => {
  return http.get<any, Response<GetProductBackgroundListResponse[]>>('product/background/list')
}

export const getProductBackgroundDetail = (id: number) => {
  return http.get<any, Response<GetProductBackgroundDetailResponse>>(`product/background/${id}`)
}

export const setMyBackground = (data: SetMyBackgroundRequest) => {
  return http.post<any, Response<SetMyBackgroundResponse>>('product/background/my', data)
}

export const getMyBackgroundList = () => {
  return http.post<any, Response<GetMyBackgroundListResponse[]>>('product/background/my/list')
}

export const getMyOutlineList = () => {
  return http.get<any, Response<GetMyOutlineListResponse[]>>('product/outline/my/list')
}

export const updateOutlineColor = (data: UpdateOutlineColorRequest) => {
  return http.post<any, Response<UpdateOutlineColorResponse>>('product/outline/color', data)
}

export const getProductColorThemeList = () => {
  return http.get<any, Response<GetProductColorThemeListResponse[]>>('product/color-theme/list')
}
