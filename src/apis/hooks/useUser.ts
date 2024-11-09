import {useMutation} from '@tanstack/react-query'
import {userRepository} from '../local'

export const useGetUser = () => {
  return useMutation({
    mutationFn: () => {
      return userRepository.getUser()
    }
  })
}
