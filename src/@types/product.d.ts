import {
  GetActiveThemeResponse,
  GetMyThemeListResponse,
  GetThemeDetailResponse,
  GetThemeListResponse
} from '@/apis/types/product'

declare global {
  interface ThemeListItem extends GetThemeListResponse {}
  interface ThemeDetail extends GetThemeDetailResponse {}
  interface ActiveTheme extends GetActiveThemeResponse {}
  interface MyThemeListItem extends GetMyThemeListResponse {}
}
