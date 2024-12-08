import {
  GetActiveOutlineResponse,
  GetMyBackgroundListResponse,
  GetMyOutlineListResponse,
  GetProductBackgroundDetailResponse,
  GetProductBackgroundListResponse,
  GetProductColorThemeListItemResponse,
  GetProductColorThemeListResponse
} from '@/apis/types/product'

declare global {
  interface ActiveBackground {
    background_id: number
    main_url: string
    display_mode: number
    background_color: string
    sub_color: string
    accent_color: string
  }
  interface MyBackgroundItem extends GetMyBackgroundListResponse {}
  interface ProductBackgroundItem extends GetProductBackgroundListResponse {}
  interface ProductBackgroundDetail extends GetProductBackgroundDetailResponse {}

  interface ActiveOutline extends GetActiveOutlineResponse {}
  interface MyOutlineItem extends GetMyOutlineListResponse {}

  interface ProductColorThemeItem extends GetProductColorThemeListResponse {}
  interface ColorThemeItem extends GetProductColorThemeListItemResponse {}
  interface ActiveColorTheme {
    product_color_theme_id: number
    background_url: string
    item_list: ColorThemeItem[]
  }
}
