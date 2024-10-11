import {useCallback} from 'react'
import {StyleSheet, FlatList, ListRenderItem, View} from 'react-native'
import TodoItem from './components/TodoItem'
import type {ChangeTodoCompleteArguments} from './components/TodoItem'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {editTodoFormState, scheduleDateState, scheduleListState} from '@/store/schedule'
import {showEditTodoModalState} from '@/store/modal'

import {updateWidget} from '@/utils/widget'
import useSetTodoComplete from './hooks/useSetTodoComplete'

import {EditTodoRequest} from '@/repository/types/todo'
import {format} from 'date-fns'

interface Props {
  data: Todo[]
}

const ScheduleTodoList = ({data}: Props) => {
  const scheduleDate = useRecoilValue(scheduleDateState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const setEditTodoFrom = useSetRecoilState(editTodoFormState)
  const setShowEditTodoModal = useSetRecoilState(showEditTodoModalState)

  const {doCompleteTodo, undoCompleteTodo} = useSetTodoComplete()

  const openEditModal = useCallback(
    (params: EditTodoRequest) => {
      setEditTodoFrom(params)
      setShowEditTodoModal(true)
    },
    [setEditTodoFrom, setShowEditTodoModal]
  )

  const updateTodoOfScheduleList = useCallback(
    (scheduleId: number, todoId: number, todoCompleteId: number | null, todoCompleteDate: string | null) => {
      const newScheduleList = scheduleList.map(scheduleItem => {
        if (scheduleId === scheduleItem.schedule_id) {
          const newTodoList = data.map(todoItem =>
            todoItem.todo_id === todoId
              ? {...todoItem, complete_id: todoCompleteId, complete_date: todoCompleteDate}
              : todoItem
          )

          return {...scheduleItem, todo_list: newTodoList}
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
        let completeDate: string | null = null

        if (isCompleted) {
          // do complete
          completeDate = format(new Date(scheduleDate), 'yyyy-MM-dd')

          completeId = await doCompleteTodo({todo_id: value.todoId, complete_date: completeDate})
        } else {
          // undo complete
          if (value.completeId) {
            await undoCompleteTodo({complete_id: value.completeId})
          }
        }

        updateTodoOfScheduleList(value.scheduleId, value.todoId, completeId, completeDate)
      } catch (e) {
        console.error(e)
      }
    },
    [scheduleDate, doCompleteTodo, undoCompleteTodo, updateTodoOfScheduleList]
  )

  const keyExtractor = useCallback((item: Todo, index: number) => {
    return String(index)
  }, [])

  const renderItem: ListRenderItem<Todo> = useCallback(
    ({item}) => {
      return (
        <TodoItem
          todoId={item.todo_id}
          completeId={item.complete_id}
          scheduleId={item.schedule_id!}
          title={item.title}
          openEditModal={openEditModal}
          onChange={handleTodoComplete}
        />
      )
    },
    [openEditModal, handleTodoComplete]
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

export default ScheduleTodoList
