import React from 'react'
import {StyleSheet, FlatList, ListRenderItem, View} from 'react-native'
import TodoItem from './components/TodoItem'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {editTodoFormState, scheduleDateState, scheduleListState} from '@/store/schedule'
import {showEditTodoModalState} from '@/store/modal'

import {updateWidget} from '@/utils/widget'
import useSetTodoComplete from './hooks/useSetTodoComplete'

//repository
import {UpdateTodoRequest} from '@/repository/types/todo'
import {format} from 'date-fns'

interface Props {
  data: Todo[]
}

const ScheduleTodoList = ({data}: Props) => {
  const scheduleDate = useRecoilValue(scheduleDateState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const setEditTodoFrom = useSetRecoilState(editTodoFormState)
  const setShowEditTodoModal = useSetRecoilState(showEditTodoModalState)

  const {completeTodo, undoCompleteTodo} = useSetTodoComplete(scheduleDate)

  const openEditModal = React.useCallback(
    (params: UpdateTodoRequest) => {
      setEditTodoFrom(params)
      setShowEditTodoModal(true)
    },
    [setEditTodoFrom, setShowEditTodoModal]
  )

  const handleTodoComplete = React.useCallback(
    async (visible: boolean, todo_id: number, complete_id: number | null) => {
      if (visible) {
        const completeDate = format(new Date(scheduleDate), 'yyyy-MM-dd')

        await completeTodo({
          todo_id,
          complete_date: completeDate
        })
      } else {
        if (!complete_id) {
          console.error('error')
          return
        }

        await undoCompleteTodo({complete_id: complete_id})
      }
    },
    []
  )

  const keyExtractor = React.useCallback((item: Todo, index: number) => {
    return String(index)
  }, [])

  const renderItem: ListRenderItem<Todo> = React.useCallback(
    ({item}) => {
      return (
        <TodoItem
          todoId={item.todo_id}
          completeId={item.complete_id}
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
