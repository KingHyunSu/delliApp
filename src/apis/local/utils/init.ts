import {SQLiteDatabase} from 'react-native-sqlite-storage'
import 'react-native-get-random-values'

import {openDatabase} from './helper'
import upgrade from './upgrade.json'
import {userRepository, productRepository} from '../index'

const createTable = async (db: SQLiteDatabase) => {
  await db.transaction(tx => {
    // tx.executeSql(`
    //   DROP TABLE THEME
    // `)

    // user table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS "USER" (
        "user_id" TEXT NOT NULL
      );
    `)

    // theme table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS "THEME" (
        "theme_id" INTEGER NOT NULL,
        "file_name" TEXT NOT NULL,
        "main_color" TEXT NOT NULL,
        "sub_color" TEXT NOT NULL,
        "text_color" TEXT NOT NULL
      )
    `)

    tx.executeSql(`
      CREATE INDEX IF NOT EXISTS "idx_theme_id" ON "THEME" ("theme_id")
    `)

    // schedule table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS "SCHEDULE" (
        "schedule_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
        "update_date"	TEXT
      )
    `)

    // todo table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS "TODO" (
        "todo_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "title"	TEXT NOT NULL,
        "start_date"	TEXT NOT NULL,
        "end_date"	TEXT NOT NULL DEFAULT '9999-12-31',
        "schedule_id"	INTEGER NOT NULL
      )
    `)

    // todo_complete table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS "TODO_COMPLETE" (
        "complete_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "complete_date"	TEXT NOT NULL,
        "todo_id"	INTEGER NOT NULL,
        FOREIGN KEY("todo_id")
          REFERENCES TODO("todo_id")
          ON DELETE CASCADE
      )
    `)

    // color table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS "COLOR" (
        "color_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "color" TEXT NOT NULL,
        "create_date" TEXT NOT NULL
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

const getCurrentVersion = async (db: SQLiteDatabase) => {
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
    await userRepository.setUser()
    await productRepository.setDefaultTheme()

    const currentVersion = await getCurrentVersion(db)
    const latestVersion = upgrade.version

    // upgrade db
    if (currentVersion < latestVersion) {
      let upgradeQueryList: string[] = []

      for (let i = currentVersion + 1; i <= latestVersion; i++) {
        const targetVersion = `v${i}`
        upgradeQueryList = [...upgradeQueryList, ...upgrade.list[targetVersion]]
      }

      await db.transaction(tx => {
        for (const upgradeQuery of upgradeQueryList) {
          tx.executeSql(upgradeQuery)
        }

        // update version
        tx.executeSql(`UPDATE VERSION SET version = ${latestVersion}`)
      })
    }

    return true
  } catch (e) {
    console.error('failed init database!!', e)

    return false
  }
}
