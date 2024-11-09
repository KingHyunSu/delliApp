declare interface GetWidgetReloadableRequest {
  id: number
}

declare interface GetWidgetReloadableResponse {
  widget_reloadable: boolean
}

declare interface UpdateWidgetReloadableRequest {
  id: string
}

declare interface UpdateWidgetReloadableResponse {
  result: boolean
}
