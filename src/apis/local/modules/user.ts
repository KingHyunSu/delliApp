import {openDatabase} from '../utils/helper'
import * as userQueries from '../queries/user'
import {v4 as uuidV4} from 'uuid'

export const getUser = async () => {
  const query = userQueries.getUser()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.item(0) as UserInfo
}

export const setUser = async () => {
  const query = userQueries.setUser()
  const db = await openDatabase()

  const userId = uuidV4()

  await db.executeSql(query, [userId])
}

export const updateDisplayMode = async (displayMode: DisplayMode) => {
  const query = userQueries.updateDisplayModeQuery()
  const db = await openDatabase()

  return db.executeSql(query, [displayMode])
}
