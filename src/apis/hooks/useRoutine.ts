import {useMutation} from '@tanstack/react-query'
import {routineRepository} from '@/apis/local'
import {
  DeleteRoutineDeleteRequest,
  GetRoutineCompleteListRequest,
  SetRoutineDeleteRequest,
  SetRoutineRequest,
  UpdateRoutineRequest
} from '@/apis/types/routine'

export const useGetRoutineDetail = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return routineRepository.getRoutineDetail({routine_id: id})
    }
  })
}

export const useGetRoutineCompleteList = () => {
  return useMutation({
    mutationFn: (params: GetRoutineCompleteListRequest) => {
      return routineRepository.getRoutineCompleteList(params)
    }
  })
}

export const useSetRoutine = () => {
  return useMutation({
    mutationFn: (params: SetRoutineRequest) => {
      return routineRepository.setRoutine(params)
    }
  })
}

export const useUpdateRoutine = () => {
  return useMutation({
    mutationFn: (params: UpdateRoutineRequest) => {
      return routineRepository.updateRoutine(params)
    }
  })
}

export const useDeleteRoutine = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return routineRepository.deleteRoutine({routine_id: id})
    }
  })
}

export const useSetRoutineComplete = () => {
  return useMutation({
    mutationFn: (params: SetRoutineDeleteRequest) => {
      return routineRepository.setRoutineComplete(params)
    }
  })
}

export const useDeleteRoutineComplete = () => {
  return useMutation({
    mutationFn: (params: DeleteRoutineDeleteRequest) => {
      return routineRepository.deleteRoutineComplete(params)
    }
  })
}
