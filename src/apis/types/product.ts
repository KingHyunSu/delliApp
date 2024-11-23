export interface GetThemeListResponse {
  theme_id: number
  thumb_url: string
  title: string
  price: number
}

export interface GetThemeDetailResponse {
  theme_id: number
  main_url: string
  thumb_url: string
  file_name: string
  color1: string
  color2: string
  color3: string
  color4: string
  color5: string
  color6: string
  color7: string
  color8: string
  display_mode: number
  title: string
  price: number
  price_type: number
  purchased: boolean
}

export interface GetActiveThemeRequest {
  theme_id: number
}

export interface GetActiveThemeResponse {
  theme_id: number
  file_name: string
  color1: string
  color2: string
  color3: string
  color4: string
  color5: string
  color6: string
  color7: string
  color8: string
  display_mode: number
}

export interface SetThemeRequest {
  theme_id: number
  file_name: string
  color1: string
  color2: string
  color3: string
  color4: string
  color5: string
  color6: string
  color7: string
  color8: string
  display_mode: number
}

export interface SetMyThemeRequest {
  theme_id: number
}

export interface SetMyThemeResponse {
  result: boolean
}

export interface GetMyThemeListResponse {
  theme_id: number
  thumb_url: string
  title: string
}
