export interface AccessRequest {
  id: string
}
export interface AccessResponse {
  token: string
  active_background: ActiveBackground | null
  active_outline: ActiveOutline
  active_color_theme: ActiveColorTheme | null
}

export interface UpdateActiveColorThemeRequest {
  active_color_theme_id: number
}
export interface UpdateActiveColorThemeResponse {
  result: boolean
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
