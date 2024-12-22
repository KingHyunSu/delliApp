import * as routineQueries from '@/apis/local/queries/routine'
import {openDatabase} from '../utils/helper'
import {
  GetScheduleRoutineCompleteListRequest,
  GetScheduleRoutineCompleteListResponse,
  GetScheduleRoutineDetailRequest,
  GetScheduleRoutineDetailResponse,
  SetScheduleRoutineRequest,
  UpdateScheduleRoutineRequest,
  DeleteScheduleRoutineRequest,
  CompleteScheduleRoutineRequest,
  IncompleteScheduleRoutineRequest
} from '@/apis/types/routine'

export const getScheduleRoutineCompleteList = async (params: GetScheduleRoutineCompleteListRequest) => {
  const query = routineQueries.getScheduleRoutineCompleteListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.id, params.start_date, params.end_date])

  return result.rows.raw() as GetScheduleRoutineCompleteListResponse[]
}

export const getScheduleRoutineDetail = async (params: GetScheduleRoutineDetailRequest) => {
  const query = routineQueries.getScheduleRoutineDetailQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.schedule_routine_id])

  return result.rows.item(0) as GetScheduleRoutineDetailResponse
}

export const setScheduleRoutine = async (params: SetScheduleRoutineRequest) => {
  const query = routineQueries.setScheduleRoutineQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.title, params.schedule_id])

  return result.insertId
}

export const updateScheduleRoutine = async (params: UpdateScheduleRoutineRequest) => {
  const query = routineQueries.updateScheduleRoutineQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.title, params.schedule_routine_id])

  return params.schedule_routine_id
}

export const deleteScheduleRoutine = async (params: DeleteScheduleRoutineRequest) => {
  const query = routineQueries.deleteScheduleRoutineQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.schedule_routine_id])

  return params.schedule_routine_id
}

export const completeScheduleRoutine = async (params: CompleteScheduleRoutineRequest) => {
  const query = routineQueries.completeScheduleRoutineQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.schedule_routine_id, params.schedule_routine_complete_id])

  return result.insertId
}

export const incompleteScheduleRoutine = async (params: IncompleteScheduleRoutineRequest) => {
  const query = routineQueries.incompleteScheduleRoutineQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.schedule_routine_complete_id])

  return params.schedule_routine_complete_id
}
