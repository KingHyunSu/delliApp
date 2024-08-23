import React from 'react'
import {Platform, StyleSheet, FlatList, ListRenderItem, Pressable, View, Text} from 'react-native'
import {format} from 'date-fns'
import {trigger} from 'react-native-haptic-feedback'
import debounce from 'lodash.debounce'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {scheduleDateState, scheduleListState, scheduleTodoState} from '@/store/schedule'
import {showEditTodoModalState} from '@/store/modal'

import {useMutation} from '@tanstack/react-query'
import {updateWidget} from '@/utils/widget'

import CheckIcon from '@/assets/icons/check.svg'
import MoreIcon from '@/assets/icons/more_horiz.svg'

//repository
import {todoCompleteRepository} from '@/repository'

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

  const checkButton = React.useMemo(() => {
    return [styles.checkButton, isComplete && styles.activeCheckButton]
  }, [isComplete])

  const checkButtonColor = React.useMemo(() => {
    return isComplete ? '#fff' : '#eeeded'
  }, [isComplete])

  const debounceChagned = React.useMemo(
    () =>
      debounce(() => {
        onChange(!isComplete, item)
      }, 200),
    [isComplete, item, onChange]
  )

  const handleChanged = React.useCallback(() => {
    debounceChagned()
  }, [debounceChagned])

  const handleShowEditModal = React.useCallback(() => {
    showEditModal(item)
  }, [showEditModal, item])

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemWrapper}>
        <Pressable style={styles.checkButtonWrapper} onPress={handleChanged}>
          <View style={checkButton}>
            <CheckIcon width={16} height={16} strokeWidth={3} stroke={checkButtonColor} />
          </View>
        </Pressable>

        <Pressable style={styles.modalButtonWrapper} onPress={handleShowEditModal}>
          <Text style={styles.text}>{item.title}</Text>

          <View style={styles.moreButton}>
            <MoreIcon width={18} height={18} fill="#babfc5" />
          </View>
        </Pressable>
      </View>
    </View>
  )
}

const ScheduleTodoList = ({data}: Props) => {
  const scheduleDate = useRecoilValue(scheduleDateState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const scheduleTodo = useSetRecoilState(scheduleTodoState)
  const setShowEditTodoModal = useSetRecoilState(showEditTodoModalState)

  const showEditModal = React.useCallback(
    (item: Todo) => {
      scheduleTodo(item)
      setShowEditTodoModal(true)
    },
    [scheduleTodo, setShowEditTodoModal]
  )

  const setScheduleTodoCompleteMutation = useMutation({
    mutationFn: (params: SetScheduleTodoCompleteRequest) => {
      // return setScheduleTodoComplete(params)
      return todoCompleteRepository.setScheduleTodoCompleteQuery(params)
    }
  })

  const deleteScheduleTodoCompleteMutation = useMutation({
    mutationFn: (params: DeleteScheduleTodoCompleteRequest) => {
      // return deleteScheduleTodoComplete(params)
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

  const updateScheduleList = React.useCallback(
    async (item: Todo, updatedFields: Partial<Todo>) => {
      const newScheduleList = scheduleList.map(scheduleItem => {
        if (item.schedule_id === scheduleItem.schedule_id) {
          const newTodoList = data.map(todoItem =>
            todoItem.todo_id === item.todo_id ? {...todoItem, ...updatedFields} : todoItem
          )

          return {...scheduleItem, todo_list: newTodoList}
        }

        return scheduleItem
      })

      setScheduleList(newScheduleList)
      await updateWidget()
    },
    [data, scheduleList, setScheduleList]
  )

  const completeTodoItem = React.useCallback(
    async (item: Todo) => {
      const params: SetScheduleTodoCompleteRequest = {
        todo_id: item.todo_id!,
        complete_date: format(new Date(scheduleDate), 'yyyy-MM-dd')
      }

      const result = await setScheduleTodoCompleteMutation.mutateAsync(params)
      triggerHapticFeedback()

      await updateScheduleList(item, {
        complete_id: result.complete_id,
        complete_date: format(new Date(scheduleDate), 'yyyy-MM-dd')
      })
    },
    [scheduleDate, setScheduleTodoCompleteMutation, updateScheduleList]
  )

  const undoCompleteTodoItem = React.useCallback(
    async (item: Todo) => {
      const params: DeleteScheduleTodoCompleteRequest = {
        complete_id: item.complete_id!
      }

      await deleteScheduleTodoCompleteMutation.mutateAsync(params)
      triggerHapticFeedback()

      await updateScheduleList(item, {
        complete_id: null,
        complete_date: null
      })
    },
    [deleteScheduleTodoCompleteMutation, updateScheduleList]
  )

  const handleScheduleTodoComplete = React.useCallback(
    async (value: boolean, item: Todo) => {
      if (!item.todo_id || (value && !item.todo_id) || (!value && !item.complete_id)) {
        // [TODO] error check...
        return
      }

      if (value) {
        await completeTodoItem(item)
      } else {
        await undoCompleteTodoItem(item)
      }
    },
    [completeTodoItem, undoCompleteTodoItem]
  )

  const keyExtractor = React.useCallback((item: Todo, index: number) => {
    return String(index)
  }, [])

  const renderItem: ListRenderItem<Todo> = React.useCallback(
    ({item}) => {
      return <ScheduleTodo item={item} showEditModal={showEditModal} onChange={handleScheduleTodoComplete} />
    },
    [showEditModal, handleScheduleTodoComplete]
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
  },
  itemContainer: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalButtonWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    borderRadius: 7,

    justifyContent: 'center',
    alignItems: 'center'
  },
  activeCheckButton: {
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
