import {useQuery} from '@tanstack/react-query'
import * as productApi from '@/apis/server/product'

/**
 * background
 */
export const useGetProductBackgroundList = () => {
  return useQuery({
    queryKey: ['backgroundList'],
    queryFn: async () => {
      const response = await productApi.getProductBackgroundList()

      return response.data as ProductBackgroundItem[]
    },
    initialData: []
  })
}

export const useProductBackgroundDetail = (id: number) => {
  return useQuery({
    queryKey: ['productBackgroundDetail', id],
    queryFn: async () => {
      const response = await productApi.getProductBackgroundDetail(id)

      return response.data as ProductBackgroundDetail
    },
    initialData: null
  })
}
