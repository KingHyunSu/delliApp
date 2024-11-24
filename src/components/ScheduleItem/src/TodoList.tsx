import {useCallback} from 'react'
import {StyleSheet, FlatList, ListRenderItem, View} from 'react-native'
import TodoItem from './components/TodoItem'

import {useRecoilState, useRecoilValue} from 'recoil'
import {scheduleDateState, scheduleListState} from '@/store/schedule'

import {useUpdateScheduleTodoComplete} from '@/apis/hooks/useTodo'

import {updateWidget} from '@/utils/widget'

import {format} from 'date-fns'
import {navigate} from '@/utils/navigation'

interface Props {
  data: ScheduleTodo[]
  activeTheme: ActiveTheme
}

const ScheduleTodoList = ({data, activeTheme}: Props) => {
  const {mutateAsync: updateScheduleTodoCompleteMutateAsync} = useUpdateScheduleTodoComplete()

  const scheduleDate = useRecoilValue(scheduleDateState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)

  const moveEdit = useCallback((value: ScheduleTodo) => {
    navigate('EditTodo', {scheduleId: value.schedule_id, todoId: value.schedule_todo_id})
  }, [])

  const getNewScheduleList = useCallback(
    (newTodo: ScheduleTodo) => {
      return scheduleList.map(scheduleItem => {
        if (scheduleItem.schedule_id === newTodo.schedule_id) {
          const newTodoList = scheduleItem.todo_list.map(todoItem => {
            if (todoItem.schedule_todo_id === newTodo.schedule_todo_id) {
              return newTodo
            }

            return todoItem
          })

          return {...scheduleItem, todo_list: newTodoList}
        }

        return scheduleItem
      })
    },
    [scheduleList]
  )

  const handleTodoComplete = useCallback(
    async (isCompleted: boolean, value: ScheduleTodo) => {
      let newTodo = {...value}

      if (isCompleted) {
        const completeDate = format(new Date(scheduleDate), 'yyyy-MM-dd')

        await updateScheduleTodoCompleteMutateAsync({
          schedule_todo_id: value.schedule_todo_id,
          complete_date: completeDate
        })

        newTodo = {
          ...newTodo,
          complete_date: completeDate
        }
      } else {
        await updateScheduleTodoCompleteMutateAsync({
          schedule_todo_id: value.schedule_todo_id,
          complete_date: null
        })

        newTodo = {
          ...newTodo,
          complete_date: null
        }
      }

      const newScheduleList = getNewScheduleList(newTodo)
      setScheduleList(newScheduleList)
    },
    [scheduleDate, updateScheduleTodoCompleteMutateAsync, getNewScheduleList, setScheduleList]
  )

  const keyExtractor = useCallback((item: ScheduleTodo, index: number) => {
    return String(index)
  }, [])

  const renderItem: ListRenderItem<ScheduleTodo> = useCallback(
    ({item}) => {
      return <TodoItem value={item} activeTheme={activeTheme} moveEdit={moveEdit} onChange={handleTodoComplete} />
    },
    [activeTheme, moveEdit, handleTodoComplete]
  )

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      style={[styles.container, {backgroundColor: activeTheme.color5}]}
      renderItem={renderItem}
      ItemSeparatorComponent={() => {
        return <View style={{height: 1, backgroundColor: activeTheme.color6}} />
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10
  }
})

export default ScheduleTodoList
