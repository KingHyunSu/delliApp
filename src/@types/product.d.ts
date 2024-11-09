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
  main_color: string
  sub_color: string
  text_color: string
  title: string
  price: number
}

declare interface ThemeColor {
  theme_id: number
  main_color: string
  sub_color: string
  text_color: string
}
