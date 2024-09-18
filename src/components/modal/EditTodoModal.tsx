import React from 'react'
import {
  Platform,
  Keyboard,
  useWindowDimensions,
  StyleSheet,
  Modal,
  SafeAreaView,
  Pressable,
  View,
  Text,
  TextInput
} from 'react-native'
import Switch from '@/components/Swtich'

import Animated, {runOnJS, useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'

import {useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState} from 'recoil'
import {showEditTodoModalState} from '@/store/modal'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'
import {scheduleDateState, scheduleListState, scheduleState, scheduleTodoState} from '@/store/schedule'

import {format} from 'date-fns'
import {updateWidget} from '@/utils/widget'

import {useMutation} from '@tanstack/react-query'

import DeleteIcon from '@/assets/icons/trash.svg'

// repository
import {todoRepository} from '@/repository'

const EditTodoModal = () => {
  const {height} = useWindowDimensions()
  const containerHeight = height * 0.65
  const [showEditTodoModal, setShowEditTodoModal] = useRecoilState(showEditTodoModalState)
  const setShowEditMenuBottomSheet = useSetRecoilState(showEditMenuBottomSheetState)

  const scheduleDate = useRecoilValue(scheduleDateState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const [scheduleTodo, changeScheduleTodo] = useRecoilState(scheduleTodoState)
  const resetSchedule = useResetRecoilState(scheduleState)
  const resetScheduleTodo = useResetRecoilState(scheduleTodoState)

  const translateY = useSharedValue(containerHeight * -1)
  const opacity = useSharedValue(0)

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}]
  }))
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const scheduleTitle = React.useMemo(() => {
    const targetSchedule = scheduleList.find(item => item.schedule_id === scheduleTodo.schedule_id)

    if (targetSchedule) {
      return targetSchedule.title
    }

    return ''
  }, [scheduleList, scheduleTodo.schedule_id])

  const isEdit = React.useMemo(() => {
    return !!scheduleTodo.todo_id
  }, [scheduleTodo.todo_id])

  const endDate = React.useMemo(() => {
    return scheduleTodo.end_date === '9999-12-31' || !scheduleTodo.end_date
  }, [scheduleTodo.end_date])

  const backgroundStyle = React.useMemo(() => {
    return [overlayAnimatedStyle, styles.background]
  }, [overlayAnimatedStyle])

  const containerStyle = React.useMemo(() => {
    return [containerAnimatedStyle, styles.container, {height: containerHeight}]
  }, [containerAnimatedStyle, containerHeight])

  const handleClose = React.useCallback(() => {
    opacity.value = withTiming(0)

    translateY.value = withTiming(containerHeight * -1, {duration: 300}, isFinish => {
      if (isFinish) {
        runOnJS(resetScheduleTodo)()
        runOnJS(setShowEditTodoModal)(false)
      }
    })
  }, [containerHeight, resetScheduleTodo, setShowEditTodoModal])

  const changeTitle = React.useCallback(
    (value: string) => {
      changeScheduleTodo(prevState => ({
        ...prevState,
        title: value
      }))
    },
    [changeScheduleTodo]
  )

  const changeEndDate = React.useCallback(
    (value: boolean) => {
      let start_date: string | null = null
      let end_date: string | null = null

      if (!value) {
        start_date = format(scheduleDate, 'yyyy-MM-dd')
        end_date = format(scheduleDate, 'yyyy-MM-dd')
      }

      changeScheduleTodo(prevState => ({
        ...prevState,
        start_date: start_date ? start_date : prevState.start_date,
        end_date
      }))
    },
    [changeScheduleTodo, scheduleDate]
  )

  const handleSuccess = async (newScheduleList: Schedule[]) => {
    setScheduleList(newScheduleList)
    resetSchedule()
    handleClose()
    setShowEditMenuBottomSheet(false)

    // TODO - 위젯에서 임시 제거
    // if (Platform.OS === 'ios') {
    //   await updateWidget()
    // }
  }

  const setScheduleTodoMutation = useMutation({
    mutationFn: async (data: Todo) => {
      if (!data.schedule_id) {
        throw new Error('잘못된 일정')
      }

      const date = format(scheduleDate, 'yyyy-MM-dd')

      const params = {
        schedule_id: data.schedule_id,
        todo_id: data.todo_id,
        title: data.title,
        start_date: data.start_date,
        end_date: data.end_date,
        date
      }

      if (params.todo_id) {
        return todoRepository.updateTodo(params)
      }

      return todoRepository.setTodo(params)
    },
    onSuccess: async (response: Todo[]) => {
      const result = response[0]

      const newScheduleList = scheduleList.map(item => {
        if (item.schedule_id === result.schedule_id) {
          let newTodoList = [...item.todo_list]

          const updateTodoIndex = newTodoList.findIndex(todoItem => todoItem.todo_id === result.todo_id)

          if (updateTodoIndex === -1) {
            newTodoList.push(result)
          } else {
            newTodoList[updateTodoIndex] = result
          }

          return {
            ...item,
            todo_list: newTodoList
          }
        }

        return item
      })

      await handleSuccess(newScheduleList)
    }
  })

  const deleteScheduleTodoMutation = useMutation({
    mutationFn: async (data: DeleteScheduleTodoReqeust) => {
      return todoRepository.deleteTodo(data)
    },
    onSuccess: async response => {
      const result = response

      const newScheduleList = scheduleList.map(item => {
        const newTodoList = item.todo_list.filter(todoItem => todoItem.todo_id !== result.todo_id)

        return {
          ...item,
          todo_list: newTodoList
        }
      })

      await handleSuccess(newScheduleList)
    }
  })

  const handleDelete = React.useCallback(() => {
    if (scheduleTodo.todo_id) {
      const params = {
        todo_id: scheduleTodo.todo_id
      }

      deleteScheduleTodoMutation.mutate(params)
    }
  }, [deleteScheduleTodoMutation, scheduleTodo.todo_id])

  const handleSubmit = React.useCallback(() => {
    let params = scheduleTodo

    if (!isEdit) {
      params = {
        ...params,
        start_date: format(scheduleDate, 'yyyy-MM-dd')
      }
    }

    setScheduleTodoMutation.mutate(params)
  }, [isEdit, scheduleDate, scheduleTodo, setScheduleTodoMutation])

  const dismissKeyboard = React.useCallback(() => {
    Keyboard.dismiss()
  }, [])

  React.useEffect(() => {
    if (showEditTodoModal) {
      opacity.value = withTiming(1)
      translateY.value = withTiming(0)
    }
  }, [showEditTodoModal])

  return (
    <Modal visible={showEditTodoModal} transparent statusBarTranslucent>
      <Animated.View style={backgroundStyle}>
        <Pressable style={styles.overlay} onPress={handleClose} />
      </Animated.View>

      <Animated.View style={containerStyle}>
        <SafeAreaView>
          <Pressable style={styles.wrapper} onPress={dismissKeyboard}>
            <View style={styles.formContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>{scheduleTitle} </Text>
                <Text style={styles.subLabel}>일정에 할 일 추가하기</Text>
              </View>

              <TextInput
                value={scheduleTodo.title}
                autoFocus
                style={styles.title}
                placeholder="할 일을 입력해주세요"
                placeholderTextColor="#c3c5cc"
                onChangeText={changeTitle}
              />

              <View>
                <View style={styles.repeatContainer}>
                  <Text style={styles.repeatHeaderLabel}>반복</Text>

                  <Switch value={endDate} onChange={changeEndDate} />
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              {isEdit && (
                <Pressable style={deleteButton} onPress={handleDelete}>
                  <DeleteIcon fill="#EC6682" />
                </Pressable>
              )}
              <Pressable style={editButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{isEdit ? '수정하기' : '추가하기'}</Text>
              </Pressable>
            </View>
          </Pressable>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingTop: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    height: '100%',
    justifyContent: 'space-between'
  },
  overlay: {
    flex: 1
  },
  formContainer: {
    gap: 30
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap'
  },
  label: {
    width: 'auto',
    fontSize: 22,
    fontFamily: 'Pretendard-Bold',
    color: '#424242'
  },
  subLabel: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    paddingTop: 5,
    color: '#424242'
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#424242',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },
  repeatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 15
  },
  repeatHeaderLabel: {
    fontSize: 16,
    fontFamily: 'Pretendard-Light',
    color: '#424242'
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 10
  },
  button: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FDEEF1'
  },
  editButton: {
    flex: 3,
    backgroundColor: '#1E90FF'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#fff'
  }
})

const deleteButton = StyleSheet.compose(styles.button, styles.deleteButton)
const editButton = StyleSheet.compose(styles.button, styles.editButton)

export default EditTodoModal
