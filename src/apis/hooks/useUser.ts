import {useMutation, useQuery} from '@tanstack/react-query'
import {userRepository} from '../local'
import * as userApi from '@/apis/server/user'
import {
  UpdateCustomRequest,
  UpdateCustomResponse,
  SetBackgroundRequest,
  UpdateColorThemeRequest,
  UpdateColorThemeResponse
} from '@/apis/types/user'

export const useGetUser = () => {
  return useMutation({
    mutationFn: () => {
      return userRepository.getUser()
    }
  })
}

export const useUpdateDisplayMode = () => {
  return useMutation({
    mutationFn: async (displayMode: DisplayMode) => {
      return userRepository.updateDisplayMode(displayMode)
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

      return response.data as UpdateColorThemeResponse
    }
  })
}
