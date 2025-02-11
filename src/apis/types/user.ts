export interface GetUserProfileResponse {
  before_start_count: number
  in_progress_count: number
  completed_count: number
}

export interface GetProfileImageUploadUrlRequest {
  name: string
}
export interface GetProfileImageUploadUrlResponse {
  url: string
}

export interface UpdateProfileImageRequest {
  file_name: string
}
export interface UpdateProfileImageResponse {
  profile_path: string
}

export interface UpdateNicknameRequest {
  nickname: string
}
export interface UpdateNicknameResponse {
  result: boolean
}

export interface UpdateDisplayModeRequest {
  display_mode: DisplayMode
}
export interface UpdateDisplayModeResponse {
  result: boolean
}

export interface UpdateCustomRequest {
  active_background_id: number
  active_outline_id: number
  my_outline_id: number
  outline_background_color: string
  outline_progress_color: string
}
export interface UpdateCustomResponse {
  result: boolean
}

export interface SetBackgroundRequest {
  background_id: number
}
export interface SetBackgroundResponse {
  result: boolean
}
export interface GetBackgroundListResponse {
  product_background_id: number
  main_url: string
  thumb_url: string
  display_mode: number
  background_color: string
  accent_color: string
  title: string
}

export interface GetOutlineListResponse {
  my_outline_id: number
  product_outline_id: number
  background_color: string
  progress_color: string
}

export interface UpdateColorThemeRequest {
  is_active_color_theme: number
  insert_color_theme_item_list: ColorThemeItem[]
  update_color_theme_item_list: ColorThemeItem[]
  delete_color_theme_item_list: ColorThemeItem[]
}
