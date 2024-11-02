import {useMutation, useQuery} from '@tanstack/react-query'
import {colorRepository} from '../local'
import {DeleteColorRequest, SetColorRequest} from '@/apis/local/types/color'

export const useGetColorList = () => {
  return useQuery({
    queryKey: ['colorList'],
    queryFn: () => {
      return colorRepository.getColorList()
    },
    initialData: []
  })
}

export const useSetColor = () => {
  return useMutation({
    mutationFn: (params: SetColorRequest) => {
      return colorRepository.setColor(params)
    }
  })
}

export const useDeleteColor = () => {
  return useMutation({
    mutationFn: (params: DeleteColorRequest) => {
      return colorRepository.deleteColor(params)
    }
  })
}
