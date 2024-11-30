export interface AccessRequest {
  id: string
}

export interface AccessResponse {
  token: string
  active_color_theme: ActiveColorTheme | null
}

export interface UpdateActiveColorThemeRequest {
  active_color_theme_id: number
}

export interface UpdateActiveColorThemeResponse {
  result: boolean
}
