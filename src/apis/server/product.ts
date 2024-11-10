import http from '@/utils/http'

export const getThemeList = () => {
  return http.get<any, Response<ThemeListItem[]>>('product/theme/list')
}

export const getThemeDetail = (id: number) => {
  return http.get<any, Response<ThemeDetail>>(`product/theme/detail/${id}`)
}

export const getActiveTheme = (id: number) => {
  return http.get<any, Response<ActiveTheme>>(`product/theme/active/${id}`)
}
