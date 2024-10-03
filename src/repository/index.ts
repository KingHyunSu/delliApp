import {openDatabase} from './utils/helper'
import * as userRepository from './modules/user'
import * as scheduleRepository from './modules/schedule'
import * as goalRepository from './modules/goal'
import * as statsRepository from './modules/stats'
import * as todoRepository from './modules/todo'
import * as todoCompleteRepository from './modules/todoComplete'

export {userRepository, scheduleRepository, goalRepository, statsRepository, todoRepository, todoCompleteRepository}
export default openDatabase
