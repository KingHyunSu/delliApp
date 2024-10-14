import SQLite from 'react-native-sqlite-storage'

let databaseInstance: SQLite.SQLiteDatabase | null = null

export const openDatabase = async () => {
  console.log('databaseInstance', databaseInstance)

  if (databaseInstance) {
    console.log('database already open')
    return databaseInstance
  }

  SQLite.DEBUG(true)
  SQLite.enablePromise(true)

  const db = await SQLite.openDatabase({
    name: 'delli.db',
    location: 'default'
  })

  console.log('db', db)

  console.log('database new open')

  databaseInstance = db

  return db
}
