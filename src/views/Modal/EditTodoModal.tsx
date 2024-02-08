import React from 'react'
import {useWindowDimensions, StyleSheet, Modal, SafeAreaView, Pressable, View, Text, TextInput} from 'react-native'
import Switch from '@/components/Swtich'

import Animated, {runOnJS, useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'

import {useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState} from 'recoil'
import {showEditTodoModalState} from '@/store/modal'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'
import {scheduleDateState, scheduleListState, scheduleTodoState} from '@/store/schedule'

import {format} from 'date-fns'

import {useMutation} from '@tanstack/react-query'
import {setScheduleTodo, deleteScheduleTodo} from '@/apis/schedule'

import DeleteIcon from '@/assets/icons/trash.svg'

const EditTodoModal = () => {
  const {height} = useWindowDimensions()
  const containerHeight = height * 0.65
  const [showEditTodoModal, setShowEditTodoModal] = useRecoilState(showEditTodoModalState)
  const setShowEditMenuBottomSheet = useSetRecoilState(showEditMenuBottomSheetState)

  const scheduleDate = useRecoilValue(scheduleDateState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const [scheduleTodo, changeScheduleTodo] = useRecoilState(scheduleTodoState)
  const resetScheduleTodo = useResetRecoilState(scheduleTodoState)

  const translateY = useSharedValue(containerHeight * -1)
  const opacity = useSharedValue(0)

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}]
  }))
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const isEdit = React.useMemo(() => {
    return !!scheduleTodo.todo_id
  }, [scheduleTodo.todo_id])

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
      let end_date: string | null = null

      if (!value) {
        end_date = format(scheduleDate, 'yyyy-MM-dd')
      }

      changeScheduleTodo(prevState => ({
        ...prevState,
        end_date
      }))
    },
    [changeScheduleTodo, scheduleDate]
  )

  const setScheduleTodoMutation = useMutation({
    mutationFn: async (data: Todo) => {
      return setScheduleTodo(data)
    },
    onSuccess: response => {
      const result = response.data

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

      setScheduleList(newScheduleList)
      handleClose()
      setShowEditMenuBottomSheet(false)
    }
  })

  const deleteScheduleTodoMutation = useMutation({
    mutationFn: async (data: DeleteScheduleTodoReqeust) => {
      return deleteScheduleTodo(data)
    },
    onSuccess: response => {
      const result = response.data

      const newScheduleList = scheduleList.map(item => {
        const newTodoList = item.todo_list.filter(todoItem => todoItem.todo_id !== result.todo_id)

        return {
          ...item,
          todo_list: newTodoList
        }
      })

      setScheduleList(newScheduleList)
      handleClose()
      setShowEditMenuBottomSheet(false)
    }
  })

  const handleDelete = React.useCallback(() => {
    if (scheduleTodo.todo_id) {
      const params = {
        todo_id: scheduleTodo.todo_id
      }

      console.log('params', params)
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
          <View style={styles.wrapper}>
            <View style={styles.formContainer}>
              <TextInput
                value={scheduleTodo.title}
                style={styles.title}
                placeholder="할 일을 입력해주세요"
                placeholderTextColor="#c3c5cc"
                onChangeText={changeTitle}
              />

              <View>
                <View style={styles.repeatContainer}>
                  <Text style={styles.repeatHeaderLabel}>반복</Text>

                  <Switch value={!scheduleTodo.end_date} onChange={changeEndDate} />
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
          </View>
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
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 40,
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
  title: {
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
    color: '#424242',
    paddingVertical: 20,
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
