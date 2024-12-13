export interface EditColorThemeRequest {
  color_theme_type: number
  insert_color_theme_item_list: ColorThemeItem[]
  update_color_theme_item_list: ColorThemeItem[]
  delete_color_theme_item_list: ColorThemeItem[]
}

export interface EditColorThemeResponse {
  result: boolean
}
