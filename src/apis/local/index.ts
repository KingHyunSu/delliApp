import {openDatabase} from './utils/helper'
import * as userRepository from './modules/user'
import * as scheduleRepository from './modules/schedule'
import * as statsRepository from './modules/stats'
import * as routineRepository from './modules/routine'
import * as todoRepository from './modules/todo'
import * as colorRepository from './modules/color'
import * as productRepository from './modules/product'

export {
  userRepository,
  scheduleRepository,
  statsRepository,
  routineRepository,
  todoRepository,
  colorRepository,
  productRepository
}
export default openDatabase
