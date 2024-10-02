import * as routineQueries from '@/repository/queries/routine'
import {openDatabase} from '../utils/helper'
import {Routine, RoutineDetail} from '@/@types/routine'
import {EditRoutineRequest, GetRoutineDetailRequest} from '@/repository/types/routine'

export const getRoutineList = async () => {
  const query = routineQueries.getRoutineListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw().map(item => {
    let completeDateList: string[] = []

    if (item.complete_date_list) {
      completeDateList = item.complete_date_list.split(',')
    }

    return {
      ...item,
      complete_date_list: completeDateList
    } as Routine
  })
}

export const getRoutineDetail = async (params: GetRoutineDetailRequest) => {
  const query = routineQueries.getRoutineDetailQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.routine_id])

  return result.rows.item(0) as RoutineDetail
}

export const setRoutine = async (params: EditRoutineRequest) => {
  const query = routineQueries.setRoutineQuery()
  const db = await openDatabase()

  return db.executeSql(query, [params.title, params.routine_type, params.routine_count, params.schedule_id])
}

export const updateRoutine = async (params: EditRoutineRequest) => {
  const query = routineQueries.updateRoutineQuery()
  const db = await openDatabase()

  return db.executeSql(query, [
    params.title,
    params.routine_type,
    params.routine_count,
    params.schedule_id,
    params.routine_id
  ])
}
