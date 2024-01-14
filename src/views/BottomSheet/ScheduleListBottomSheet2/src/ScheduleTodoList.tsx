import React from 'react'
import {StyleSheet, FlatList, Pressable, View, Text} from 'react-native'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {scheduleDateState, scheduleListState, scheduleTodoState} from '@/store/schedule'
import {showEditTodoModalState} from '@/store/modal'

import {useMutation} from '@tanstack/react-query'
import {setScheduleTodoComplete, deleteScheduleTodoComplete} from '@/apis/schedule'

import {format} from 'date-fns'
import {trigger} from 'react-native-haptic-feedback'

import CheckIcon from '@/assets/icons/check.svg'
import MoreIcon from '@/assets/icons/more_horiz.svg'

interface Props {
  data: Todo[]
}
interface ItemProps {
  item: Todo
  showEditModal: Function
  onChange: Function
}
const ScheduleTodo = ({item, showEditModal, onChange}: ItemProps) => {
  const isComplete = React.useMemo(() => {
    return !!item.complete_id
  }, [item.complete_id])

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemWrapper}>
        <Pressable style={styles.checkButtonWrapper} onPress={() => onChange(!isComplete, item)}>
          <View style={[styles.checkButton, isComplete && styles.activeCheckButton]}>
            {isComplete && <CheckIcon width={16} height={16} strokeWidth={3} stroke="#fff" />}
          </View>
        </Pressable>
        <Text style={styles.text}>{item.title}</Text>
      </View>

      <Pressable style={styles.moreButton} onPress={() => showEditModal(item)}>
        <MoreIcon width={18} height={18} fill="#babfc5" />
      </Pressable>
    </View>
  )
}

const ScheduleTodoList = ({data}: Props) => {
  const scheduleDate = useRecoilValue(scheduleDateState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const scheduleTodo = useSetRecoilState(scheduleTodoState)
  const setShowEditTodoModal = useSetRecoilState(showEditTodoModalState)

  const showEditModal = (item: Todo) => {
    scheduleTodo(item)
    setShowEditTodoModal(true)
  }

  const setScheduleTodoCompleteMutation = useMutation({
    mutationFn: (params: SetScheduleTodoCompleteRequest) => {
      return setScheduleTodoComplete(params)
    }
  })

  const deleteScheduleTodoCompleteMutation = useMutation({
    mutationFn: (params: DeleteScheduleTodoCompleteRequest) => {
      return deleteScheduleTodoComplete(params)
    }
  })

  const handleScheduleTodoComplete = async (value: boolean, item: Todo) => {
    // [TODO] 쓰로틀링 걸어서 마지막 요청만 전송되게 수정하기

    if (value) {
      if (!item.todo_id) {
        // [TODO] error check...
        return
      }

      const params: SetScheduleTodoCompleteRequest = {
        todo_id: item.todo_id,
        complete_date: format(new Date(scheduleDate), 'yyyy-MM-dd')
      }

      const response = await setScheduleTodoCompleteMutation.mutateAsync(params)

      trigger('notificationSuccess', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false
      })

      const result = response.data

      const newScheduleList = scheduleList.map(scheduleItem => {
        if (item.schedule_id === scheduleItem.schedule_id) {
          let newTodoList = [...data]

          const updateTodoIndex = newTodoList.findIndex(todoItem => todoItem.todo_id === item.todo_id)

          if (updateTodoIndex !== -1) {
            newTodoList[updateTodoIndex] = {
              ...newTodoList[updateTodoIndex],
              complete_id: result.complete_id,
              complete_date: format(new Date(scheduleDate), 'yyyy-MM-dd')
            }
          }

          return {
            ...scheduleItem,
            todo_list: newTodoList
          }
        }

        return scheduleItem
      })

      setScheduleList(newScheduleList)
    } else {
      if (!item.complete_id) {
        // [TODO] error check...
        return
      }

      const params: DeleteScheduleTodoCompleteRequest = {
        complete_id: item.complete_id
      }

      await deleteScheduleTodoCompleteMutation.mutateAsync(params)

      const newScheduleList = scheduleList.map(scheduleItem => {
        if (item.schedule_id === scheduleItem.schedule_id) {
          let newTodoList = [...data]

          const updateTodoIndex = newTodoList.findIndex(todoItem => todoItem.todo_id === item.todo_id)

          if (updateTodoIndex !== -1) {
            newTodoList[updateTodoIndex] = {
              ...newTodoList[updateTodoIndex],
              complete_id: null,
              complete_date: null
            }
          }

          return {
            ...scheduleItem,
            todo_list: newTodoList
          }
        }

        return scheduleItem
      })

      setScheduleList(newScheduleList)
    }
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(_, index) => String(index)}
      style={styles.container}
      renderItem={({item}) => (
        <ScheduleTodo item={item} showEditModal={showEditModal} onChange={handleScheduleTodoComplete} />
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 5
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkButtonWrapper: {
    width: 36,
    height: 36,
    justifyContent: 'center'
  },
  checkButton: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 7
  },
  activeCheckButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#76d672',
    backgroundColor: '#76d672'
  },
  moreButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#424242'
  }
})

export default ScheduleTodoList
