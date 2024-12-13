export interface AccessRequest {
  id: string
}
export interface AccessResponse {
  token: string
  color_theme_detail: ColorThemeDetail
  active_background: ActiveBackground | null
  active_outline: ActiveOutline
}

export interface UpdateCustomRequest {
  active_background_id: number
  active_outline_id: number
  outline_background_color: string
  outline_progress_color: string
}
export interface UpdateCustomResponse {
  result: boolean
}
