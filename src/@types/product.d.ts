import {
  GetActiveBackgroundResponse,
  GetDownloadedBackgroundListResponse,
  GetMyBackgroundListResponse,
  GetProductBackgroundDetailResponse,
  GetProductBackgroundListResponse
} from '@/apis/types/product'

declare global {
  interface ActiveBackground extends GetActiveBackgroundResponse {}
  interface ProductBackgroundItem extends GetProductBackgroundListResponse {}
  interface ProductBackgroundDetail extends GetProductBackgroundDetailResponse {}
  interface DownloadedBackgroundItem extends GetDownloadedBackgroundListResponse {}
  interface MyBackgroundItem extends GetMyBackgroundListResponse {}
}
