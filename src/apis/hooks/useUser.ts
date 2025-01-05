import {useMutation, useQuery} from '@tanstack/react-query'
import * as userApi from '@/apis/server/user'
import {
  UpdateDisplayModeRequest,
  UpdateCustomRequest,
  UpdateCustomResponse,
  SetBackgroundRequest,
  UpdateColorThemeRequest
} from '@/apis/types/user'

export const useUpdateDisplayMode = () => {
  return useMutation({
    mutationFn: async (params: UpdateDisplayModeRequest) => {
      const response = await userApi.updateDisplayMode(params)

      return response.data
    }
  })
}

export const useUpdateCustom = () => {
  return useMutation({
    mutationFn: async (params: UpdateCustomRequest) => {
      const response = await userApi.updateCustom(params)

      return response.data as UpdateCustomResponse
    }
  })
}

export const useGetBackgroundList = () => {
  return useQuery({
    queryKey: ['myBackgroundList'],
    queryFn: async () => {
      const response = await userApi.getBackgroundList()

      return response.data as MyBackgroundItem[]
    },
    initialData: []
  })
}

export const useSetBackground = () => {
  return useMutation({
    mutationFn: async (params: SetBackgroundRequest) => {
      const response = await userApi.setBackground(params)

      return response.data
    }
  })
}

export const useGetOutlineList = () => {
  return useQuery({
    queryKey: ['myOutlineList'],
    queryFn: async () => {
      const response = await userApi.getOutlineList()

      return response.data as MyOutlineItem[]
    },
    initialData: []
  })
}

export const useUpdateColorTheme = () => {
  return useMutation({
    mutationFn: async (params: UpdateColorThemeRequest) => {
      const response = await userApi.updateColorTheme(params)

      return response.data as ColorThemeItem[]
    }
  })
}
