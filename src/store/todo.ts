import {atom} from 'recoil'

export const editTodoFormState = atom<EditTodoForm | null>({
  key: 'editTodoFormState',
  default: null
})
