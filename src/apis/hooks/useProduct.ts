import {useMutation, useQuery} from '@tanstack/react-query'
import * as productApi from '@/apis/server/product'
import {productRepository} from '../local'
import {SetThemeRequest} from '@/apis/local/types/product'

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

export const useGetDownloadThemeList = () => {
  return useQuery({
    queryKey: ['getDownloadThemeList'],
    queryFn: () => {
      return productRepository.getDownloadThemeList()
    },
    initialData: []
  })
}

export const useGetActiveTheme = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return productRepository.getActiveTheme({theme_id: id})
    }
  })
}

export const useSetTheme = () => {
  return useMutation({
    mutationFn: async (params: SetThemeRequest) => {
      return productRepository.setTheme(params)
    }
  })
}
