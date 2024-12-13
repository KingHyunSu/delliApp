import {
  GetActiveOutlineResponse,
  GetMyBackgroundListResponse,
  GetMyOutlineListResponse,
  GetProductBackgroundDetailResponse,
  GetProductBackgroundListResponse
} from '@/apis/types/product'

declare global {
  interface ActiveBackground {
    background_id: number
    main_url: string
    display_mode: number
    background_color: string
    accent_color: string
  }
  interface MyBackgroundItem extends GetMyBackgroundListResponse {}
  interface ProductBackgroundItem extends GetProductBackgroundListResponse {}
  interface ProductBackgroundDetail extends GetProductBackgroundDetailResponse {}

  interface ActiveOutline extends GetActiveOutlineResponse {}
  interface MyOutlineItem extends GetMyOutlineListResponse {}
}
