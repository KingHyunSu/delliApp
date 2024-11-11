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
  main_color: string
  main_color2: string
  sub_color: string
  sub_color2: string
  text_color: string
  title: string
  price: number
}

declare interface ActiveTheme {
  theme_id: number
  file_name: string
  main_color: string
  main_color2: string
  sub_color: string
  sub_color2: string
  text_color: string
}
