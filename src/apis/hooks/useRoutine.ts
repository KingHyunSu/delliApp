import {useMutation} from '@tanstack/react-query'
import * as routineApi from '@/apis/server/routine'
import {routineRepository} from '@/apis/local'
import {
  GetScheduleRoutineCompleteListRequest,
  SetScheduleRoutineRequest,
  UpdateScheduleRoutineRequest,
  CompleteScheduleRoutineRequest,
  IncompleteScheduleRoutineRequest,
  DeleteScheduleRoutineRequest
} from '@/apis/types/routine'
import {useRecoilValue} from 'recoil'
import {isLoginState} from '@/store/user'

export const useGetScheduleRoutineDetail = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (id: number) => {
      if (isLogin) {
        const response = await routineApi.getScheduleRoutineDetail(id)

        return response.data
      }

      return await routineRepository.getScheduleRoutineDetail({schedule_routine_id: id})
    }
  })
}

export const useSetScheduleRoutine = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: SetScheduleRoutineRequest) => {
      if (isLogin) {
        const response = await routineApi.setScheduleRoutine(params)

        return response.data.schedule_routine_id
      }

      return await routineRepository.setScheduleRoutine(params)
    }
  })
}

export const useUpdateScheduleRoutine = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: UpdateScheduleRoutineRequest) => {
      if (isLogin) {
        const response = await routineApi.updateScheduleRoutine(params)

        return response.data.schedule_routine_id
      }

      return await routineRepository.updateScheduleRoutine(params)
    }
  })
}

export const useDeleteScheduleRoutine = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: DeleteScheduleRoutineRequest) => {
      if (isLogin) {
        return await routineApi.deleteScheduleRoutine(params)
      }

      return await routineRepository.deleteScheduleRoutine(params)
    }
  })
}

export const useGetScheduleRoutineCompleteList = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: GetScheduleRoutineCompleteListRequest) => {
      if (isLogin) {
        const response = await routineApi.getScheduleRoutineCompleteList(params)

        return response.data
      }

      return await routineRepository.getScheduleRoutineCompleteList(params)
    }
  })
}

export const useCompleteScheduleRoutine = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: CompleteScheduleRoutineRequest) => {
      if (isLogin) {
        const response = await routineApi.completeScheduleRoutine(params)

        return response.data.schedule_routine_complete_id
      }

      return await routineRepository.completeScheduleRoutine(params)
    }
  })
}

export const useIncompleteScheduleRoutine = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: IncompleteScheduleRoutineRequest) => {
      if (isLogin) {
        const response = await routineApi.incompleteScheduleRoutine(params)

        return response.data.schedule_routine_complete_id
      }

      return await routineRepository.incompleteScheduleRoutine(params)
    }
  })
}
