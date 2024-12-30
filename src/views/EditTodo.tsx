import {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, Keyboard, ScrollView, Pressable, Text, TextInput, View} from 'react-native'
import AppBar from '@/components/AppBar'
import DeleteIcon from '@/assets/icons/trash.svg'
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {scheduleListState} from '@/store/schedule'
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

  const memoTextInputRef = useRef<TextInput>(null)

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
  const alert = useSetRecoilState(alertState)

  const isActive = useMemo(() => {
    return !!editTodoForm.title
  }, [editTodoForm.title])

  const isUpdate = useMemo(() => {
    return !!editTodoForm.schedule_todo_id
  }, [editTodoForm.schedule_todo_id])

  const submitButtonStyle = useMemo(() => {
    const backgroundColor = isActive ? '#1E90FF' : '#efefef'
    return [styles.submitButton, {backgroundColor}]
  }, [isActive])

  const submitButtonTextStyle = useMemo(() => {
    const color = isActive ? '#ffffff' : '#6B727E'
    return [styles.submitButtonText, {color}]
  }, [isActive])

  const targetSchedule = useMemo(() => {
    return scheduleList.find(item => item.schedule_id === editTodoForm.schedule_id)
  }, [editTodoForm.schedule_id, scheduleList])

  const completeDate = useMemo(() => {
    if (editTodoForm.complete_date) {
      const date = new Date(editTodoForm.complete_date)

      const year = date.getFullYear()
      const month = date.getMonth() + 1 // 월은 0부터 시작하므로 +1 필요
      const day = date.getDate()

      return `${year}년 ${month}월 ${day}일`
    }

    return ''
  }, [editTodoForm.complete_date])

  const changeTitle = useCallback(
    (value: string) => {
      setEditTodoForm(prevState => ({
        ...prevState,
        title: value
      }))
    },
    [setEditTodoForm]
  )

  const changeMemo = useCallback(
    (value: string) => {
      setEditTodoForm(prevState => ({
        ...prevState,
        memo: value
      }))
    },
    [setEditTodoForm]
  )

  const focusMemo = useCallback(() => {
    memoTextInputRef.current?.focus()
  }, [])

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
          deleteTodoMutate({schedule_todo_id: editTodoForm.schedule_todo_id})
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

      <ScrollView contentContainerStyle={styles.listContainer} bounces={false} showsVerticalScrollIndicator={false}>
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
          autoFocus={!route.params.todoId}
          style={[styles.title, {color: activeTheme.color3, borderBottomColor: activeTheme.color2}]}
          placeholder="새로운 할 일"
          placeholderTextColor="#c3c5cc"
          keyboardAppearance={keyboardAppearance}
          onChangeText={changeTitle}
        />

        {editTodoForm.complete_date && (
          <View style={[styles.completeContainer, {backgroundColor: activeTheme.color6}]}>
            <Text style={[styles.completeDateText, {color: activeTheme.color3}]}>{completeDate}</Text>

            <View style={styles.completeLabelWrapper}>
              <Text style={styles.completeLabelText}>완료</Text>
            </View>
          </View>
        )}

        <Pressable style={[styles.memoContainer, {borderColor: activeTheme.color2}]} onPress={focusMemo}>
          <TextInput
            ref={memoTextInputRef}
            style={[styles.memo, {color: activeTheme.color3}]}
            value={editTodoForm.memo}
            multiline
            placeholder="메모를 입력해주세요"
            placeholderTextColor="#c3c5cc"
            onChangeText={changeMemo}
          />
        </Pressable>
      </ScrollView>

      <Pressable style={submitButtonStyle} disabled={!isActive} onPress={handleSubmit}>
        <Text style={submitButtonTextStyle}>{isUpdate ? '수정하기' : '추가하기'}</Text>
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 112
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
    borderBottomColor: '#eeeded',
    marginBottom: 30
  },

  completeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20
  },
  completeLabelWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: '#76d672'
  },
  completeDateText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium'
  },
  completeLabelText: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: '#ffffff'
  },

  memoContainer: {
    padding: 15,
    gap: 10,
    minHeight: 200,
    borderRadius: 10,
    borderWidth: 1
  },
  memo: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold'
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
    borderRadius: 10
  },
  submitButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18
  }
})

export default EditTodo
