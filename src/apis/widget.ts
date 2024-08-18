import http from '@/utils/http'

export const getWidgetReloadable = (params: GetWidgetReloadableRequest) => {
  return http.get<any, Response<GetWidgetReloadableResponse>>('widget/reloadable', {params})
}

export const updateWidgetReloadable = (data: UpdateWidgetReloadableRequest) => {
  return http.post<any, Response<UpdateWidgetReloadableResponse>>('widget/reloadable', data)
}
