import {openDatabase} from '../utils/helper'
import * as userQueries from '../queries/user'

export const getUser = async () => {
  const query = userQueries.getUser()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.item(0) as UserInfo
}

export const setUser = async (userId: string) => {
  const query = userQueries.setUser()
  const db = await openDatabase()

  await db.executeSql(query, [userId])
}

export const updateDisplayMode = async (displayMode: DisplayMode) => {
  const query = userQueries.updateDisplayModeQuery()
  const db = await openDatabase()

  return db.executeSql(query, [displayMode])
}
