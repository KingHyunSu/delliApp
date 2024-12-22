import http from '@/utils/http'
import {
  CompleteScheduleRoutineRequest,
  CompleteScheduleRoutineResponse,
  DeleteScheduleRoutineRequest,
  DeleteScheduleRoutineResponse,
  GetScheduleRoutineCompleteListRequest,
  GetScheduleRoutineCompleteListResponse,
  GetScheduleRoutineDetailResponse,
  IncompleteScheduleRoutineRequest,
  IncompleteScheduleRoutineResponse,
  SetScheduleRoutineRequest,
  SetScheduleRoutineResponse,
  UpdateScheduleRoutineRequest,
  UpdateScheduleRoutineResponse
} from '@/apis/types/routine'

export const getScheduleRoutineDetail = (id: number) => {
  return http.get<any, Response<GetScheduleRoutineDetailResponse>>(`routine/schedule/${id}`)
}

export const setScheduleRoutine = (data: SetScheduleRoutineRequest) => {
  return http.post<any, Response<SetScheduleRoutineResponse>>('routine/schedule', data)
}

export const updateScheduleRoutine = (data: UpdateScheduleRoutineRequest) => {
  return http.post<any, Response<UpdateScheduleRoutineResponse>>('routine/schedule/update', data)
}

export const deleteScheduleRoutine = (data: DeleteScheduleRoutineRequest) => {
  return http.post<any, Response<DeleteScheduleRoutineResponse>>('routine/schedule/delete', data)
}

export const getScheduleRoutineCompleteList = (params: GetScheduleRoutineCompleteListRequest) => {
  return http.get<any, Response<GetScheduleRoutineCompleteListResponse[]>>('routine/schedule/complete/list', {params})
}

export const completeScheduleRoutine = (data: CompleteScheduleRoutineRequest) => {
  return http.post<any, Response<CompleteScheduleRoutineResponse>>('routine/schedule/complete', data)
}

export const incompleteScheduleRoutine = (data: IncompleteScheduleRoutineRequest) => {
  return http.post<any, Response<IncompleteScheduleRoutineResponse>>('routine/schedule/incomplete', data)
}
