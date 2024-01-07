import {atom} from 'recoil'

export const showScheduleCompleteModalState = atom({
  key: 'scheduleCompleteModal',
  default: false
})

export const showEditTodoModalState = atom({
  key: 'showEditTodoModalState',
  default: false
})
