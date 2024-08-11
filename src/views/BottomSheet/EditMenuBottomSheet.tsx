import React from 'react'
import {StyleSheet, Alert, View, Text, Pressable} from 'react-native'
import {BottomSheetModal, BottomSheetBackdropProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'

import {useMutation} from '@tanstack/react-query'

import {useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState} from 'recoil'
import {isEditState} from '@/store/system'
import {scheduleState, scheduleTodoState} from '@/store/schedule'
import {showEditTodoModalState} from '@/store/modal'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'

import EditIcon from '@/assets/icons/edit3.svg'
import DeleteIcon from '@/assets/icons/trash.svg'
import TodoIcon from '@/assets/icons/priority.svg' // TODO 이름 변경하기 (priority -> check_square)

// repository
import {scheduleRepository} from '@/repository'

interface Props {
  refetchScheduleList: Function
}
const EditMenuBottomSheet = ({refetchScheduleList}: Props) => {
  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const setShowEditTodoModalState = useSetRecoilState(showEditTodoModalState)
  const setIsEdit = useSetRecoilState(isEditState)
  const schedule = useRecoilValue(scheduleState)
  const resetSchedule = useResetRecoilState(scheduleState)
  const changeScheduleTodo = useSetRecoilState(scheduleTodoState)

  const editInfoBottomSheetRef = React.useRef<BottomSheetModal>(null)

  const snapPoints = React.useMemo(() => {
    return [350]
  }, [])

  const openEditTodoModal = React.useCallback(() => {
    if (schedule.schedule_id) {
      changeScheduleTodo(prevState => ({
        ...prevState,
        schedule_id: schedule.schedule_id
      }))

      setShowEditTodoModalState(true)
    }
  }, [schedule.schedule_id, changeScheduleTodo, setShowEditTodoModalState])

  const updateScheduleDisableMutation = useMutation({
    mutationFn: async (data: ScheduleDisableReqeust) => {
      await scheduleRepository.updateScheduleDisable(data)
    },
    onSuccess: async () => {
      await refetchScheduleList()
      handleReset()
      setShowEditMenuBottomSheet(false)
    }
  })

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

            updateScheduleDisableMutation.mutate(params)
          }
        },
        style: 'destructive'
      }
    ])
  }, [schedule.title, schedule.schedule_id, updateScheduleDisableMutation])

  const openEditScheduleBottomSheet = React.useCallback(() => {
    setShowEditMenuBottomSheet(false)
    setIsEdit(true)
  }, [setShowEditMenuBottomSheet, setIsEdit])

  const closeEditMenuBottomSheet = React.useCallback(() => {
    setShowEditMenuBottomSheet(false)
  }, [setShowEditMenuBottomSheet])

  React.useEffect(() => {
    if (showEditMenuBottomSheet) {
      editInfoBottomSheetRef.current?.present()
    } else {
      editInfoBottomSheetRef.current?.dismiss()
    }
  }, [showEditMenuBottomSheet])

  const handleReset = React.useCallback(() => {
    resetSchedule()
  }, [resetSchedule])

  const backdropComponent = React.useCallback(
    (props: BottomSheetBackdropProps) => {
      return <BottomSheetBackdrop props={props} onPress={handleReset} />
    },
    [handleReset]
  )

  return (
    <BottomSheetModal
      name="editMenu"
      ref={editInfoBottomSheetRef}
      backdropComponent={backdropComponent}
      index={0}
      snapPoints={snapPoints}
      onDismiss={closeEditMenuBottomSheet}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          {/* <Text style={styles.titleText}>
            테스트 데이터테스트 데이터테스트 데이터테스트 데이터테스트 데이터테스트 데이터테스트 데이터
          </Text> */}
          <Text style={styles.titleText}>{schedule.title}</Text>
        </View>

        <Pressable style={styles.section} onPress={openEditTodoModal}>
          <View style={todoButton}>
            <TodoIcon width={14} height={14} fill="#fff" />
          </View>

          <Text style={styles.text}>할 일 추가하기</Text>
        </Pressable>

        <Pressable style={styles.section} onPress={openEditScheduleBottomSheet}>
          <View style={updateButton}>
            <EditIcon width={12} height={12} stroke="#fff" fill="#fff" />
          </View>

          <Text style={styles.text}>수정하기</Text>
        </Pressable>

        <Pressable style={styles.section} onPress={deleteSchedule}>
          <View style={deleteButton}>
            <DeleteIcon width={14} height={14} fill="#fff" />
          </View>

          <Text style={styles.text}>삭제하기</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16
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
    fontSize: 18,
    color: '#000'
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  }
})

const todoButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#76d672'})
const updateButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#1E90FF'})
const deleteButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#FD4672'})

export default EditMenuBottomSheet
