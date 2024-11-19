import {useMutation} from '@tanstack/react-query'
import {todoRepository} from '@/apis/local'
import {DeleteTodoCompleteRequest, SetTodoCompleteRequest, SetTodoRequest, UpdateTodoRequest} from '@/apis/types/todo'

export const useGetTodoDetail = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return todoRepository.getTodoDetail({todo_id: id})
    }
  })
}

export const useSetTodo = () => {
  return useMutation({
    mutationFn: (params: SetTodoRequest) => {
      return todoRepository.setTodo(params)
    }
  })
}

export const useUpdateTodo = () => {
  return useMutation({
    mutationFn: (params: UpdateTodoRequest) => {
      return todoRepository.updateTodo(params)
    }
  })
}

export const useDeleteTodo = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return todoRepository.deleteTodo({todo_id: id})
    }
  })
}

export const useSetTodoComplete = () => {
  return useMutation({
    mutationFn: (params: SetTodoCompleteRequest) => {
      return todoRepository.setTodoComplete(params)
    }
  })
}

export const useDeleteTodoComplete = () => {
  return useMutation({
    mutationFn: (params: DeleteTodoCompleteRequest) => {
      return todoRepository.deleteTodoComplete(params)
    }
  })
}
