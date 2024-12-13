import {useMutation, useQuery} from '@tanstack/react-query'
import * as productApi from '@/apis/server/product'
import {SetMyBackgroundRequest} from '@/apis/types/product'

/**
 * background
 */

export const useGetMyBackgroundList = () => {
  return useQuery({
    queryKey: ['myBackgroundList'],
    queryFn: async () => {
      const response = await productApi.getMyBackgroundList()

      return response.data as MyBackgroundItem[]
    },
    initialData: []
  })
}

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

export const useSetMyBackground = () => {
  return useMutation({
    mutationFn: async (params: SetMyBackgroundRequest) => {
      const response = await productApi.setMyBackground(params)

      return response.data
    }
  })
}

/**
 * outline
 */

export const useGetMyOutlineList = () => {
  return useQuery({
    queryKey: ['myOutlineList'],
    queryFn: async () => {
      const response = await productApi.getMyOutlineList()

      return response.data as MyOutlineItem[]
    },
    initialData: []
  })
}
