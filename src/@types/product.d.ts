import {GetProductBackgroundDetailResponse, GetProductBackgroundListResponse} from '@/apis/types/product'

declare global {
  interface ProductBackgroundItem extends GetProductBackgroundListResponse {}
  interface ProductBackgroundDetail extends GetProductBackgroundDetailResponse {}
}
