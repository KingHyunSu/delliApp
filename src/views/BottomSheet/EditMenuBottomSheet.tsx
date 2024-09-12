import React from 'react'
import {StyleSheet, Alert, View, Text, Pressable} from 'react-native'
import {BottomSheetModal, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'

import {useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState} from 'recoil'
import {isEditState} from '@/store/system'
import {scheduleDateState, scheduleListState, scheduleState, scheduleTodoState} from '@/store/schedule'
import {showCompleteModalState, showEditTodoModalState} from '@/store/modal'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'

import EditIcon from '@/assets/icons/edit3.svg'
import DeleteIcon from '@/assets/icons/trash.svg'
import TodoIcon from '@/assets/icons/priority.svg'
import PlayIcon from '@/assets/icons/play.svg'
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

  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const [isEdit, setIsEdit] = useRecoilState(isEditState)

  const schedule = useRecoilValue(scheduleState)
  const scheduleDate = useRecoilValue(scheduleDateState)

  const resetSchedule = useResetRecoilState(scheduleState)
  const changeScheduleTodo = useSetRecoilState(scheduleTodoState)
  const setScheduleList = useSetRecoilState(scheduleListState)
  const setShowEditTodoModalState = useSetRecoilState(showEditTodoModalState)
  const setShowCompleteModal = useSetRecoilState(showCompleteModalState)

  const {mutate: setScheduleCompleteMutation} = useMutation({
    mutationFn: () => {
      const params = {
        schedule_id: schedule.schedule_id!,
        date: format(scheduleDate, 'yyyy-MM-dd')
      }

      return scheduleRepository.setScheduleComplete(params)
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

  const snapPoints = React.useMemo(() => {
    return [500]
  }, [])

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
      changeScheduleTodo(prevState => ({
        ...prevState,
        schedule_id: schedule.schedule_id
      }))

      setShowEditTodoModalState(true)
    }
  }, [schedule.schedule_id, changeScheduleTodo, setShowEditTodoModalState])

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
  }, [schedule.title, schedule.schedule_id])

  const handleOpenEditScheduleBottomSheet = React.useCallback(() => {
    setShowEditScheduleBottomSheet(true)
    setShowEditMenuBottomSheet(false)
  }, [setShowEditScheduleBottomSheet, setShowEditMenuBottomSheet])

  const closeEditMenuBottomSheet = React.useCallback(() => {
    setShowEditMenuBottomSheet(false)
  }, [setShowEditMenuBottomSheet])

  const doComplete = React.useCallback(() => {
    setScheduleCompleteMutation()
  }, [setScheduleCompleteMutation])

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
  }, [showEditMenuBottomSheet, showEditScheduleBottomSheet, openEditScheduleBottomSheet, handleReset])

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
            <View style={timeActionButton}>
              <View style={styles.timeActionIcon}>
                <PlayIcon width={32} height={32} fill="#FF0000" />
              </View>
              <Text style={timeActionButtonText}>집중하기</Text>
            </View>

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

const timeActionButton = StyleSheet.compose(styles.actionButton, {backgroundColor: '#FF000015'})
const timeActionButtonText = StyleSheet.compose(styles.actionButtonText, {color: '#FF0000'})

const todoButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#76d672'})
const updateButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#1E90FF'})
const deleteButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#FD4672'})

export default EditMenuBottomSheet
