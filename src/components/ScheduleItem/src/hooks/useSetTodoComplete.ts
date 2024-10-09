import {useCallback} from 'react'
import {format} from 'date-fns'
import {useMutation} from '@tanstack/react-query'
import {todoCompleteRepository} from '@/repository'
import {Platform} from 'react-native'
import {trigger} from 'react-native-haptic-feedback'
import {DeleteTodoComplete, SetTodoComplete} from '@/repository/types/todoComplete'

interface Params {
  todo_id: number
  complete_id: number
  complete_date: string
}
const useSetTodoComplete = (completeDate: Date) => {
  const setScheduleTodoCompleteMutation = useMutation({
    mutationFn: (params: SetTodoComplete) => {
      return todoCompleteRepository.setScheduleTodoCompleteQuery(params)
    }
  })

  const deleteScheduleTodoCompleteMutation = useMutation({
    mutationFn: (params: DeleteTodoComplete) => {
      return todoCompleteRepository.deleteScheduleTodoCompleteQuery(params)
    }
  })

  const triggerHapticFeedback = () => {
    const triggerType = Platform.OS === 'android' ? 'effectClick' : 'impactMedium'
    trigger(triggerType, {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    })
  }

  // todo - 할일 완료하면 Promise resolve로 schedule list update 하기
  // const updateScheduleList = React.useCallback(
  //   async (item: Todo, updatedFields: Partial<Todo>) => {
  //     const newScheduleList = scheduleList.map(scheduleItem => {
  //       if (item.schedule_id === scheduleItem.schedule_id) {
  //         const newTodoList = data.map(todoItem =>
  //           todoItem.todo_id === item.todo_id ? {...todoItem, ...updatedFields} : todoItem
  //         )
  //
  //         return {...scheduleItem, todo_list: newTodoList}
  //       }
  //
  //       return scheduleItem
  //     })
  //
  //     setScheduleList(newScheduleList)
  //
  //     // TODO - 위젯에서 임시 제거
  //     // if (Platform.OS === 'ios') {
  //     //   await updateWidget()
  //     // }
  //   },
  //   [data, scheduleList, setScheduleList]
  // )

  const completeTodo = useCallback(
    async (params: SetTodoComplete) => {
      if (completeDate) {
        const formatCompleteDate = format(new Date(completeDate), 'yyyy-MM-dd')

        const result = await setScheduleTodoCompleteMutation.mutateAsync({
          todo_id: params.todo_id,
          complete_date: formatCompleteDate
        })

        triggerHapticFeedback()

        // await updateScheduleList(item, {
        //   complete_id: result.complete_id,
        //   complete_date: formatCompleteDate
        // })
      }
    },
    [completeDate, setScheduleTodoCompleteMutation]
  )

  const undoCompleteTodo = useCallback(
    async (params: DeleteTodoComplete) => {
      await deleteScheduleTodoCompleteMutation.mutateAsync({
        complete_id: params.complete_id
      })

      triggerHapticFeedback()

      // await updateScheduleList(item, {
      //   complete_id: null,
      //   complete_date: null
      // })
    },
    [deleteScheduleTodoCompleteMutation]
  )

  return {
    completeTodo,
    undoCompleteTodo
  }
  //
  // return useCallback(
  //   async (params: Params) => {
  //     console.log('123123123123123 handleTodoComplete', params)
  //     // if (!item.todo_id || (value && !item.todo_id) || (!value && !item.complete_id)) {
  //     //   // [TODO] error check...
  //     //   return
  //     // }
  //     //
  //     // if (value) {
  //     //   await completeTodoItem(item)
  //     // } else {
  //     //   await undoCompleteTodoItem(item)
  //     // }
  //   },
  //   [completeTodoItem, undoCompleteTodoItem]
  // )
}

export default useSetTodoComplete
