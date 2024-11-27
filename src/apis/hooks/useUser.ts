import {useMutation} from '@tanstack/react-query'
import {userRepository} from '../local'
import * as userApi from '@/apis/server/user'
import {AccessRequest, AccessResponse} from '@/apis/types/user'

export const useGetUser = () => {
  return useMutation({
    mutationFn: () => {
      return userRepository.getUser()
    }
  })
}

export const useUpdateActiveBackgroundId = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return userRepository.updateActiveBackgroundId(id)
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

export const useAccess = () => {
  return useMutation({
    mutationFn: async (params: AccessRequest) => {
      const response = await userApi.access(params)

      return response.data as AccessResponse
    }
  })
}
