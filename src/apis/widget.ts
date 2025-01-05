import http from '@/utils/http'

export const updateWidgetReloadable = () => {
  return http.post<any, Response<UpdateWidgetReloadableResponse>>('widget/reloadable')
}
