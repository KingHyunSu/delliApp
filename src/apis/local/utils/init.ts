import {SQLiteDatabase} from 'react-native-sqlite-storage'

import {openDatabase} from './helper'
import upgrade from './upgrade.json'

const createTable = async (db: SQLiteDatabase) => {
  await db.transaction(tx => {
    // tx.executeSql(`
    //      DROP TABLE background
    // --   update USER set active_background_id = 1
    //  `)
    // version table
    // tx.executeSql(`
    //   CREATE TABLE IF NOT EXISTS "VERSION" (
    //     "version" INTEGER NOT NULL,
    //     PRIMARY KEY("version")
    //   )
    // `)
    // tx.executeSql('ALTER TABLE SCHEDULE ADD COLUMN font_size INTEGER default 12')
  })
}

// const getCurrentVersion = async (db: SQLiteDatabase) => {
//   const [result] = await db.executeSql('SELECT MAX(version) as maxVersion FROM VERSION')
//   const {maxVersion} = result.rows.item(0)
//
//   if (!maxVersion) {
//     const [result2] = await db.executeSql('INSERT INTO VERSION (version) VALUES (1)')
//
//     return result2.insertId
//   }
//
//   return maxVersion
// }

export default async function init() {
  try {
    // const db = await openDatabase()
    //
    // await createTable(db)
    //
    // const currentVersion = await getCurrentVersion(db)
    // const latestVersion = upgrade.version
    //
    // // upgrade db
    // if (currentVersion < latestVersion) {
    //   let upgradeQueryList: string[] = []
    //
    //   for (let i = currentVersion + 1; i <= latestVersion; i++) {
    //     const targetVersion = `v${i}`
    //     upgradeQueryList = [...upgradeQueryList, ...upgrade.list[targetVersion]]
    //   }
    //
    //   await db.transaction(tx => {
    //     for (const upgradeQuery of upgradeQueryList) {
    //       tx.executeSql(upgradeQuery)
    //     }
    //
    //     // update version
    //     tx.executeSql(`UPDATE VERSION SET version = ${latestVersion}`)
    //   })
    // }

    return true
  } catch (e) {
    console.error('failed init database!!', e)

    return false
  }
}
