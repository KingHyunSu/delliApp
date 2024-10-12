import React from 'react'
import {StyleSheet, Alert, View, Text, Pressable} from 'react-native'
import {BottomSheetModal, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'

import {useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState} from 'recoil'
import {isEditState} from '@/store/system'
import {focusModeInfoState, scheduleDateState, scheduleListState, scheduleState} from '@/store/schedule'
import {editTodoFormState} from '@/store/todo'
import {showCompleteModalState, showEditTodoModalState} from '@/store/modal'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'

import EditIcon from '@/assets/icons/edit3.svg'
import DeleteIcon from '@/assets/icons/trash.svg'
import TodoIcon from '@/assets/icons/priority.svg'
import PlayIcon from '@/assets/icons/play.svg'
import PauseIcon from '@/assets/icons/pause.svg'
import CheckIcon from '@/assets/icons/check.svg'

import {useMutation} from '@tanstack/react-query'
import {scheduleRepository} from '@/repository'
import {format} from 'date-fns'

interface Props {
  updateScheduleDeletedMutate: Function
  openEditScheduleBottomSheet: Function
}
const EditMenuBottomSheet = ({updateScheduleDeletedMutate, openEditScheduleBottomSheet}: Props) => {
  const editInfoBottomSheetRef = React.useRef<BottomSheetModal>(null)

  const [showEditScheduleBottomSheet, setShowEditScheduleBottomSheet] = React.useState(false)
  const [isRelayFocusTime, setIsRelayFocusTime] = React.useState(false)

  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const [isEdit, setIsEdit] = useRecoilState(isEditState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const [focusModeInfo, setFocusModeInfo] = useRecoilState(focusModeInfoState)

  const scheduleDate = useRecoilValue(scheduleDateState)

  const resetSchedule = useResetRecoilState(scheduleState)
  const setEditTodoForm = useSetRecoilState(editTodoFormState)
  const setScheduleList = useSetRecoilState(scheduleListState)
  const setShowEditTodoModalState = useSetRecoilState(showEditTodoModalState)
  const setShowCompleteModal = useSetRecoilState(showCompleteModalState)

  const {mutate: setScheduleCompleteMutation} = useMutation({
    mutationFn: () => {
      if (schedule.schedule_activity_log_id) {
        const params = {
          schedule_activity_log_id: schedule.schedule_activity_log_id
        }

        return scheduleRepository.updateScheduleComplete(params)
      } else {
        const params = {
          schedule_id: schedule.schedule_id!,
          date: format(scheduleDate, 'yyyy-MM-dd')
        }

        return scheduleRepository.setScheduleComplete(params)
      }
    },
    onSuccess: () => {
      setScheduleList(prevState => {
        const targetIndex = prevState.findIndex(item => item.schedule_id === schedule.schedule_id)

        if (targetIndex !== -1) {
          const updateList = [...prevState]

          updateList[targetIndex] = {
            ...updateList[targetIndex],
            complete_state: 1
          }
          return updateList
        }

        return prevState
      })
      closeEditMenuBottomSheet()
      setShowCompleteModal(true)
    }
  })

  const {mutate: setScheduleFocusTimeMutation} = useMutation({
    mutationFn: () => {
      if (!focusModeInfo) {
        throw new Error('focusModeInfo empty')
      }

      if (focusModeInfo.schedule_activity_log_id) {
        const params = {
          schedule_activity_log_id: focusModeInfo.schedule_activity_log_id,
          active_time: focusModeInfo.seconds
        }

        return scheduleRepository.updateScheduleFocusTime(params)
      } else {
        const params = {
          schedule_id: focusModeInfo.schedule_id,
          active_time: focusModeInfo.seconds,
          date: format(scheduleDate, 'yyyy-MM-dd')
        }

        return scheduleRepository.setScheduleFocusTime(params)
      }
    },
    onSuccess: id => {
      setSchedule(prevState => ({
        ...prevState,
        schedule_activity_log_id: id,
        active_time: focusModeInfo?.seconds || 0
      }))

      setScheduleList(prevState => {
        const targetIndex = prevState.findIndex(item => item.schedule_id === focusModeInfo?.schedule_id)

        if (targetIndex !== -1) {
          const updateList = [...prevState]

          updateList[targetIndex] = {
            ...updateList[targetIndex],
            schedule_activity_log_id: id,
            active_time: focusModeInfo?.seconds || 0
          }
          return updateList
        }

        return prevState
      })

      if (isRelayFocusTime) {
        setFocusModeInfo({
          schedule_activity_log_id: schedule.schedule_activity_log_id,
          schedule_id: schedule.schedule_id!,
          seconds: schedule.active_time || 0
        })
        setIsRelayFocusTime(false)
      } else {
        setFocusModeInfo(null)
      }
    }
  })

  const snapPoints = React.useMemo(() => {
    return [500]
  }, [])

  const isFocusMode = React.useMemo(() => {
    return focusModeInfo?.schedule_id === schedule.schedule_id
  }, [schedule.schedule_id, focusModeInfo])

  const completeActionButtonStyle = React.useMemo(() => {
    const backgroundColor = schedule.complete_state ? '#f5f6f8' : '#32CD3220'
    return [styles.actionButton, {backgroundColor}]
  }, [schedule.complete_state])

  const completeActionButtonTextStyle = React.useMemo(() => {
    const color = schedule.complete_state ? '#babfc5' : '#2AB924'
    return [styles.actionButtonText, {color}]
  }, [schedule.complete_state])

  const handleReset = React.useCallback(() => {
    if (!isEdit) {
      resetSchedule()
    }
  }, [isEdit, resetSchedule])

  const openEditTodoModal = React.useCallback(() => {
    if (schedule.schedule_id) {
      setEditTodoForm(prevState => ({
        ...prevState,
        schedule_id: schedule.schedule_id
      }))

      setShowEditTodoModalState(true)
    }
  }, [schedule.schedule_id, setEditTodoForm, setShowEditTodoModalState])

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
        onPress: () => {
          if (schedule.schedule_id) {
            const params = {
              schedule_id: schedule.schedule_id
            }

            updateScheduleDeletedMutate(params)
          }
        },
        style: 'destructive'
      }
    ])
  }, [schedule.title, schedule.schedule_id, updateScheduleDeletedMutate])

  const handleOpenEditScheduleBottomSheet = React.useCallback(() => {
    setShowEditScheduleBottomSheet(true)
    setShowEditMenuBottomSheet(false)
  }, [setShowEditScheduleBottomSheet, setShowEditMenuBottomSheet])

  const closeEditMenuBottomSheet = React.useCallback(() => {
    setShowEditMenuBottomSheet(false)
  }, [setShowEditMenuBottomSheet])

  const handleStartFocusMode = React.useCallback(() => {
    console.log('schedule', schedule)
    if (schedule.schedule_id) {
      if (focusModeInfo) {
        Alert.alert('집중하고 있는 일정이 있어요', '멈추고 시작할까요?', [
          {
            text: '취소',
            onPress: () => {
              return
            },
            style: 'cancel'
          },
          {
            text: '시작하기',
            onPress: () => {
              setIsRelayFocusTime(true)

              setScheduleFocusTimeMutation()
            }
          }
        ])
      } else {
        setFocusModeInfo({
          schedule_activity_log_id: schedule.schedule_activity_log_id,
          schedule_id: schedule.schedule_id,
          seconds: schedule.active_time || 0
        })
      }
    }
  }, [
    schedule.schedule_activity_log_id,
    schedule.schedule_id,
    schedule.active_time,
    focusModeInfo,
    setFocusModeInfo,
    setScheduleFocusTimeMutation
  ])

  const handleStopFocusMode = React.useCallback(() => {
    setScheduleFocusTimeMutation()
  }, [setScheduleFocusTimeMutation])

  const doComplete = React.useCallback(() => {
    setScheduleCompleteMutation()
  }, [setScheduleCompleteMutation])

  const getFocusTime = React.useCallback((seconds: number | null) => {
    if (seconds === null) {
      return ''
    }

    const hours = Math.floor(seconds / 3600) // 전체 초에서 시간을 계산
    const minutes = Math.floor((seconds % 3600) / 60) // 남은 초에서 분을 계산
    const secs = seconds % 60 // 남은 초

    const hoursStr = hours === 0 ? '' : String(hours).padStart(2, '0') + ':'
    return `${hoursStr}${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }, [])

  React.useEffect(() => {
    if (showEditMenuBottomSheet) {
      editInfoBottomSheetRef.current?.present()
    } else {
      if (showEditScheduleBottomSheet) {
        openEditScheduleBottomSheet()
      } else {
        handleReset()
      }
      editInfoBottomSheetRef.current?.dismiss()
    }

    setShowEditScheduleBottomSheet(false)
  }, [showEditMenuBottomSheet, showEditScheduleBottomSheet, openEditScheduleBottomSheet, handleReset, setFocusModeInfo])

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

  const focusTimeTextComponent = React.useMemo(() => {
    const focusTimeText = getFocusTime(schedule.active_time)
    const text = focusTimeText ? focusTimeText : '집중하기'

    return <Text style={playFocusModeButtonText}>{text}</Text>
  }, [getFocusTime, schedule.active_time])

  return (
    <BottomSheetModal
      name="editMenu"
      ref={editInfoBottomSheetRef}
      backdropComponent={bottomSheetBackdrop}
      handleComponent={bottomSheetHandler}
      index={0}
      snapPoints={snapPoints}
      onDismiss={closeEditMenuBottomSheet}>
      <View style={styles.container}>
        <View style={styles.actionContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{schedule.title}</Text>
          </View>

          <View style={styles.actionWrapper}>
            {isFocusMode ? (
              <Pressable style={pauseFocusModeButton} onPress={handleStopFocusMode}>
                <View style={styles.timeActionIcon}>
                  <PauseIcon width={32} height={32} fill="#1E90FF" />
                </View>

                <Text style={pauseFocusModeButtonText}>{getFocusTime(focusModeInfo?.seconds || 0)}</Text>
              </Pressable>
            ) : (
              <Pressable style={playFocusModeButton} onPress={handleStartFocusMode}>
                <View style={styles.timeActionIcon}>
                  <PlayIcon width={32} height={32} fill="#FF0000" />
                </View>

                <Text style={playFocusModeButtonText}>{focusTimeTextComponent}</Text>
              </Pressable>
            )}

            <Pressable style={completeActionButtonStyle} disabled={!!schedule.complete_state} onPress={doComplete}>
              <View style={styles.timeActionIcon}>
                <CheckIcon
                  width={28}
                  height={28}
                  strokeWidth={3}
                  stroke={schedule.complete_state ? '#babfc5' : '#32CD32'}
                />
              </View>

              <Text style={completeActionButtonTextStyle}>{schedule.complete_state ? '완료했어요' : '완료하기'}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Pressable style={styles.menuWrapper} onPress={openEditTodoModal}>
            <View style={todoButton}>
              <TodoIcon width={14} height={14} fill="#fff" />
            </View>

            <Text style={styles.text}>할 일 추가하기</Text>
          </Pressable>

          <Pressable style={styles.menuWrapper} onPress={handleOpenEditScheduleBottomSheet}>
            <View style={updateButton}>
              <EditIcon width={12} height={12} stroke="#fff" fill="#fff" />
            </View>

            <Text style={styles.text}>수정하기</Text>
          </Pressable>

          <Pressable style={styles.menuWrapper} onPress={deleteSchedule}>
            <View style={deleteButton}>
              <DeleteIcon width={14} height={14} fill="#fff" />
            </View>

            <Text style={styles.text}>삭제하기</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8'
  },
  actionContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 10
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
    paddingTop: 20,
    backgroundColor: '#ffffff'
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
    height: 50
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

const playFocusModeButton = StyleSheet.compose(styles.actionButton, {backgroundColor: '#FF000015'})
const playFocusModeButtonText = StyleSheet.compose(styles.actionButtonText, {color: '#FF0000'})
const pauseFocusModeButton = StyleSheet.compose(styles.actionButton, {backgroundColor: '#1E90FF15'})
const pauseFocusModeButtonText = StyleSheet.compose(styles.actionButtonText, {color: '#1E90FF'})

const todoButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#76d672'})
const updateButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#1E90FF'})
const deleteButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#FD4672'})

export default EditMenuBottomSheet
