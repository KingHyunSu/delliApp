import {useMutation, useQuery} from '@tanstack/react-query'
import * as productApi from '@/apis/server/product'
import {productRepository} from '../local'
import {SetMyThemeRequest, SetThemeRequest} from '@/apis/types/product'

export const useGetThemeList = () => {
  return useQuery({
    queryKey: ['themeList'],
    queryFn: async () => {
      const response = await productApi.getThemeList()

      return response.data as ThemeListItem[]
    },
    initialData: []
  })
}

export const useGetThemeDetail = (id: number) => {
  return useQuery({
    queryKey: ['themeDetail', id],
    queryFn: async () => {
      const response = await productApi.getThemeDetail(id)

      return response.data as ThemeDetail
    },
    initialData: null
  })
}

export const useGetDownloadThemeList = () => {
  return useQuery({
    queryKey: ['downloadThemeList'],
    queryFn: () => {
      return productRepository.getDownloadThemeList() as Promise<ActiveTheme[]>
    },
    initialData: []
  })
}

export const useGetActiveTheme = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return productRepository.getActiveTheme({theme_id: id}) as Promise<ActiveTheme>
    }
  })
}

export const useSetTheme = () => {
  return useMutation({
    mutationFn: (params: SetThemeRequest) => {
      return productRepository.setTheme(params)
    }
  })
}

export const useSetMyTheme = () => {
  return useMutation({
    mutationFn: async (params: SetMyThemeRequest) => {
      const response = await productApi.setMyTheme(params)

      return response.data
    }
  })
}

export const useGetMyThemeList = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await productApi.getMyThemeList()

      return response.data as MyThemeListItem[]
    }
  })
}
