import {useState, useMemo, useCallback, useEffect} from 'react'
import {Keyboard, Pressable, StyleSheet, Text, TextInput, View} from 'react-native'
import AppBar from '@/components/AppBar'
import DeleteIcon from '@/assets/icons/trash.svg'
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {scheduleListState, scheduleState} from '@/store/schedule'
import {activeThemeState, alertState, keyboardAppearanceState} from '@/store/system'
import {
  useGetScheduleTodoDetail,
  useSetScheduleTodo,
  useUpdateScheduleTodo,
  useDeleteScheduleTodo
} from '@/apis/hooks/useTodo'
import {EditTodoScreenProps} from '@/types/navigation'

const EditTodo = ({navigation, route}: EditTodoScreenProps) => {
  const {mutateAsync: getTodoDetailMutateAsync} = useGetScheduleTodoDetail()
  const {mutateAsync: setTodoMutateAsync} = useSetScheduleTodo()
  const {mutateAsync: updateTodoMutateAsync} = useUpdateScheduleTodo()
  const {mutate: deleteTodoMutate, isSuccess: isSuccessDeleteTodo} = useDeleteScheduleTodo()

  const [editTodoForm, setEditTodoForm] = useState<EditTodoForm>({
    schedule_todo_id: null,
    title: '',
    memo: '',
    complete_date: null,
    schedule_id: null
  })

  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)

  const activeTheme = useRecoilValue(activeThemeState)
  const keyboardAppearance = useRecoilValue(keyboardAppearanceState)
  const schedule = useRecoilValue(scheduleState)
  const alert = useSetRecoilState(alertState)

  const isUpdate = useMemo(() => {
    return !!editTodoForm.schedule_todo_id
  }, [editTodoForm.schedule_todo_id])

  const targetSchedule = useMemo(() => {
    if (editTodoForm.schedule_id) {
      return scheduleList.find(item => item.schedule_id === editTodoForm.schedule_id)
    }

    return schedule
  }, [editTodoForm.schedule_id, scheduleList, schedule])

  const changeTitle = useCallback(
    (value: string) => {
      setEditTodoForm(prevState => ({
        ...prevState,
        title: value
      }))
    },
    [setEditTodoForm]
  )

  const getNewScheduleList = useCallback(
    (newTodoId: number) => {
      return scheduleList.map(item => {
        if (item.schedule_id === targetSchedule?.schedule_id) {
          let newTodoList = [...item.todo_list]

          const updateTodoIndex = newTodoList.findIndex(todoItem => todoItem.schedule_todo_id === newTodoId)

          const newTodo: ScheduleTodo = {
            schedule_todo_id: newTodoId!,
            title: editTodoForm.title,
            complete_date: updateTodoIndex !== -1 ? newTodoList[updateTodoIndex].complete_date : null,
            schedule_id: targetSchedule.schedule_id!
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
    },
    [targetSchedule?.schedule_id, scheduleList, editTodoForm.title]
  )

  const handleSubmit = useCallback(async () => {
    let resultId: number | null = null

    if (editTodoForm.schedule_todo_id) {
      resultId = await updateTodoMutateAsync({
        schedule_todo_id: editTodoForm.schedule_todo_id,
        title: editTodoForm.title,
        memo: editTodoForm.memo
      })
    } else {
      if (!targetSchedule?.schedule_id) {
        throw new Error('잘못된 일정')
      }

      resultId = await setTodoMutateAsync({
        title: editTodoForm.title,
        memo: editTodoForm.memo,
        schedule_id: targetSchedule.schedule_id
      })
    }

    if (resultId === null) {
      throw new Error('잘못된 할 일')
    }

    const newScheduleList = getNewScheduleList(resultId)

    setScheduleList(newScheduleList)

    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: {scheduleUpdated: false}
    })
  }, [
    targetSchedule,
    editTodoForm.schedule_todo_id,
    editTodoForm.title,
    editTodoForm.memo,
    updateTodoMutateAsync,
    setTodoMutateAsync,
    getNewScheduleList,
    setScheduleList,
    navigation
  ])

  const handleDelete = useCallback(() => {
    alert({
      type: 'danger',
      title: '할 일을 삭제할까요?',
      confirmButtonText: '삭제하기',
      confirmFn: () => {
        if (editTodoForm.schedule_todo_id) {
          deleteTodoMutate(editTodoForm.schedule_todo_id)
        }
      }
    })
  }, [alert, editTodoForm.schedule_todo_id, deleteTodoMutate])

  const closeKeyboard = useCallback(() => {
    Keyboard.dismiss()
  }, [])

  useEffect(() => {
    if (isSuccessDeleteTodo) {
      const newScheduleList = scheduleList.map(scheduleItem => {
        const newTodoList = scheduleItem.todo_list.filter(todoItem => {
          return todoItem.schedule_todo_id !== editTodoForm.schedule_todo_id
        })

        return {
          ...scheduleItem,
          todo_list: newTodoList
        }
      })

      setScheduleList(newScheduleList)

      navigation.navigate('MainTabs', {
        screen: 'Home',
        params: {scheduleUpdated: false}
      })
    }
  }, [isSuccessDeleteTodo, editTodoForm.schedule_todo_id, setScheduleList, navigation])

  useEffect(() => {
    const init = async () => {
      if (route.params.todoId) {
        const todoDetail = await getTodoDetailMutateAsync(route.params.todoId)

        setEditTodoForm(todoDetail)
      } else {
        setEditTodoForm(prevState => ({
          ...prevState,
          schedule_id: route.params.scheduleId
        }))
      }
    }

    init()
  }, [route.params.scheduleId, route.params.todoId, getTodoDetailMutateAsync])

  return (
    <Pressable style={[styles.container, {backgroundColor: activeTheme.color1}]} onPress={closeKeyboard}>
      <AppBar backPress color="transparent" backPressIconColor={activeTheme.color7}>
        {isUpdate && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <DeleteIcon width={24} height={24} fill={activeTheme.color7} />
          </Pressable>
        )}
      </AppBar>

      <View style={styles.wrapper}>
        {targetSchedule && (
          <View style={styles.labelWrapper}>
            <Text style={[styles.label, {color: activeTheme.color3}]}>{targetSchedule.title} </Text>
            <Text style={[styles.subLabel, {color: activeTheme.color3}]}>
              {isUpdate ? '일정의 할 일' : '일정에 할 일 추가하기'}
            </Text>
          </View>
        )}

        <TextInput
          value={editTodoForm.title}
          autoFocus
          style={[styles.title, {color: activeTheme.color3, borderBottomColor: activeTheme.color2}]}
          placeholder="새로운 할 일"
          placeholderTextColor="#c3c5cc"
          keyboardAppearance={keyboardAppearance}
          onChangeText={changeTitle}
        />
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{isUpdate ? '수정하기' : '추가하기'}</Text>
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 20
  },
  labelWrapper: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold'
  },
  subLabel: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium'
  },
  title: {
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },

  deleteButton: {
    height: 48,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 16
  },
  submitButton: {
    height: 52,
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    borderRadius: 10
  },
  submitButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#fff'
  }
})

export default EditTodo
