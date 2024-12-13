export interface GetProductBackgroundListResponse {
  product_background_id: number
  thumb_url: string
  background_color: string
  title: string
  price: number
}
export interface GetProductBackgroundDetailResponse {
  product_background_id: number
  main_url: string
  thumb_url: string
  display_mode: number
  background_color: string
  accent_color: string
  price_type: number
  price: number
  title: string
  purchased: boolean
}
export interface SetMyBackgroundRequest {
  background_id: number
}
export interface SetMyBackgroundResponse {
  result: boolean
}
export interface GetMyBackgroundListResponse {
  product_background_id: number
  main_url: string
  thumb_url: string
  display_mode: number
  background_color: string
  accent_color: string
  title: string
}

export interface GetActiveOutlineResponse {
  product_outline_id: number
  background_color: string
  progress_color: string
}
export interface GetMyOutlineListResponse {
  my_outline_id: number
  product_outline_id: number
  background_color: string
  progress_color: string
}
