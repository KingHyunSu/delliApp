import React from 'react'
import {StyleSheet, Alert, View, Text, Pressable, Platform} from 'react-native'
import {BottomSheetModal, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'

import {useRecoilState, useSetRecoilState, useResetRecoilState, useRecoilValue} from 'recoil'
import {activeThemeState, isEditState} from '@/store/system'
import {editScheduleFormState, scheduleDateState, scheduleState} from '@/store/schedule'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'
import {widgetWithImageUpdatedState} from '@/store/widget'

import EditIcon from '@/assets/icons/edit3.svg'
import DeleteIcon from '@/assets/icons/trash.svg'
import RoutineIcon from '@/assets/icons/routine.svg'
import TodoIcon from '@/assets/icons/priority.svg'

import {useQueryClient} from '@tanstack/react-query'
import {useUpdateScheduleDeleted} from '@/apis/hooks/useSchedule'
import {navigate} from '@/utils/navigation'

interface Props {
  moveEditSchedule: Function
}
const EditMenuBottomSheet = ({moveEditSchedule}: Props) => {
  const queryClient = useQueryClient()

  const updateScheduleDeleted = useUpdateScheduleDeleted()

  const editInfoBottomSheetRef = React.useRef<BottomSheetModal>(null)

  const [showEditScheduleBottomSheet, setShowEditScheduleBottomSheet] = React.useState(false)

  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const [editScheduleForm, setEditScheduleForm] = useRecoilState(editScheduleFormState)

  const isEdit = useRecoilValue(isEditState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const activeTheme = useRecoilValue(activeThemeState)

  const resetSchedule = useResetRecoilState(scheduleState)
  const setWidgetWithImageUpdated = useSetRecoilState(widgetWithImageUpdatedState)

  const snapPoints = React.useMemo(() => {
    return [500]
  }, [])

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
    navigate('EditRoutine', {scheduleId: editScheduleForm.schedule_id, routineId: null})
  }, [editScheduleForm.schedule_id, closeEditMenuBottomSheet])

  const moveEditTodo = React.useCallback(() => {
    closeEditMenuBottomSheet()
    navigate('EditTodo', {scheduleId: editScheduleForm.schedule_id, todoId: null})
  }, [editScheduleForm.schedule_id, closeEditMenuBottomSheet])

  const deleteSchedule = React.useCallback(() => {
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

              await queryClient.invalidateQueries({queryKey: ['scheduleList', scheduleDate]})

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
    editScheduleForm.title,
    editScheduleForm.schedule_id,
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
  }, [showEditMenuBottomSheet, showEditScheduleBottomSheet, moveEditSchedule, handleReset])

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
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      index={0}
      snapPoints={snapPoints}
      onDismiss={closeEditMenuBottomSheet}>
      <View style={[styles.container, {backgroundColor: activeTheme.color2}]}>
        <View style={[styles.actionContainer, {backgroundColor: activeTheme.color5}]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.titleText, {color: activeTheme.color3}]}>{editScheduleForm.title}</Text>
          </View>
        </View>

        <View style={[styles.menuContainer, {backgroundColor: activeTheme.color5}]}>
          <Pressable style={styles.menuWrapper} onPress={moveEditRoutine}>
            <View style={routineButton}>
              <RoutineIcon width={14} height={14} fill="#fff" />
            </View>

            <Text style={[styles.text, {color: activeTheme.color3}]}>루틴 추가하기</Text>
          </Pressable>

          <Pressable style={styles.menuWrapper} onPress={moveEditTodo}>
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

const routineButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#FFD54F'})
const todoButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#76d672'})
const updateButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#1E90FF'})
const deleteButton = StyleSheet.compose(styles.iconWrapper, {backgroundColor: '#FD4672'})

export default EditMenuBottomSheet
