import http from '@/utils/http'

export const getWidgetReloadable = () => {
  return http.get<any, Response<GetWidgetReloadableResponse>>('widget/reloadable')
}

export const updateWidgetReloadable = () => {
  return http.post<any, Response<UpdateWidgetReloadableResponse>>('widget/reloadable')
}
