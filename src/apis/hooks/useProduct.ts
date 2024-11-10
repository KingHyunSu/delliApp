import {useMutation, useQuery} from '@tanstack/react-query'
import * as productApi from '@/apis/server/product'

export const useGetThemeList = () => {
  return useQuery({
    queryKey: ['themeList'],
    queryFn: async () => {
      const response = await productApi.getThemeList()

      return response.data
    },
    initialData: []
  })
}

export const useGetThemeDetail = (id: number) => {
  return useQuery({
    queryKey: ['themeDetail', id],
    queryFn: async () => {
      const response = await productApi.getThemeDetail(id)

      return response.data
    },
    initialData: null
  })
}

export const useGetActiveTheme = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await productApi.getActiveTheme(id)

      return response.data
    }
  })
}
