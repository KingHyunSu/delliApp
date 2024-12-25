import {useMutation} from '@tanstack/react-query'
import * as todoApi from '@/apis/server/todo'
import {
  SetScheduleTodoRequest,
  CompleteScheduleTodoRequest,
  UpdateScheduleTodoRequest,
  DeleteScheduleTodoRequest,
  GetScheduleTodoDetailResponse
} from '@/apis/types/todo'

export const useGetScheduleTodoDetail = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await todoApi.getScheduleTodoDetail(id)

      return response.data as GetScheduleTodoDetailResponse
    }
  })
}

export const useSetScheduleTodo = () => {
  return useMutation({
    mutationFn: async (params: SetScheduleTodoRequest) => {
      const response = await todoApi.setScheduleTodo(params)

      return response.data.schedule_todo_id
    }
  })
}

export const useUpdateScheduleTodo = () => {
  return useMutation({
    mutationFn: async (params: UpdateScheduleTodoRequest) => {
      const response = await todoApi.updateScheduleTodo(params)

      return response.data.schedule_todo_id
    }
  })
}

export const useDeleteScheduleTodo = () => {
  return useMutation({
    mutationFn: async (params: DeleteScheduleTodoRequest) => {
      return await todoApi.deleteScheduleTodo(params)
    }
  })
}

export const useCompleteScheduleTodo = () => {
  return useMutation({
    mutationFn: async (params: CompleteScheduleTodoRequest) => {
      return await todoApi.completeScheduleTodo(params)
    }
  })
}
