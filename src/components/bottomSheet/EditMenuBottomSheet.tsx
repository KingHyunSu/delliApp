import React from 'react'
import {StyleSheet, Alert, View, Text, Pressable, Platform} from 'react-native'
import {BottomSheetModal, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'

import {useRecoilState, useSetRecoilState, useResetRecoilState, useRecoilValue} from 'recoil'
import {activeThemeState, isEditState} from '@/store/system'
import {focusModeInfoState, scheduleDateState, scheduleListState, scheduleState} from '@/store/schedule'
import {editTodoFormState} from '@/store/todo'
import {showEditTodoModalState} from '@/store/modal'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'
import {widgetWithImageUpdatedState} from '@/store/widget'

import EditIcon from '@/assets/icons/edit3.svg'
import DeleteIcon from '@/assets/icons/trash.svg'
import RoutineIcon from '@/assets/icons/routine.svg'
import TodoIcon from '@/assets/icons/priority.svg'
import PlayIcon from '@/assets/icons/play.svg'
import PauseIcon from '@/assets/icons/pause.svg'
import CheckIcon from '@/assets/icons/check.svg'

import {useQueryClient} from '@tanstack/react-query'
import {useSetScheduleComplete, useSetScheduleFocusTime, useUpdateScheduleDeleted} from '@/apis/hooks/useSchedule'
import {getFocusTimeText} from '@/utils/helper'
import {navigate} from '@/utils/navigation'

interface Props {
  moveEditSchedule: Function
}
const EditMenuBottomSheet = ({moveEditSchedule}: Props) => {
  const queryClient = useQueryClient()

  // const setScheduleComplete = useSetScheduleComplete()
  const setScheduleFocusTime = useSetScheduleFocusTime()
  const updateScheduleDeleted = useUpdateScheduleDeleted()

  const editInfoBottomSheetRef = React.useRef<BottomSheetModal>(null)

  const [showEditScheduleBottomSheet, setShowEditScheduleBottomSheet] = React.useState(false)

  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const [focusModeInfo, setFocusModeInfo] = useRecoilState(focusModeInfoState)

  const isEdit = useRecoilValue(isEditState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const activeTheme = useRecoilValue(activeThemeState)

  const resetSchedule = useResetRecoilState(scheduleState)
  const setEditTodoForm = useSetRecoilState(editTodoFormState)
  const setScheduleList = useSetRecoilState(scheduleListState)
  const setShowEditTodoModal = useSetRecoilState(showEditTodoModalState)
  // const setShowCompleteModal = useSetRecoilState(showCompleteModalState)
  const setWidgetWithImageUpdated = useSetRecoilState(widgetWithImageUpdatedState)

  const snapPoints = React.useMemo(() => {
    return [500]
  }, [])

  // const isFocusMode = React.useMemo(() => {
  //   return focusModeInfo?.schedule_id === schedule.schedule_id
  // }, [schedule.schedule_id, focusModeInfo])
  //
  // const completeActionButtonStyle = React.useMemo(() => {
  //   const backgroundColor = schedule.complete_state ? '#f5f6f8' : '#32CD3220'
  //   return [styles.actionButton, {backgroundColor}]
  // }, [schedule.complete_state])
  //
  // const completeActionButtonTextStyle = React.useMemo(() => {
  //   const color = schedule.complete_state ? '#babfc5' : '#66BB6A'
  //   return [styles.actionButtonText, {color}]
  // }, [schedule.complete_state])

  const handleReset = React.useCallback(() => {
    if (!isEdit) {
      resetSchedule()
    }
  }, [isEdit, resetSchedule])

  const closeEditMenuBottomSheet = React.useCallback(() => {
    setShowEditMenuBottomSheet(false)
  }, [setShowEditMenuBottomSheet])

  const moveEditRoutine = React.useCallback(() => {
    closeEditMenuBottomSheet()
    navigate('EditRoutine', {scheduleId: schedule.schedule_id, routineId: null})
  }, [schedule.schedule_id, closeEditMenuBottomSheet])

  const openEditTodoModal = React.useCallback(() => {
    if (schedule.schedule_id) {
      setEditTodoForm(prevState => ({
        ...prevState,
        schedule_id: schedule.schedule_id
      }))

      setShowEditTodoModal(true)
    }
  }, [schedule.schedule_id, setEditTodoForm, setShowEditTodoModal])

  const deleteSchedule = React.useCallback(() => {
    Alert.alert('일정 삭제하기', `"${schedule.title}" 일정을 삭제하시겠습니까?`, [
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
          if (schedule.schedule_id) {
            const params = {
              schedule_id: schedule.schedule_id
            }

            try {
              await updateScheduleDeleted.mutateAsync(params)

              queryClient.invalidateQueries({queryKey: ['scheduleList', scheduleDate]})

              if (Platform.OS === 'ios') {
                setWidgetWithImageUpdated(true)
              }

              resetSchedule()
              setShowEditMenuBottomSheet(false)
            } catch (e) {
              console.error(e)
            }
          }
        },
        style: 'destructive'
      }
    ])
  }, [
    schedule.title,
    schedule.schedule_id,
    updateScheduleDeleted,
    queryClient,
    scheduleDate,
    setWidgetWithImageUpdated,
    resetSchedule,
    setShowEditMenuBottomSheet
  ])

  const handleMoveEditSchedule = React.useCallback(() => {
    setShowEditScheduleBottomSheet(true)
    setShowEditMenuBottomSheet(false)
  }, [setShowEditScheduleBottomSheet, setShowEditMenuBottomSheet])

  // const handleComplete = React.useCallback(async () => {
  //   await setScheduleComplete.mutateAsync()
  //
  //   setScheduleList(prevState => {
  //     const targetIndex = prevState.findIndex(item => item.schedule_id === schedule.schedule_id)
  //
  //     if (targetIndex !== -1) {
  //       const updateList = [...prevState]
  //
  //       updateList[targetIndex] = {
  //         ...updateList[targetIndex],
  //         complete_state: 1
  //       }
  //       return updateList
  //     }
  //
  //     return prevState
  //   })
  //   closeEditMenuBottomSheet()
  //   setShowCompleteModal(true)
  // }, [schedule.schedule_id, closeEditMenuBottomSheet, setScheduleComplete, setScheduleList, setShowCompleteModal])

  const handleStopFocusMode = React.useCallback(async () => {
    const newScheduleActivityLogId = await setScheduleFocusTime.mutateAsync()

    setSchedule(prevState => ({
      ...prevState,
      schedule_activity_log_id: newScheduleActivityLogId,
      active_time: focusModeInfo?.seconds || 0
    }))

    setScheduleList(prevState => {
      const targetIndex = prevState.findIndex(item => item.schedule_id === focusModeInfo?.schedule_id)

      if (targetIndex !== -1) {
        const updateList = [...prevState]

        updateList[targetIndex] = {
          ...updateList[targetIndex],
          schedule_activity_log_id: newScheduleActivityLogId,
          active_time: focusModeInfo?.seconds || 0
        }
        return updateList
      }

      return prevState
    })

    setFocusModeInfo(null)
  }, [focusModeInfo, setScheduleFocusTime, setSchedule, setScheduleList, setFocusModeInfo])

  // const handleStartFocusMode = React.useCallback(() => {
  //   if (schedule.schedule_id) {
  //     if (focusModeInfo) {
  //       Alert.alert('집중하고 있는 일정이 있어요', '멈추고 시작할까요?', [
  //         {
  //           text: '취소',
  //           onPress: () => {
  //             return
  //           },
  //           style: 'cancel'
  //         },
  //         {
  //           text: '시작하기',
  //           onPress: async () => {
  //             await handleStopFocusMode()
  //
  //             // 새로운 일정 집중 모드 시작
  //             setFocusModeInfo({
  //               schedule_activity_log_id: schedule.schedule_activity_log_id,
  //               schedule_id: schedule.schedule_id!,
  //               seconds: schedule.active_time || 0
  //             })
  //           }
  //         }
  //       ])
  //     } else {
  //       setFocusModeInfo({
  //         schedule_activity_log_id: schedule.schedule_activity_log_id,
  //         schedule_id: schedule.schedule_id,
  //         seconds: schedule.active_time || 0
  //       })
  //     }
  //   }
  // }, [
  //   schedule.schedule_activity_log_id,
  //   schedule.schedule_id,
  //   schedule.active_time,
  //   focusModeInfo,
  //   handleStopFocusMode,
  //   setFocusModeInfo
  // ])

  React.useEffect(() => {
    if (showEditMenuBottomSheet) {
      editInfoBottomSheetRef.current?.present()
    } else {
      if (showEditScheduleBottomSheet) {
        moveEditSchedule()
      } else {
        handleReset()
      }
      editInfoBottomSheetRef.current?.dismiss()
    }

    setShowEditScheduleBottomSheet(false)
  }, [showEditMenuBottomSheet, showEditScheduleBottomSheet, moveEditSchedule, handleReset, setFocusModeInfo])

  // components
  const bottomSheetBackdrop = React.useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const bottomSheetHandler = React.useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={1}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  // const focusTimeTextComponent = React.useMemo(() => {
  //   const focusTimeText = getFocusTimeText(schedule.active_time || 0)
  //   const text = focusTimeText ? focusTimeText : '집중하기'
  //
  //   return <Text style={playFocusModeButtonText}>{text}</Text>
  // }, [schedule.active_time])

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
        <View style={[styles.actionContainer, {backgroundColor: activeTheme.color5}]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.titleText, {color: activeTheme.color3}]}>{schedule.title}</Text>
          </View>

          {/*<View style={styles.actionWrapper}>*/}
          {/*  {isFocusMode ? (*/}
          {/*    <Pressable style={pauseFocusModeButton} onPress={handleStopFocusMode}>*/}
          {/*      <View style={styles.timeActionIcon}>*/}
          {/*        <PauseIcon width={32} height={32} fill="#FF7043" />*/}
          {/*      </View>*/}

          {/*      <Text style={pauseFocusModeButtonText}>{getFocusTimeText(focusModeInfo?.seconds || 0)}</Text>*/}
          {/*    </Pressable>*/}
          {/*  ) : (*/}
          {/*    <Pressable style={playFocusModeButton} onPress={handleStartFocusMode}>*/}
          {/*      <View style={styles.timeActionIcon}>*/}
          {/*        <PlayIcon width={32} height={32} fill="#FF6B6B" />*/}
          {/*      </View>*/}

          {/*      <Text style={playFocusModeButtonText}>{focusTimeTextComponent}</Text>*/}
          {/*    </Pressable>*/}
          {/*  )}*/}

          {/*  <Pressable style={completeActionButtonStyle} disabled={!!schedule.complete_state} onPress={handleComplete}>*/}
          {/*    <View style={styles.timeActionIcon}>*/}
          {/*      <CheckIcon*/}
          {/*        width={28}*/}
          {/*        height={28}*/}
          {/*        strokeWidth={3}*/}
          {/*        stroke={schedule.complete_state ? '#babfc5' : '#66BB6A'}*/}
          {/*      />*/}
          {/*    </View>*/}

          {/*    <Text style={completeActionButtonTextStyle}>{schedule.complete_state ? '완료했어요' : '완료하기'}</Text>*/}
          {/*  </Pressable>*/}
          {/*</View>*/}
        </View>

        <View style={[styles.menuContainer, {backgroundColor: activeTheme.color5}]}>
          <Pressable style={styles.menuWrapper} onPress={moveEditRoutine}>
            <View style={routineButton}>
              <RoutineIcon width={14} height={14} fill="#fff" />
            </View>

            <Text style={[styles.text, {color: activeTheme.color3}]}>루틴 추가하기</Text>
          </Pressable>

          <Pressable style={styles.menuWrapper} onPress={openEditTodoModal}>
            <View style={todoButton}>
              <TodoIcon width={14} height={14} fill="#fff" />
            </View>

            <Text style={[styles.text, {color: activeTheme.color3}]}>할 일 추가하기</Text>
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
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 5
  },
  actionWrapper: {
    flexDirection: 'row',
    gap: 15
  },
  actionButton: {
    flex: 1,
    gap: 7,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center'
  },
  timeActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  actionButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14
  },

  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20
  },
  menuWrapper: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12
  },
  titleContainer: {
    paddingBottom: 15
  },
  titleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
    color: '#000',
    textAlign: 'center'
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  }
})

// const playFocusModeButton = StyleSheet.compose(styles.actionButton, {backgroundColor: '#FF6B6B20'})
// const playFocusModeButtonText = StyleSheet.compose(styles.actionButtonText, {color: '#FF6B6B'})
// const pauseFocusModeButton = StyleSheet.compose(styles.actionButton, {backgroundColor: '#FF704320'})
// const pauseFocusModeButtonText = StyleSheet.compose(styles.actionButtonText, {color: '#FF7043'})

const routineButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#FFD54F'})
const todoButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#76d672'})
const updateButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#1E90FF'})
const deleteButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#FD4672'})

export default EditMenuBottomSheet
