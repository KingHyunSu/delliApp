import http from '@/utils/http'
import {ThemeDetail, ThemeListItem} from '@/@types/product'

export const getThemeList = () => {
  return http.get<any, Response<ThemeListItem[]>>('product/theme/list')
}

export const getThemeDetail = (id: number) => {
  return http.get<any, Response<ThemeDetail>>(`product/theme/detail/${id}`)
}
