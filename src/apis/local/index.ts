import {openDatabase} from './utils/helper'
import * as scheduleRepository from './modules/schedule'
import * as statsRepository from './modules/stats'
import * as routineRepository from './modules/routine'
import * as todoRepository from './modules/todo'
import * as colorRepository from './modules/color'

export {scheduleRepository, statsRepository, routineRepository, todoRepository, colorRepository}
export default openDatabase
