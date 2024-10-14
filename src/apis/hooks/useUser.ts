import {useQuery} from '@tanstack/react-query'
import {userRepository} from '../local'

export const useGetUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => {
      return userRepository.getUser()
    }
  })
}
