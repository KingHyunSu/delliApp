import http from '@/utils/http'
import {GetProductBackgroundDetailResponse, GetProductBackgroundListResponse} from '@/apis/types/product'

export const getProductBackgroundList = () => {
  return http.get<any, Response<GetProductBackgroundListResponse[]>>('product/background/list')
}

export const getProductBackgroundDetail = (id: number) => {
  return http.get<any, Response<GetProductBackgroundDetailResponse>>(`product/background/${id}`)
}
