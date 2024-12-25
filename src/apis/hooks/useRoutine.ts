import {useMutation} from '@tanstack/react-query'
import * as routineApi from '@/apis/server/routine'
import {
  GetScheduleRoutineCompleteListRequest,
  SetScheduleRoutineRequest,
  UpdateScheduleRoutineRequest,
  CompleteScheduleRoutineRequest,
  IncompleteScheduleRoutineRequest,
  DeleteScheduleRoutineRequest
} from '@/apis/types/routine'

export const useGetScheduleRoutineDetail = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await routineApi.getScheduleRoutineDetail(id)

      return response.data
    }
  })
}

export const useSetScheduleRoutine = () => {
  return useMutation({
    mutationFn: async (params: SetScheduleRoutineRequest) => {
      const response = await routineApi.setScheduleRoutine(params)

      return response.data.schedule_routine_id
    }
  })
}

export const useUpdateScheduleRoutine = () => {
  return useMutation({
    mutationFn: async (params: UpdateScheduleRoutineRequest) => {
      const response = await routineApi.updateScheduleRoutine(params)

      return response.data.schedule_routine_id
    }
  })
}

export const useDeleteScheduleRoutine = () => {
  return useMutation({
    mutationFn: async (params: DeleteScheduleRoutineRequest) => {
      return await routineApi.deleteScheduleRoutine(params)
    }
  })
}

export const useGetScheduleRoutineCompleteList = () => {
  return useMutation({
    mutationFn: async (params: GetScheduleRoutineCompleteListRequest) => {
      const response = await routineApi.getScheduleRoutineCompleteList(params)

      return response.data
    }
  })
}

export const useCompleteScheduleRoutine = () => {
  return useMutation({
    mutationFn: async (params: CompleteScheduleRoutineRequest) => {
      const response = await routineApi.completeScheduleRoutine(params)

      return response.data.schedule_routine_complete_id
    }
  })
}

export const useIncompleteScheduleRoutine = () => {
  return useMutation({
    mutationFn: async (params: IncompleteScheduleRoutineRequest) => {
      const response = await routineApi.incompleteScheduleRoutine(params)

      return response.data.schedule_routine_complete_id
    }
  })
}
