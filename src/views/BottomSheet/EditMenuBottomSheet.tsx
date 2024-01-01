import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'

import {useMutation} from '@tanstack/react-query'
import {updateScheduleDisable, updateScheduleComplete} from '@/apis/schedule'

import {useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState} from 'recoil'
import {isEditState} from '@/store/system'
import {scheduleState, scheduleDateState} from '@/store/schedule'
import {showScheduleCompleteModalState} from '@/store/modal'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'

import {format} from 'date-fns'
import {trigger} from 'react-native-haptic-feedback'

import CheckIcon from '@/assets/icons/check.svg'
import EditIcon from '@/assets/icons/edit3.svg'
import DeleteIcon from '@/assets/icons/trash.svg'

import {Schedule, ScheduleDisable, ScheduleComplete} from '@/types/schedule'

interface Props {
  refetchScheduleList: Function
}
const EditMenuBottomSheet = ({refetchScheduleList}: Props) => {
  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const setShowScheduleCompleteModal = useSetRecoilState(showScheduleCompleteModalState)
  const setIsEdit = useSetRecoilState(isEditState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const schedule = useRecoilValue(scheduleState)
  const resetSchedule = useResetRecoilState(scheduleState)

  const editInfoBottomSheetRef = React.useRef<BottomSheetModal>(null)

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
  }
  const haptic = (hapticName: string) => {
    trigger(hapticName, options)
  }

  const updateScheduleCompleteMutation = useMutation({
    mutationFn: async (data: Schedule) => {
      if (data.schedule_id) {
        const params: ScheduleComplete = {
          schedule_id: data.schedule_id,
          schedule_complete_id: data.schedule_complete_id,
          complete_date: format(scheduleDate, 'yyyy-MM-dd'),
          complete_start_time: data.start_time,
          complete_end_time: data.end_time
        }
        return await updateScheduleComplete(params)
      }
    },
    onSuccess: async () => {
      haptic('notificationSuccess')
      await refetchScheduleList()
      setShowEditMenuBottomSheet(false)
    }
  })

  const openScheduleCompleteModal = () => {
    if (schedule.complete_start_time) {
      setShowEditMenuBottomSheet(false)
      return
    }

    updateScheduleCompleteMutation.mutate(schedule)
    // [V2] - 완료하기 모달 열기
    // haptic('impactLight')
    // setShowScheduleCompleteModal(true)
  }

  const updateScheduleDisableMutation = useMutation({
    mutationFn: async (data: Schedule) => {
      if (data.schedule_id) {
        const params: ScheduleDisable = {
          schedule_id: data.schedule_id
        }
        return await updateScheduleDisable(params)
      }
    },
    onSuccess: async () => {
      haptic('rigid')
      await refetchScheduleList()
      setShowEditMenuBottomSheet(false)
    }
  })

  const deleteSchedule = () => {
    updateScheduleDisableMutation.mutate(schedule)
  }

  const openEditScheduleBottomSheet = () => {
    setShowEditMenuBottomSheet(false)
    setIsEdit(true)
  }

  React.useEffect(() => {
    if (showEditMenuBottomSheet) {
      haptic('rigid')
      editInfoBottomSheetRef.current?.present()
    } else {
      editInfoBottomSheetRef.current?.dismiss()
    }
  }, [showEditMenuBottomSheet])

  return (
    <BottomSheetModal
      name="editMenu"
      ref={editInfoBottomSheetRef}
      backdropComponent={props => {
        return <BottomSheetBackdrop props={props} onPress={() => resetSchedule()} />
      }}
      index={0}
      snapPoints={[350]}
      onDismiss={() => setShowEditMenuBottomSheet(false)}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          {/* <Text style={styles.titleText}>
            테스트 데이터테스트 데이터테스트 데이터테스트 데이터테스트 데이터테스트 데이터테스트 데이터
          </Text> */}
          <Text style={styles.titleText}>{schedule.title}</Text>
        </View>

        <Pressable style={styles.section} onPress={openScheduleCompleteModal}>
          <View style={[styles.iconWrapper, {backgroundColor: '#76d672'}]}>
            <CheckIcon width={14} height={14} stroke="#fff" strokeWidth={3} />
          </View>

          <Text style={styles.text}>완료하기</Text>

          {/* <View style={styles.completeTimeBox}>
            <Text style={styles.completeTime}>오전 1시 00분</Text>
            <Text style={styles.completeTime}>-</Text>
            <Text style={styles.completeTime}>오전 6시 10분</Text>
          </View> */}
        </Pressable>
        <Pressable style={styles.section} onPress={openEditScheduleBottomSheet}>
          <View style={[styles.iconWrapper, {backgroundColor: '#1E90FF'}]}>
            <EditIcon width={12} height={12} stroke="#fff" fill="#fff" />
          </View>

          <Text style={styles.text}>수정하기</Text>
        </Pressable>
        <Pressable style={styles.section} onPress={deleteSchedule}>
          <View style={[styles.iconWrapper, {backgroundColor: '#FD4672'}]}>
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
    // marginVertical: 10,
    paddingVertical: 16
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12
  },
  completeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  completeTimeBox: {
    flexDirection: 'row',
    gap: 5
  },
  completeTime: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    // color: '#1A7BDB'
    color: '#1E90FF'
  },
  titleContainer: {
    height: 50
  },
  titleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  }
})

export default EditMenuBottomSheet
