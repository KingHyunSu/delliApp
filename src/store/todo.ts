import {atom} from 'recoil'

export const editTodoFormState = atom<EditTodoForm>({
  key: 'editTodoFormState',
  default: {
    todo_id: null,
    title: '',
    schedule_id: null
  }
})
