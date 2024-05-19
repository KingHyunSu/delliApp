import {SQLiteDatabase} from 'react-native-sqlite-storage'
import {openDatabase} from './helper'

const createTable = async (db: SQLiteDatabase) => {
  await db.transaction(tx => {
    // tx.executeSql(`
    //   DROP TABLE SCHEDULE
    // `)

    // schedule table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS "SCHEDULE" (
        "schedule_id"	INTEGER NOT NULL,
        "title"	TEXT NOT NULL,
        "start_date"	TEXT NOT NULL,
        "end_date"	TEXT NOT NULL DEFAULT '9999-00-00',
        "start_time"	INTEGER NOT NULL,
        "end_time"	INTEGER NOT NULL,
        "mon"	TEXT,
        "tue"	TEXT,
        "wed"	TEXT,
        "thu"	TEXT,
        "fri"	TEXT,
        "sat"	TEXT,
        "sun"	TEXT,
        "title_x"	INTEGER,
        "title_y"	INTEGER,
        "title_rotate"	INTEGER,
        "background_color"	TEXT,
        "text_color"	TEXT,
        "alarm"	INTEGER,
        "disable"	TEXT,
        "disable_date"	TEXT,
        "create_date"	TEXT NOT NULL,
        "update_date"	TEXT,
        PRIMARY KEY("schedule_id")
      )
    `)

    // todo table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS "TODO" (
        "todo_id"	INTEGER NOT NULL,
        "title"	TEXT NOT NULL,
        "start_date"	TEXT NOT NULL,
        "end_date"	TEXT NOT NULL DEFAULT '9999-12-31',
        "schedule_id"	INTEGER NOT NULL,
        PRIMARY KEY("todo_id" AUTOINCREMENT)
      )
    `)

    // todo_complete table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS "TODO_COMPLETE" (
        "complete_id"	INTEGER NOT NULL,
        "complete_date"	TEXT NOT NULL,
        "todo_id"	INTEGER NOT NULL,
        PRIMARY KEY("complete_id" AUTOINCREMENT),
        FOREIGN KEY("todo_id")
          REFERENCES TODO("todo_id")
          ON DELETE CASCADE
      )
    `)

    // version table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS "VERSION" (
        "version" INTEGER NOT NULL,
        PRIMARY KEY("version")
      )
    `)
  })
}

const getVersion = async (db: SQLiteDatabase) => {
  const [result] = await db.executeSql('SELECT MAX(version) as maxVersion FROM VERSION')
  const {maxVersion} = result.rows.item(0)

  if (!maxVersion) {
    const [result2] = await db.executeSql('INSERT INTO VERSION (version) VALUES (1)')

    return result2.insertId
  }

  return maxVersion
}

export default async function init() {
  try {
    const db = await openDatabase()

    await createTable(db)
    const version = await getVersion(db)

    console.log('database version : ', version)

    return true
  } catch (e) {
    console.error('failed init database!!', e)

    return false
  }
}
