declare interface ThemeListItem {
  theme_id: number
  thumb_url: string
  title: string
  price: number
}

declare interface ThemeDetail {
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
}

declare interface ActiveTheme {
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
