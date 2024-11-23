import http from '@/utils/http'
import {
  GetMyThemeListResponse,
  GetThemeDetailResponse,
  GetThemeListResponse,
  SetMyThemeRequest,
  SetMyThemeResponse
} from '@/apis/types/product'

export const getThemeList = () => {
  return http.get<any, Response<GetThemeListResponse[]>>('product/theme/list')
}

export const getThemeDetail = (id: number) => {
  return http.get<any, Response<GetThemeDetailResponse>>(`product/theme/detail/${id}`)
}

export const setMyTheme = (data: SetMyThemeRequest) => {
  return http.post<any, Response<SetMyThemeResponse>>('product/theme/my', data)
}

export const getMyThemeList = () => {
  return http.post<any, Response<GetMyThemeListResponse[]>>('product/theme/my/list')
}
