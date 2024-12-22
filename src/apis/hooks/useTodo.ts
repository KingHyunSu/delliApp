import {useMutation} from '@tanstack/react-query'
import {todoRepository} from '@/apis/local'
import * as todoApi from '@/apis/server/todo'
import {
  SetScheduleTodoRequest,
  CompleteScheduleTodoRequest,
  UpdateScheduleTodoRequest,
  DeleteScheduleTodoRequest,
  GetScheduleTodoDetailResponse
} from '@/apis/types/todo'
import {useRecoilValue} from 'recoil'
import {isLoginState} from '@/store/user'

export const useGetScheduleTodoDetail = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (id: number) => {
      if (isLogin) {
        const response = await todoApi.getScheduleTodoDetail(id)

        return response.data as GetScheduleTodoDetailResponse
      }
      return await todoRepository.getScheduleTodoDetail({schedule_todo_id: id})
    }
  })
}

export const useSetScheduleTodo = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: SetScheduleTodoRequest) => {
      if (isLogin) {
        const response = await todoApi.setScheduleTodo(params)

        return response.data.schedule_todo_id
      }
      return await todoRepository.setScheduleTodo(params)
    }
  })
}

export const useUpdateScheduleTodo = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: UpdateScheduleTodoRequest) => {
      if (isLogin) {
        const response = await todoApi.updateScheduleTodo(params)

        return response.data.schedule_todo_id
      }
      return await todoRepository.updateScheduleTodo(params)
    }
  })
}

export const useDeleteScheduleTodo = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: DeleteScheduleTodoRequest) => {
      if (isLogin) {
        return await todoApi.deleteScheduleTodo(params)
      }
      return await todoRepository.deleteScheduleTodo(params)
    }
  })
}

export const useCompleteScheduleTodo = () => {
  const isLogin = useRecoilValue(isLoginState)

  return useMutation({
    mutationFn: async (params: CompleteScheduleTodoRequest) => {
      if (isLogin) {
        return await todoApi.completeScheduleTodo(params)
      }
      return await todoRepository.completeScheduleTodo(params)
    }
  })
}
