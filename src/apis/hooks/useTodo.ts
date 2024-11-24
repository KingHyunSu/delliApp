import {useMutation} from '@tanstack/react-query'
import {todoRepository} from '@/apis/local'
import {SetScheduleTodoRequest, UpdateScheduleTodoCompleteRequest, UpdateScheduleTodoRequest} from '@/apis/types/todo'

export const useGetScheduleTodoDetail = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return todoRepository.getScheduleTodoDetail({schedule_todo_id: id})
    }
  })
}

export const useSetScheduleTodo = () => {
  return useMutation({
    mutationFn: (params: SetScheduleTodoRequest) => {
      return todoRepository.setScheduleTodo(params)
    }
  })
}

export const useUpdateScheduleTodo = () => {
  return useMutation({
    mutationFn: (params: UpdateScheduleTodoRequest) => {
      return todoRepository.updateScheduleTodo(params)
    }
  })
}

export const useDeleteScheduleTodo = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return todoRepository.deleteScheduleTodo({schedule_todo_id: id})
    }
  })
}

export const useUpdateScheduleTodoComplete = () => {
  return useMutation({
    mutationFn: (params: UpdateScheduleTodoCompleteRequest) => {
      return todoRepository.updateScheduleTodoComplete(params)
    }
  })
}
