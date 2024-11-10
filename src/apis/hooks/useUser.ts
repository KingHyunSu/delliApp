import {useMutation} from '@tanstack/react-query'
import {userRepository} from '../local'

export const useGetUser = () => {
  return useMutation({
    mutationFn: () => {
      return userRepository.getUser()
    }
  })
}

export const useUpdateTheme = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return userRepository.updateTheme(id)
    }
  })
}
