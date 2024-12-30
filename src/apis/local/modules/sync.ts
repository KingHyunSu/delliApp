import {openDatabase} from '../utils/helper'
import {
  GetScheduleRoutineCompleteListResponse,
  GetRoutineListResponse,
  GetScheduleListResponse,
  GetScheduleTodoListResponse
} from '@/apis/types/sync'

export const getSyncData = async () => {
  try {
    const getScheduleListQuery = 'SELECT * FROM SCHEDULE WHERE sync = 0'
    const getScheduleTodoListQuery = 'SELECT * FROM schedule_todo WHERE sync = 0'
    const getScheduleRoutineListQuery = 'SELECT * FROM schedule_routine WHERE sync = 0'
    const getScheduleRoutineCompleteListQuery = 'SELECT * FROM schedule_routine_complete WHERE sync = 0'

    const db = await openDatabase()

    const [scheduleListResult] = await db.executeSql(getScheduleListQuery)
    const [scheduleTodoListResult] = await db.executeSql(getScheduleTodoListQuery)
    const [scheduleRoutineListResult] = await db.executeSql(getScheduleRoutineListQuery)
    const [scheduleRoutineCompleteListResult] = await db.executeSql(getScheduleRoutineCompleteListQuery)

    return {
      scheduleList: scheduleListResult.rows.raw() as GetScheduleListResponse[],
      scheduleTodoList: scheduleTodoListResult.rows.raw() as GetScheduleTodoListResponse[],
      scheduleRoutineList: scheduleRoutineListResult.rows.raw() as GetRoutineListResponse[],
      scheduleRoutineCompleteList:
        scheduleRoutineCompleteListResult.rows.raw() as GetScheduleRoutineCompleteListResponse[]
    }
  } catch (e) {
    return null
  }
}

export const updateSyncData = async () => {
  const updateScheduleListQuery = 'UPDATE SCHEDULE SET sync = 1'
  const updateScheduleTodoListQuery = 'UPDATE schedule_todo SET sync = 1'
  const updateScheduleRoutineListQuery = 'UPDATE schedule_routine SET sync = 1'
  const updateScheduleRoutineCompleteListQuery = 'UPDATE schedule_routine_complete SET sync = 1'

  const db = await openDatabase()

  try {
    await db.transaction(tx => {
      tx.executeSql(updateScheduleListQuery)
      tx.executeSql(updateScheduleTodoListQuery)
      tx.executeSql(updateScheduleRoutineListQuery)
      tx.executeSql(updateScheduleRoutineCompleteListQuery)
    })

    return true
  } catch (e) {
    return false
  }
}
