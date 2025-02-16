import {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, Platform, Alert, View, Text, Pressable, Image} from 'react-native'
import {BottomSheetModal, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import ScheduleCompleteCard from '@/components/ScheduleCompleteCard'

import {useRecoilState, useSetRecoilState, useResetRecoilState, useRecoilValue} from 'recoil'
import {activeThemeState, displayModeState} from '@/store/system'
import {editScheduleFormState, scheduleDateState} from '@/store/schedule'
import {editScheduleCompleteCacheListState, editScheduleCompleteFormState} from '@/store/scheduleComplete'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'
import {reloadWidgetWithImageState} from '@/store/widget'

import PlusIcon from '@/assets/icons/plus.svg'
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
import ScheduleCompleteCardMenuModal from '@/components/modal/ScheduleCompleteCardMenuModal'
import {Shadow} from 'react-native-shadow-2'
import ScheduleCompleteRecordModal from '@/components/modal/ScheduleCompleteRecordModal'

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
  const [isShowScheduleCompleteCardMenu, setIsShowScheduleCompleteCardMenu] = useState(false)
  const [isShowScheduleCompleteRecordModal, setIsShowScheduleCompleteRecordModal] = useState(false)

  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const [editScheduleCompleteForm, setEditScheduleCompleteForm] = useRecoilState(editScheduleCompleteFormState)
  const [editScheduleCompleteCacheList, setEditScheduleCompleteCacheList] = useRecoilState(
    editScheduleCompleteCacheListState
  )

  const editScheduleForm = useRecoilValue(editScheduleFormState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const activeTheme = useRecoilValue(activeThemeState)
  const displayMode = useRecoilValue(displayModeState)

  const resetEditScheduleForm = useResetRecoilState(editScheduleFormState)
  const resetEditScheduleCompleteForm = useResetRecoilState(editScheduleCompleteFormState)
  const setReloadWidgetWithImage = useSetRecoilState(reloadWidgetWithImageState)

  const snapPoints = useMemo(() => {
    return [400]
  }, [])

  const imageUrl = useMemo(() => {
    if (editScheduleCompleteForm?.thumb_path) {
      const domain = process.env.CDN_URL
      return domain + '/' + editScheduleCompleteForm.thumb_path
    }
    return null
  }, [editScheduleCompleteForm])

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

    closeEditMenuBottomSheet()

    navigate('ScheduleComplete', {
      schedule_complete_id: response.schedule_complete_id,
      complete_date: completeDate,
      start_time: editScheduleForm.start_time,
      end_time: editScheduleForm.end_time,
      file_name: null,
      memo: '',
      complete_count: response.complete_count,
      schedule_id: editScheduleForm.schedule_id,
      main_path: null,
      thumb_path: null
    })
  }, [
    editScheduleForm.schedule_id,
    editScheduleForm.start_time,
    editScheduleForm.end_time,
    scheduleDate,
    closeEditMenuBottomSheet,
    setScheduleCompleteMutateAsync
  ])

  const showScheduleCompleteCardMenu = useCallback(() => {
    setIsShowScheduleCompleteCardMenu(true)
  }, [])

  const moveEditScheduleComplete = useCallback(() => {
    if (editScheduleCompleteForm) {
      closeEditMenuBottomSheet()
      navigate('EditScheduleCompleteCard', editScheduleCompleteForm)
    }
  }, [closeEditMenuBottomSheet, editScheduleCompleteForm])

  const showScheduleCompleteRecordCard = useCallback(() => {
    setIsShowScheduleCompleteCardMenu(false)
    setIsShowScheduleCompleteRecordModal(true)
  }, [])

  const moveAttachScheduleCompleteCard = useCallback(() => {
    setIsShowScheduleCompleteCardMenu(false)

    closeEditMenuBottomSheet()
    navigate('AttachScheduleCompleteCard', {
      schedule_complete_id: editScheduleForm.schedule_complete_id,
      schedule_complete_card_x: editScheduleForm.schedule_complete_card_x,
      schedule_complete_card_y: editScheduleForm.schedule_complete_card_y,
      schedule_complete_card_path: editScheduleForm.schedule_complete_card_path,
      schedule_complete_record: editScheduleForm.schedule_complete_record,
      schedule_id: editScheduleForm.schedule_id
    })
  }, [
    closeEditMenuBottomSheet,
    editScheduleForm.schedule_complete_id,
    editScheduleForm.schedule_complete_card_x,
    editScheduleForm.schedule_complete_card_y,
    editScheduleForm.schedule_complete_card_path,
    editScheduleForm.schedule_complete_record,
    editScheduleForm.schedule_id
  ])

  const moveScheduleCompleteCardDetail = useCallback(() => {
    if (editScheduleCompleteForm) {
      setIsShowScheduleCompleteCardMenu(false)

      closeEditMenuBottomSheet()
      navigate('ScheduleCompleteCardDetail', editScheduleCompleteForm)
    }
  }, [closeEditMenuBottomSheet, editScheduleCompleteForm])

  const moveEditRoutine = useCallback(() => {
    closeEditMenuBottomSheet()
    navigate('EditRoutine', {scheduleId: editScheduleForm.schedule_id, routineId: null})
  }, [editScheduleForm.schedule_id, closeEditMenuBottomSheet])

  const moveEditTodo = useCallback(() => {
    closeEditMenuBottomSheet()
    navigate('EditTodo', {scheduleId: editScheduleForm.schedule_id, todoId: null})
  }, [editScheduleForm.schedule_id, closeEditMenuBottomSheet])

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
                setReloadWidgetWithImage(true)
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
    setReloadWidgetWithImage
  ])

  useEffect(() => {
    if (showEditMenuBottomSheet) {
      editInfoBottomSheetRef.current?.present()
    } else {
      if (isResetEditScheduleForm) {
        resetEditScheduleForm()
      }
      resetEditScheduleCompleteForm()

      editInfoBottomSheetRef.current?.dismiss()
    }
  }, [showEditMenuBottomSheet, isResetEditScheduleForm, resetEditScheduleForm, resetEditScheduleCompleteForm])

  useEffect(() => {
    if (showEditMenuBottomSheet) {
      setIsResetEditScheduleForm(true)
    }
  }, [showEditMenuBottomSheet])

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
      enableDynamicSizing={false}
      onDismiss={closeEditMenuBottomSheet}>
      <View style={[styles.container, {backgroundColor: activeTheme.color2}]}>
        <View style={[styles.header, {backgroundColor: activeTheme.color5}]}>
          <View style={styles.titleWrapper}>
            <Text style={[styles.title, {color: activeTheme.color3}]}>{editScheduleForm.title}</Text>

            {editScheduleCompleteForm ? (
              <View style={styles.completeTextWrapper}>
                <Text style={styles.completeText}>{editScheduleCompleteForm.complete_count}번 완료했어요</Text>
              </View>
            ) : (
              <Pressable style={styles.completeButton} onPress={handleScheduleComplete}>
                <Text style={styles.completeButtonText}>일정 완료하기</Text>
              </Pressable>
            )}
          </View>

          {editScheduleCompleteForm && (
            <View style={styles.completeCardWrapper}>
              {imageUrl || editScheduleCompleteForm.record ? (
                <Pressable onPress={showScheduleCompleteCardMenu}>
                  <Shadow
                    style={{width: 40, height: 40, borderRadius: 15}}
                    containerStyle={{position: 'absolute', top: 7, left: 3}}
                    startColor="#e9e9e9"
                    distance={25}
                    disabled={displayMode === 2}
                  />

                  <ScheduleCompleteCard
                    size="small"
                    imageUrl={imageUrl}
                    record={editScheduleCompleteForm.record}
                    shadowColor="#efefef"
                    shadowDistance={3}
                  />
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.emptyCompleteCard, {borderColor: activeTheme.color3}]}
                  onPress={moveEditScheduleComplete}>
                  <PlusIcon width={24} height={24} stroke="#1E90FF" />
                </Pressable>
              )}
            </View>
          )}
        </View>

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

      <ScheduleCompleteCardMenuModal
        visible={isShowScheduleCompleteCardMenu}
        isShowScheduleCompleteRecordCard={!!editScheduleCompleteForm?.record}
        showScheduleCompleteRecordCard={showScheduleCompleteRecordCard}
        moveScheduleCompleteCardDetail={moveScheduleCompleteCardDetail}
        moveAttachScheduleCompleteCard={moveAttachScheduleCompleteCard}
        onClose={() => setIsShowScheduleCompleteCardMenu(false)}
      />

      <ScheduleCompleteRecordModal
        visible={isShowScheduleCompleteRecordModal}
        value={editScheduleCompleteForm?.record || ''}
        readonly
        onClose={() => setIsShowScheduleCompleteRecordModal(false)}
      />
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    marginBottom: 5,
    gap: 20
  },
  titleWrapper: {
    flex: 1,
    gap: 10
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
    color: '#000',
    marginTop: 5
  },
  completeCardWrapper: {
    height: 55,
    aspectRatio: 0.8
  },
  emptyCompleteCard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderStyle: 'dashed'
  },
  completeButton: {
    marginTop: 10,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    borderRadius: 10,
    backgroundColor: '#45a9f9'
  },
  completeButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#ffffff'
  },
  completeTextWrapper: {
    backgroundColor: '#45a9f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-start'
  },
  completeText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: '#ffffff'
  },

  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
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

const routineButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#FFD54F'})
const todoButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#76cc72'})
const updateButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#1E90FF'})
const deleteButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#FD4672'})

export default EditMenuBottomSheet
