import {useMutation, useQuery} from '@tanstack/react-query'
import * as productApi from '@/apis/server/product'
import {productRepository} from '../local'
import {
  SetDownloadBackgroundRequest,
  SetMyBackgroundRequest,
  UpdateOutlineColorRequest,
  UpdateOutlineColorResponse
} from '@/apis/types/product'

/**
 * background
 */

export const useGetActiveBackground = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return productRepository.getActiveBackground({background_id: id}) as Promise<ActiveBackground>
    }
  })
}

export const useGetDownloadedBackgroundList = () => {
  return useQuery({
    queryKey: ['downloadBackgroundList'],
    queryFn: () => {
      return productRepository.getDownloadedBackgroundList() as Promise<DownloadedBackgroundItem[]>
    },
    initialData: []
  })
}

export const useSetDownloadBackground = () => {
  return useMutation({
    mutationFn: (params: SetDownloadBackgroundRequest) => {
      return productRepository.setDownloadBackground(params)
    }
  })
}

export const useGetBackgroundList = () => {
  return useQuery({
    queryKey: ['backgroundList'],
    queryFn: async () => {
      const response = await productApi.getProductBackgroundList()

      return response.data as ProductBackgroundItem[]
    },
    initialData: []
  })
}

export const useGetBackgroundDetail = (id: number) => {
  return useQuery({
    queryKey: ['backgroundDetail', id],
    queryFn: async () => {
      const response = await productApi.getProductBackgroundDetail(id)

      return response.data as ProductBackgroundDetail
    },
    initialData: null
  })
}

export const useGetBackgroundDetailMutation = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await productApi.getProductBackgroundDetail(id)

      return response.data as ProductBackgroundDetail
    }
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

export const useGetMyBackgroundList = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await productApi.getMyBackgroundList()

      return response.data as MyBackgroundItem[]
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

export const useUpdateOutlineColor = () => {
  return useMutation({
    mutationFn: async (params: UpdateOutlineColorRequest) => {
      const response = await productApi.updateOutlineColor(params)

      return response.data as UpdateOutlineColorResponse
    }
  })
}

/**
 * color theme
 */

export const useGetProductColorThemeList = () => {
  return useQuery({
    queryKey: ['productColorThemeList'],
    queryFn: async () => {
      const response = await productApi.getProductColorThemeList()

      return response.data as ProductColorThemeItem[]
    }
  })
}
