import React from 'react'
import {
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

import Animated, {runOnJS, useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'

import {useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState} from 'recoil'
import {showEditTodoModalState} from '@/store/modal'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'
import {scheduleDateState, scheduleListState, scheduleState} from '@/store/schedule'
import {editTodoFormState} from '@/store/todo'

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
  const [editTodoForm, setEditTodoForm] = useRecoilState(editTodoFormState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const setShowEditMenuBottomSheet = useSetRecoilState(showEditMenuBottomSheetState)
  const resetSchedule = useResetRecoilState(scheduleState)
  const resetEditTodoForm = useResetRecoilState(editTodoFormState)

  const translateY = useSharedValue(containerHeight * -1)
  const opacity = useSharedValue(0)

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}]
  }))
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const scheduleTitle = React.useMemo(() => {
    const targetSchedule = scheduleList.find(item => item.schedule_id === editTodoForm.schedule_id)

    if (targetSchedule) {
      return targetSchedule.title
    }

    return ''
  }, [scheduleList, editTodoForm.schedule_id])

  const isEdit = React.useMemo(() => {
    return !!editTodoForm.todo_id
  }, [editTodoForm.todo_id])

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
        runOnJS(resetEditTodoForm)()
        runOnJS(setShowEditTodoModal)(false)
      }
    })
  }, [containerHeight, resetEditTodoForm, setShowEditTodoModal])

  const changeTitle = React.useCallback(
    (value: string) => {
      setEditTodoForm(prevState => ({
        ...prevState,
        title: value
      }))
    },
    [setEditTodoForm]
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

  const {mutate: editTodoMutate} = useMutation<number>({
    mutationFn: async () => {
      if (!editTodoForm || !editTodoForm.schedule_id) {
        throw new Error('잘못된 일정')
      }

      const targetDate = format(scheduleDate, 'yyyy-MM-dd')

      if (editTodoForm.todo_id) {
        const updateTodoParams = {
          todo_id: editTodoForm.todo_id,
          title: editTodoForm.title
        }
        return todoRepository.updateTodo(updateTodoParams)
      }

      const setTodoParams = {
        title: editTodoForm.title,
        start_date: targetDate,
        end_date: targetDate,
        schedule_id: editTodoForm.schedule_id
      }
      return todoRepository.setTodo(setTodoParams)
    },
    onSuccess: async resultTodoId => {
      const newScheduleList = scheduleList.map(item => {
        if (item.schedule_id === editTodoForm.schedule_id) {
          let newTodoList = [...item.todo_list]

          const updateTodoIndex = newTodoList.findIndex(todoItem => todoItem.todo_id === resultTodoId)
          const newTodo: Todo = {
            todo_id: resultTodoId,
            title: editTodoForm.title,
            schedule_id: editTodoForm.schedule_id,
            complete_id: updateTodoIndex !== -1 ? newTodoList[updateTodoIndex].complete_id : null,
            complete_date: updateTodoIndex !== -1 ? newTodoList[updateTodoIndex].complete_date : null
          }

          if (updateTodoIndex === -1) {
            newTodoList.push(newTodo)
          } else {
            newTodoList[updateTodoIndex] = newTodo
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

  const {mutate: deleteScheduleTodoMutate} = useMutation({
    mutationFn: async (data: DeleteScheduleTodoReqeust) => {
      return todoRepository.deleteTodo(data)
    },
    onSuccess: async resultTodoId => {
      const newScheduleList = scheduleList.map(item => {
        const newTodoList = item.todo_list.filter(todoItem => todoItem.todo_id !== resultTodoId)

        return {
          ...item,
          todo_list: newTodoList
        }
      })

      await handleSuccess(newScheduleList)
    }
  })

  const handleDelete = React.useCallback(() => {
    if (editTodoForm.todo_id) {
      const params = {
        todo_id: editTodoForm.todo_id
      }

      deleteScheduleTodoMutate(params)
    }
  }, [deleteScheduleTodoMutate, editTodoForm.todo_id])

  const handleSubmit = React.useCallback(() => {
    editTodoMutate()
  }, [editTodoMutate])

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
                value={editTodoForm.title}
                autoFocus
                style={styles.title}
                placeholder="할 일을 입력해주세요"
                placeholderTextColor="#c3c5cc"
                onChangeText={changeTitle}
              />
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
