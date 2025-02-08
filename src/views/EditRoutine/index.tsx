import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, View, Text, TextInput, Pressable, ScrollView} from 'react-native'
import AppBar from '@/components/AppBar'
import CompleteCalendar from './components/CompleteCalendar'
import YearMonthPickerModal from '@/components/modal/YearMonthPickerModal'
import DeleteIcon from '@/assets/icons/trash.svg'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {activeThemeState, alertState, keyboardAppearanceState} from '@/store/system'
import {scheduleListState} from '@/store/schedule'
import {
  useGetScheduleRoutineDetail,
  useSetScheduleRoutine,
  useUpdateScheduleRoutine,
  useDeleteScheduleRoutine
} from '@/apis/hooks/useRoutine'
import {EditRoutineScreenProps} from '@/types/navigation'

const EditRoutine = ({navigation, route}: EditRoutineScreenProps) => {
  const {mutateAsync: getScheduleRoutineDetailMutateAsync} = useGetScheduleRoutineDetail()
  const {mutateAsync: setScheduleRoutineMutateAsync} = useSetScheduleRoutine()
  const {mutateAsync: updateScheduleRoutineMutateAsync} = useUpdateScheduleRoutine()
  const {mutate: deleteScheduleRoutineMutate, isSuccess: isSuccessDeleteRoutine} = useDeleteScheduleRoutine()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [showYearMonthPickerModal, setShowYearMonthPickerModal] = useState(false)
  const [editRoutineForm, setEditRoutineForm] = useState<EditRoutineForm>({
    schedule_routine_id: null,
    title: '',
    schedule_id: null
  })

  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)

  const activeTheme = useRecoilValue(activeThemeState)
  const keyboardAppearance = useRecoilValue(keyboardAppearanceState)
  const alert = useSetRecoilState(alertState)

  const isActive = useMemo(() => {
    return !!editRoutineForm.title
  }, [editRoutineForm.title])

  const isUpdate = useMemo(() => {
    return !!editRoutineForm.schedule_routine_id
  }, [editRoutineForm.schedule_routine_id])

  const submitButtonStyle = useMemo(() => {
    const backgroundColor = isActive ? '#1E90FF' : '#efefef'
    return [styles.submitButton, {backgroundColor}]
  }, [isActive])

  const submitButtonTextStyle = useMemo(() => {
    const color = isActive ? '#ffffff' : '#6B727E'
    return [styles.submitButtonText, {color}]
  }, [isActive])

  const targetSchedule = useMemo(() => {
    return scheduleList.find(item => item.schedule_id === editRoutineForm.schedule_id)
  }, [editRoutineForm.schedule_id, scheduleList])

  const changeTitle = useCallback(
    (value: string) => {
      setEditRoutineForm(prevState => ({
        ...prevState,
        title: value
      }))
    },
    [setEditRoutineForm]
  )

  const getNewScheduleList = useCallback(
    (newRoutineId: number) => {
      return scheduleList.map(item => {
        if (item.schedule_id === targetSchedule?.schedule_id) {
          let newRoutineList = [...item.routine_list]

          const updateRoutineIndex = newRoutineList.findIndex(
            routineItem => routineItem.schedule_routine_id === newRoutineId
          )

          const newRoutine: ScheduleRoutine = {
            schedule_routine_id: newRoutineId!,
            title: editRoutineForm.title,
            schedule_id: targetSchedule.schedule_id!,
            schedule_routine_complete_id:
              updateRoutineIndex !== -1 ? newRoutineList[updateRoutineIndex].schedule_routine_complete_id : null,
            complete_date: updateRoutineIndex !== -1 ? newRoutineList[updateRoutineIndex].complete_date : null,
            complete_date_list: updateRoutineIndex !== -1 ? newRoutineList[updateRoutineIndex].complete_date_list : []
          }

          if (updateRoutineIndex === -1) {
            newRoutineList.push(newRoutine)
          } else {
            newRoutineList[updateRoutineIndex] = newRoutine
          }

          return {
            ...item,
            routine_list: newRoutineList
          }
        }

        return item
      })
    },
    [targetSchedule?.schedule_id, scheduleList, editRoutineForm.title]
  )

  const handleSubmit = useCallback(async () => {
    let resultId: number | null = null

    if (editRoutineForm.schedule_routine_id) {
      resultId = await updateScheduleRoutineMutateAsync({
        title: editRoutineForm.title,
        schedule_routine_id: editRoutineForm.schedule_routine_id
      })
    } else {
      if (!targetSchedule?.schedule_id) {
        throw new Error('잘못된 일정')
      }

      resultId = await setScheduleRoutineMutateAsync({
        title: editRoutineForm.title,
        schedule_id: targetSchedule.schedule_id
      })
    }

    if (resultId === null) {
      throw new Error('잘못된 루틴')
    }

    const newScheduleList = getNewScheduleList(resultId)

    setScheduleList(newScheduleList)

    navigation.navigate('MainTabs', {
      screen: 'Home'
    })
  }, [
    targetSchedule,
    editRoutineForm.schedule_routine_id,
    editRoutineForm.title,
    updateScheduleRoutineMutateAsync,
    setScheduleRoutineMutateAsync,
    getNewScheduleList,
    setScheduleList,
    navigation
  ])

  const handleDelete = useCallback(() => {
    alert({
      type: 'danger',
      title: '루틴을 삭제할까요?',
      confirmButtonText: '삭제하기',
      confirmFn: () => {
        if (editRoutineForm.schedule_routine_id) {
          deleteScheduleRoutineMutate({schedule_routine_id: editRoutineForm.schedule_routine_id})
        }
      }
    })
  }, [alert, editRoutineForm.schedule_routine_id, deleteScheduleRoutineMutate])

  useEffect(() => {
    if (isSuccessDeleteRoutine) {
      const newScheduleList = scheduleList.map(scheduleItem => {
        const newRoutineList = scheduleItem.routine_list.filter(routineItem => {
          return routineItem.schedule_routine_id !== editRoutineForm.schedule_routine_id
        })

        return {
          ...scheduleItem,
          routine_list: newRoutineList
        }
      })

      setScheduleList(newScheduleList)

      navigation.navigate('MainTabs', {
        screen: 'Home'
      })
    }
  }, [isSuccessDeleteRoutine, editRoutineForm.schedule_routine_id, setScheduleList, navigation])

  useEffect(() => {
    const init = async () => {
      if (route.params.routineId) {
        const scheduleRoutineDetail = await getScheduleRoutineDetailMutateAsync(route.params.routineId)

        setEditRoutineForm(scheduleRoutineDetail)
      } else {
        setEditRoutineForm(prevState => ({
          ...prevState,
          schedule_id: route.params.scheduleId
        }))
      }
    }

    init()
  }, [route.params.scheduleId, route.params.routineId, getScheduleRoutineDetailMutateAsync])

  return (
    <View style={[styles.container, {backgroundColor: activeTheme.color1}]}>
      <AppBar backPress color={activeTheme.color7}>
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
              {isUpdate ? '일정의 루틴' : '일정에 루틴 추가하기'}
            </Text>
          </View>
        )}

        <TextInput
          value={editRoutineForm.title}
          autoFocus={!route.params.routineId}
          style={[styles.title, {color: activeTheme.color3, borderBottomColor: activeTheme.color2}]}
          placeholder="새로운 루틴"
          placeholderTextColor="#c3c5cc"
          keyboardAppearance={keyboardAppearance}
          onChangeText={changeTitle}
        />

        {editRoutineForm.schedule_routine_id && (
          <View style={styles.completeCalendarWrapper}>
            <CompleteCalendar
              value={currentDate}
              id={editRoutineForm.schedule_routine_id}
              activeTheme={activeTheme}
              openYearMonthPickerModal={() => setShowYearMonthPickerModal(true)}
            />
          </View>
        )}
      </ScrollView>

      <Pressable style={submitButtonStyle} disabled={!isActive} onPress={handleSubmit}>
        <Text style={submitButtonTextStyle}>{isUpdate ? '수정하기' : '추가하기'}</Text>
      </Pressable>

      <YearMonthPickerModal
        visible={showYearMonthPickerModal}
        value={currentDate}
        onChange={setCurrentDate}
        onClose={() => setShowYearMonthPickerModal(false)}
      />
    </View>
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
    borderBottomWidth: 2
  },

  completeCalendarWrapper: {
    paddingTop: 40
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

export default EditRoutine
