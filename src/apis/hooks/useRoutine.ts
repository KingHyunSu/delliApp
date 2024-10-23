import {useMutation} from '@tanstack/react-query'
import {todoRepository} from '@/apis/local'
import {GetRoutineCompleteListRequest} from '@/apis/local/types/todo'

export const useGetRoutineCompleteList = () => {
  return useMutation({
    mutationFn: (params: GetRoutineCompleteListRequest) => {
      return todoRepository.getRoutineCompleteList(params)
    }
  })
}
