import {useCallback} from 'react'
import {StyleSheet, FlatList, ListRenderItem, View} from 'react-native'
import TodoItem from './components/TodoItem'
import type {ChangeTodoCompleteArguments} from './components/TodoItem'

import {useRecoilState, useRecoilValue} from 'recoil'
import {scheduleDateState, scheduleListState} from '@/store/schedule'

import {updateWidget} from '@/utils/widget'
import useSetTodoComplete from './hooks/useSetTodoComplete'

import {format} from 'date-fns'

interface Props {
  data: Routine[]
}

const ScheduleRoutineList = ({data}: Props) => {
  const scheduleDate = useRecoilValue(scheduleDateState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)

  const {doCompleteTodo, undoCompleteTodo} = useSetTodoComplete()

  const updateRoutineOfScheduleList = useCallback(
    (scheduleId: number, todoId: number, todoCompleteId: number | null, targetDate: string) => {
      const newScheduleList = scheduleList.map(scheduleItem => {
        if (scheduleId === scheduleItem.schedule_id) {
          const newRoutineList = data.map(routineItem => {
            if (routineItem.todo_id === todoId) {
              let completeDateList = [...routineItem.complete_date_list]

              if (todoCompleteId) {
                completeDateList.push(targetDate)
              } else {
                completeDateList = completeDateList.filter(completeDateItem => completeDateItem !== targetDate)
              }

              return {
                ...routineItem,
                complete_id: todoCompleteId,
                complete_date: todoCompleteId ? targetDate : null,
                complete_date_list: completeDateList
              }
            }

            return routineItem
          })

          return {...scheduleItem, routine_list: newRoutineList}
        }

        return scheduleItem
      })

      setScheduleList(newScheduleList)

      // TODO - 위젯에서 임시 제거
      // if (Platform.OS === 'ios') {
      //   await updateWidget()
      // }
    },
    [data, scheduleList, setScheduleList]
  )

  const handleTodoComplete = useCallback(
    async (isCompleted: boolean, value: ChangeTodoCompleteArguments) => {
      try {
        let completeId: number | null = null
        const targetDate = format(new Date(scheduleDate), 'yyyy-MM-dd')

        if (isCompleted) {
          // do complete

          completeId = await doCompleteTodo({todo_id: value.todoId, complete_date: targetDate})
        } else {
          // undo complete
          if (value.completeId) {
            await undoCompleteTodo({complete_id: value.completeId})
          }
        }

        updateRoutineOfScheduleList(value.scheduleId, value.todoId, completeId, targetDate)
      } catch (e) {
        console.error(e)
      }
    },
    [scheduleDate, doCompleteTodo, undoCompleteTodo, updateRoutineOfScheduleList]
  )

  const keyExtractor = useCallback((item: Routine, index: number) => {
    return String(index)
  }, [])

  const renderItem: ListRenderItem<Routine> = useCallback(
    ({item}) => {
      return (
        <TodoItem
          todoId={item.todo_id}
          completeId={item.complete_id}
          scheduleId={item.schedule_id!}
          title={item.title}
          completeDateList={item.complete_date_list}
          onChange={handleTodoComplete}
        />
      )
    },
    [handleTodoComplete]
  )

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      style={styles.container}
      renderItem={renderItem}
      ItemSeparatorComponent={() => {
        return <View style={styles.itemSeparator} />
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#f9f9f9'
  }
})

export default ScheduleRoutineList
