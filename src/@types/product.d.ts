import {
  GetActiveBackgroundResponse,
  GetDownloadedBackgroundListResponse,
  GetMyBackgroundListResponse,
  GetProductBackgroundDetailResponse,
  GetProductBackgroundListResponse,
  GetProductColorThemeListItemResponse,
  GetProductColorThemeListResponse
} from '@/apis/types/product'

declare global {
  interface ActiveBackground extends GetActiveBackgroundResponse {}
  interface ProductBackgroundItem extends GetProductBackgroundListResponse {}
  interface ProductBackgroundDetail extends GetProductBackgroundDetailResponse {}
  interface DownloadedBackgroundItem extends GetDownloadedBackgroundListResponse {}
  interface MyBackgroundItem extends GetMyBackgroundListResponse {}

  interface ProductColorThemeItem extends GetProductColorThemeListResponse {}

  interface ColorThemeItem extends GetProductColorThemeListItemResponse {}
  interface ActiveColorTheme {
    product_color_theme_id: number
    background_url: string
    item_list: ColorThemeItem[]
  }
}
