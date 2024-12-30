import http from '@/utils/http'
import {
  CompleteScheduleTodoRequest,
  CompleteScheduleTodoResponse,
  DeleteScheduleTodoRequest,
  DeleteScheduleTodoResponse,
  GetScheduleTodoDetailResponse,
  SetScheduleTodoRequest,
  SetScheduleTodoResponse,
  UpdateScheduleTodoRequest,
  UpdateScheduleTodoResponse
} from '@/apis/types/todo'

export const getScheduleTodoDetail = (id: number) => {
  return http.get<any, Response<GetScheduleTodoDetailResponse>>(`todo/schedule/${id}`)
}

export const setScheduleTodo = (data: SetScheduleTodoRequest) => {
  return http.post<any, Response<SetScheduleTodoResponse>>('todo/schedule', data)
}

export const updateScheduleTodo = (data: UpdateScheduleTodoRequest) => {
  return http.post<any, Response<UpdateScheduleTodoResponse>>('todo/schedule/update', data)
}

export const completeScheduleTodo = (data: CompleteScheduleTodoRequest) => {
  return http.post<any, Response<CompleteScheduleTodoResponse>>('todo/schedule/complete', data)
}

export const deleteScheduleTodo = (data: DeleteScheduleTodoRequest) => {
  return http.post<any, Response<DeleteScheduleTodoResponse>>('todo/schedule/delete', data)
}
