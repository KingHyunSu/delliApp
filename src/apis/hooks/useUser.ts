import {useMutation, useQuery} from '@tanstack/react-query'
import * as userApi from '@/apis/server/user'
import {
  UpdateDisplayModeRequest,
  UpdateCustomRequest,
  UpdateCustomResponse,
  SetBackgroundRequest,
  UpdateColorThemeRequest,
  GetProfileImageUploadUrlRequest,
  UpdateNicknameRequest,
  UpdateProfileImageRequest,
  GetUserProfileResponse
} from '@/apis/types/user'

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await userApi.getUserProfile()

      return response.data as GetUserProfileResponse
    },
    initialData: {
      before_start_count: 0,
      in_progress_count: 0,
      completed_count: 0
    } as GetUserProfileResponse
  })
}

export const useGetProfileImageUploadUrl = () => {
  return useMutation({
    mutationFn: async (params: GetProfileImageUploadUrlRequest) => {
      const response = await userApi.getProfileImageUploadUrl(params)

      return response.data
    }
  })
}

export const useUpdateProfileImage = () => {
  return useMutation({
    mutationFn: async (params: UpdateProfileImageRequest) => {
      const response = await userApi.updateProfileImage(params)

      return response.data
    }
  })
}

export const useUpdateNickname = () => {
  return useMutation({
    mutationFn: async (params: UpdateNicknameRequest) => {
      const response = await userApi.updateNickname(params)

      return response.data
    }
  })
}

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
