import {useCallback} from 'react'
import {useMutation} from '@tanstack/react-query'
import {todoCompleteRepository} from '@/repository'
import {Platform} from 'react-native'
import {trigger} from 'react-native-haptic-feedback'
import {DeleteTodoComplete, SetTodoComplete} from '@/repository/types/todoComplete'

const useSetTodoComplete = () => {
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

  const doCompleteTodo = useCallback(
    async (params: SetTodoComplete) => {
      try {
        const result = await setScheduleTodoCompleteMutation.mutateAsync({
          todo_id: params.todo_id,
          complete_date: params.complete_date
        })

        triggerHapticFeedback()

        return result.complete_id
      } catch (e) {
        throw new Error('할 일 완료 실패')
      }
    },
    [setScheduleTodoCompleteMutation]
  )

  const undoCompleteTodo = useCallback(
    async (params: DeleteTodoComplete) => {
      try {
        await deleteScheduleTodoCompleteMutation.mutateAsync({
          complete_id: params.complete_id
        })

        triggerHapticFeedback()
      } catch (e) {
        throw new Error('할 일 미완료 실패')
      }
    },
    [deleteScheduleTodoCompleteMutation]
  )

  return {
    doCompleteTodo,
    undoCompleteTodo
  }
}

export default useSetTodoComplete
