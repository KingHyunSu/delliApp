export interface GetThemeRequest {
  theme_id: number
}

export interface SetThemeRequest {
  theme_id: number
  file_name: string
  main_color: string
  main_color2: string
  sub_color: string
  sub_color2: string
  text_color: string
}
