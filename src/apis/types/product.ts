export interface GetProductBackgroundListResponse {
  product_background_id: number
  thumb_url: string
  title: string
  price: number
}

export interface GetProductBackgroundDetailResponse {
  product_background_id: number
  main_url: string
  thumb_url: string
  file_name: string
  display_mode: number
  background_color: string
  sub_color: string
  accent_color: string
  price_type: number
  price: number
  title: string
  purchased: boolean
}

export interface GetDownloadedBackgroundListResponse {
  background_id: number
  file_name: string
  display_mode: number
  background_color: string
  sub_color: string
  accent_color: string
}

export interface SetDownloadBackgroundRequest {
  background_id: number
  file_name: string
  display_mode: number
  background_color: string
  sub_color: string
  accent_color: string
}

export interface GetActiveBackgroundRequest {
  background_id: number
}

export interface GetActiveBackgroundResponse {
  background_id: number
  file_name: string
  display_mode: number
  background_color: string
  sub_color: string
  accent_color: string
}

export interface SetMyBackgroundRequest {
  background_id: number
}

export interface SetMyBackgroundResponse {
  result: boolean
}

export interface GetMyBackgroundListResponse {
  product_background_id: number
  thumb_url: string
  display_mode: number
  background_color: string
  sub_color: string
  accent_color: string
  title: string
}

export interface GetProductColorThemeListItemResponse {
  product_color_theme_item_id: number
  color_type: string
  color: string
  order: number
}

export interface GetProductColorThemeListResponse {
  product_color_theme_id: number
  background_url: string
  item_list: GetProductColorThemeListItemResponse[]
}
