import {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, Alert, View, Text, Pressable, Platform} from 'react-native'
import {BottomSheetModal, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'

import {useRecoilState, useSetRecoilState, useResetRecoilState, useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'
import {editScheduleFormState, scheduleDateState} from '@/store/schedule'
import {editScheduleCompleteCacheListState, editScheduleCompleteFormState} from '@/store/scheduleComplete'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'
import {widgetWithImageUpdatedState} from '@/store/widget'

import CheckCircleIcon from '@/assets/icons/check_circle.svg'
import EditIcon from '@/assets/icons/edit3.svg'
import DeleteIcon from '@/assets/icons/trash.svg'
import RoutineIcon from '@/assets/icons/routine.svg'
import TodoIcon from '@/assets/icons/priority.svg'

import {useQueryClient} from '@tanstack/react-query'
import {useUpdateScheduleDeleted} from '@/apis/hooks/useSchedule'
import {useSetScheduleComplete} from '@/apis/hooks/useScheduleComplete'
import {navigate} from '@/utils/navigation'
import {format} from 'date-fns'
import {useGetScheduleCompleteDetail} from '@/apis/hooks/useScheduleComplete'

interface Props {
  moveEditSchedule: Function
}
const EditMenuBottomSheet = ({moveEditSchedule}: Props) => {
  const queryClient = useQueryClient()

  const updateScheduleDeleted = useUpdateScheduleDeleted()
  const {mutateAsync: getScheduleCompleteDetailMutateAsync} = useGetScheduleCompleteDetail()
  const {mutateAsync: setScheduleCompleteMutateAsync} = useSetScheduleComplete()

  const editInfoBottomSheetRef = useRef<BottomSheetModal>(null)

  const [isResetEditScheduleForm, setIsResetEditScheduleForm] = useState(true)
  const [isResetEditScheduleCompleteForm, setIsResetEditScheduleCompleteForm] = useState(true)

  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const [editScheduleCompleteForm, setEditScheduleCompleteForm] = useRecoilState(editScheduleCompleteFormState)
  const [editScheduleCompleteCacheList, setEditScheduleCompleteCacheList] = useRecoilState(
    editScheduleCompleteCacheListState
  )

  const editScheduleForm = useRecoilValue(editScheduleFormState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const activeTheme = useRecoilValue(activeThemeState)

  const resetEditScheduleForm = useResetRecoilState(editScheduleFormState)
  const resetEditScheduleCompleteForm = useResetRecoilState(editScheduleCompleteFormState)
  const setWidgetWithImageUpdated = useSetRecoilState(widgetWithImageUpdatedState)

  const snapPoints = useMemo(() => {
    return [500]
  }, [])

  const closeEditMenuBottomSheet = useCallback(() => {
    setShowEditMenuBottomSheet(false)
  }, [setShowEditMenuBottomSheet])

  // 일정 완료하기
  const handleScheduleComplete = useCallback(async () => {
    if (!editScheduleForm.schedule_id) {
      return
    }

    const completeDate = format(scheduleDate, 'yyyy-MM-dd')

    const response = await setScheduleCompleteMutateAsync({
      date: completeDate,
      start_time: editScheduleForm.start_time,
      end_time: editScheduleForm.end_time,
      schedule_id: editScheduleForm.schedule_id
    })

    setEditScheduleCompleteForm(response)
    setIsResetEditScheduleCompleteForm(false)

    closeEditMenuBottomSheet()

    navigate('ScheduleComplete')
  }, [
    editScheduleForm.schedule_id,
    editScheduleForm.start_time,
    editScheduleForm.end_time,
    scheduleDate,
    closeEditMenuBottomSheet,
    setScheduleCompleteMutateAsync,
    setEditScheduleCompleteForm
  ])

  const moveScheduleCompleteRecord = useCallback(() => {
    setIsResetEditScheduleCompleteForm(false)

    closeEditMenuBottomSheet()
    navigate('EditScheduleComplete')
  }, [closeEditMenuBottomSheet])

  const moveEditRoutine = useCallback(() => {
    closeEditMenuBottomSheet()
    navigate('EditRoutine', {scheduleId: editScheduleForm.schedule_id, routineId: null})
  }, [editScheduleForm.schedule_id, closeEditMenuBottomSheet])

  const moveEditTodo = useCallback(() => {
    closeEditMenuBottomSheet()
    navigate('EditTodo', {scheduleId: editScheduleForm.schedule_id, todoId: null})
  }, [editScheduleForm.schedule_id, closeEditMenuBottomSheet])

  const handleMoveScheduleCompleteRecord = useCallback(() => {
    if (editScheduleCompleteForm && (editScheduleCompleteForm.memo || editScheduleCompleteForm.image_url)) {
      moveScheduleCompleteRecord()
    }
  }, [editScheduleCompleteForm, moveScheduleCompleteRecord])

  const handleMoveEditSchedule = useCallback(() => {
    setIsResetEditScheduleForm(false)

    closeEditMenuBottomSheet()
    moveEditSchedule()
  }, [moveEditSchedule, closeEditMenuBottomSheet])

  const deleteSchedule = useCallback(() => {
    Alert.alert('일정 삭제하기', `"${editScheduleForm.title}" 일정을 삭제하시겠습니까?`, [
      {
        text: '취소',
        onPress: () => {
          return
        },
        style: 'cancel'
      },
      {
        text: '삭제',
        onPress: async () => {
          if (editScheduleForm.schedule_id) {
            try {
              await updateScheduleDeleted.mutateAsync({
                schedule_id: editScheduleForm.schedule_id
              })

              const formatDate = format(scheduleDate, 'yyyy-MM-dd')
              await queryClient.invalidateQueries({queryKey: ['scheduleList', formatDate]})

              if (Platform.OS === 'ios') {
                setWidgetWithImageUpdated(true)
              }

              closeEditMenuBottomSheet()
            } catch (e) {
              console.error(e)
            }
          }
        },
        style: 'destructive'
      }
    ])
  }, [
    editScheduleForm.title,
    editScheduleForm.schedule_id,
    updateScheduleDeleted,
    queryClient,
    scheduleDate,
    closeEditMenuBottomSheet,
    setWidgetWithImageUpdated
  ])

  useEffect(() => {
    if (showEditMenuBottomSheet) {
      setIsResetEditScheduleForm(true)
      setIsResetEditScheduleCompleteForm(true)

      editInfoBottomSheetRef.current?.present()
    } else {
      if (isResetEditScheduleForm) {
        resetEditScheduleForm()
      }
      if (isResetEditScheduleCompleteForm) {
        resetEditScheduleCompleteForm()
      }

      editInfoBottomSheetRef.current?.dismiss()
    }
  }, [
    showEditMenuBottomSheet,
    isResetEditScheduleForm,
    isResetEditScheduleCompleteForm,
    resetEditScheduleForm,
    resetEditScheduleCompleteForm
  ])

  useEffect(() => {
    const fetchScheduleCompleteDetail = async () => {
      const scheduleId = editScheduleForm.schedule_id

      if (scheduleId) {
        const completeDate = format(scheduleDate, 'yyyy-MM-dd')

        const target = editScheduleCompleteCacheList.find(item => {
          return item.schedule_id === scheduleId && item.complete_date === completeDate
        })

        if (target) {
          setEditScheduleCompleteForm(target)
        } else {
          const response = await getScheduleCompleteDetailMutateAsync({id: scheduleId, date: completeDate})
          if (response) {
            setEditScheduleCompleteCacheList(prevState => [...prevState, response])
          }
          setEditScheduleCompleteForm(response)
        }
      }
    }

    if (showEditMenuBottomSheet) {
      fetchScheduleCompleteDetail()
    }
  }, [
    showEditMenuBottomSheet,
    editScheduleForm.schedule_id,
    scheduleDate,
    editScheduleCompleteCacheList,
    getScheduleCompleteDetailMutateAsync,
    setEditScheduleCompleteCacheList,
    setEditScheduleCompleteForm
  ])

  // components
  const bottomSheetBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const bottomSheetHandler = useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={1}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  return (
    <BottomSheetModal
      name="editMenu"
      ref={editInfoBottomSheetRef}
      backdropComponent={bottomSheetBackdrop}
      handleComponent={bottomSheetHandler}
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      index={0}
      snapPoints={snapPoints}
      onDismiss={closeEditMenuBottomSheet}>
      <View style={[styles.container, {backgroundColor: activeTheme.color2}]}>
        <Pressable
          style={[styles.header, {backgroundColor: activeTheme.color5}]}
          onPress={handleMoveScheduleCompleteRecord}>
          {editScheduleCompleteForm && (
            <View style={styles.completeCountWrapper}>
              <CheckCircleIcon width={20} height={20} fill="#76d672" />
              <Text style={[styles.completeCount, {color: activeTheme.color3}]}>
                {editScheduleCompleteForm.complete_count}번 완료
              </Text>
            </View>
          )}

          <Text style={[styles.titleText, {color: activeTheme.color3}]}>{editScheduleForm.title}</Text>

          {editScheduleCompleteForm ? (
            <View>
              {editScheduleCompleteForm.memo || editScheduleCompleteForm.image_url ? (
                <View style={styles.completeContentsWrapper}>
                  <Text numberOfLines={3} style={[styles.completeContents, {color: activeTheme.color3}]}>
                    {editScheduleCompleteForm.memo?.replace(/\n/g, '')}
                  </Text>

                  {editScheduleCompleteForm.image_url && (
                    <View style={{width: 70, height: 70, borderRadius: 10, backgroundColor: '#efefef'}} />
                  )}
                </View>
              ) : (
                <Pressable style={recordButton} onPress={moveScheduleCompleteRecord}>
                  <Text style={styles.buttonText}>기록 남기기</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <Pressable style={completeButton} onPress={handleScheduleComplete}>
              <Text style={styles.buttonText}>일정 완료하기</Text>
            </Pressable>
          )}
        </Pressable>

        <View style={[styles.menuContainer, {backgroundColor: activeTheme.color5}]}>
          <Pressable style={styles.menuWrapper} onPress={moveEditTodo}>
            <View style={todoButton}>
              <TodoIcon width={14} height={14} fill="#fff" />
            </View>

            <Text style={[styles.text, {color: activeTheme.color3}]}>할 일 추가하기</Text>
          </Pressable>

          <Pressable style={styles.menuWrapper} onPress={moveEditRoutine}>
            <View style={routineButton}>
              <RoutineIcon width={14} height={14} fill="#fff" />
            </View>

            <Text style={[styles.text, {color: activeTheme.color3}]}>루틴 추가하기</Text>
          </Pressable>

          <Pressable style={styles.menuWrapper} onPress={handleMoveEditSchedule}>
            <View style={updateButton}>
              <EditIcon width={12} height={12} stroke="#fff" fill="#fff" />
            </View>

            <Text style={[styles.text, {color: activeTheme.color3}]}>수정하기</Text>
          </Pressable>

          <Pressable style={styles.menuWrapper} onPress={deleteSchedule}>
            <View style={deleteButton}>
              <DeleteIcon width={14} height={14} fill="#fff" />
            </View>

            <Text style={[styles.text, {color: activeTheme.color3}]}>삭제하기</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginBottom: 5,
    gap: 5
  },
  completeCountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  completeCount: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16
  },
  titleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
    color: '#000',
    marginTop: 5
  },
  button: {
    marginTop: 10,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    borderRadius: 10
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#ffffff'
  },
  completeContentsWrapper: {
    minHeight: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20
  },
  completeContents: {
    // marginTop: 5,
    flex: 1,
    fontFamily: 'Pretendard-Medium',
    fontSize: 14
  },

  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10
  },
  menuWrapper: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12
  },
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16
  }
})

const completeButton = StyleSheet.compose(styles.button, {backgroundColor: '#45a9f9'})
const recordButton = StyleSheet.compose(styles.button, {backgroundColor: '#ffb86c'})

const routineButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#FFD54F'})
const todoButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#76cc72'})
const updateButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#1E90FF'})
const deleteButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#FD4672'})

export default EditMenuBottomSheet
