import {useMemo, useCallback} from 'react'
import {StyleSheet, Text, View, Pressable} from 'react-native'
import ScheduleItem from '@/components/ScheduleItem'
import DeleteIcon from '@/assets/icons/trash.svg'
import OverlapIcon from '@/assets/icons/overlap.svg'
import {UpdateScheduleDeleted, UpdateScheduleDisable} from '@/apis/local/types/schedule'

interface Props {
  schedule: ExistSchedule
  disabledScheduleIdList: UpdateScheduleDisable[]
  deletedScheduleIdList: UpdateScheduleDeleted[]
  onDelete: (schedule: ExistSchedule) => void
  onDisabled: (schedule: ExistSchedule) => void
  onCancelDeleted: (schedule: ExistSchedule) => void
  onCancelDisabled: (schedule: ExistSchedule) => void
}

const OverlapSchedule = ({
  schedule,
  disabledScheduleIdList,
  deletedScheduleIdList,
  onDelete,
  onDisabled,
  onCancelDeleted,
  onCancelDisabled
}: Props) => {
  const isDisabled = useMemo(() => {
    return disabledScheduleIdList.findIndex(sItem => sItem.schedule_id === schedule.schedule_id) !== -1
  }, [schedule.schedule_id, disabledScheduleIdList])

  const isDeleted = useMemo(() => {
    return deletedScheduleIdList.findIndex(sItem => sItem.schedule_id === schedule.schedule_id) !== -1
  }, [schedule.schedule_id, deletedScheduleIdList])

  const handleDisabled = useCallback(() => {
    if (isDeleted) {
      onCancelDeleted(schedule)
    }
    if (isDisabled) {
      onCancelDisabled(schedule)
    } else {
      onDisabled(schedule)
    }
  }, [isDisabled, isDeleted, onDisabled, onCancelDisabled, onCancelDeleted, schedule])

  const handleDeleted = useCallback(() => {
    if (isDisabled) {
      onCancelDisabled(schedule)
    }

    if (isDeleted) {
      onCancelDeleted(schedule)
    } else {
      onDelete(schedule)
    }
  }, [isDisabled, isDeleted, onDelete, onCancelDisabled, onCancelDeleted, schedule])

  // components
  const StateBox = useMemo(() => {
    if (isDeleted) {
      return (
        <View style={styles.infoWrapper}>
          <View style={deleteInfoIconWrapper}>
            <DeleteIcon width={12} height={12} fill="#fff" />
          </View>

          <Text style={deleteInfoText}>삭제 예정</Text>
        </View>
      )
    } else if (isDisabled) {
      return (
        <View style={styles.infoWrapper}>
          <View style={disabledInfoIconWrapper}>
            <View style={styles.disabledIcon} />
          </View>

          <Text style={disabledInfoText}>비활성화 예정</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.infoWrapper}>
          <View style={overlapInfoIconWrapper}>
            <OverlapIcon width={12} height={12} fill="#fff" />
          </View>

          <Text style={overlapInfoText}>겹쳐질 예정</Text>
        </View>
      )
    }
  }, [isDeleted, isDisabled])

  return (
    <View style={styles.container}>
      {StateBox}

      <ScheduleItem
        title={schedule.title}
        time={{startTime: schedule.start_time, endTime: schedule.end_time}}
        date={{startDate: schedule.start_date, endDate: schedule.end_date}}
        dayOfWeek={{
          mon: schedule.mon,
          tue: schedule.tue,
          wed: schedule.wed,
          thu: schedule.thu,
          fri: schedule.fri,
          sat: schedule.sat,
          sun: schedule.sun
        }}
      />

      <View style={styles.buttonContainer}>
        <Pressable style={disabledButton} onPress={handleDisabled}>
          <Text style={disabledButtonText}>{isDisabled ? '비활성화 취소' : '비활성화'}</Text>
        </Pressable>

        <Pressable style={deleteButton} onPress={handleDeleted}>
          <Text style={deleteButtonText}>{isDeleted ? '삭제 취소' : '삭제'}</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 15,
    backgroundColor: '#fff'
  },
  infoWrapper: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  infoIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabledIcon: {
    width: 8,
    height: 2,
    backgroundColor: '#fff'
  },
  infoText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 10
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14
  }
})
const disabledButton = StyleSheet.compose(styles.button, {backgroundColor: '#9aa0a430'})
const disabledButtonText = StyleSheet.compose(styles.buttonText, {color: '#8d9195'})
const deleteButton = StyleSheet.compose(styles.button, {backgroundColor: '#f12d2220'})
const deleteButtonText = StyleSheet.compose(styles.buttonText, {color: '#f12d22'})

const overlapInfoIconWrapper = StyleSheet.compose(styles.infoIcon, {backgroundColor: '#424242'})
const overlapInfoText = StyleSheet.compose(styles.infoText, {color: '#424242'})
const disabledInfoIconWrapper = StyleSheet.compose(styles.infoIcon, {backgroundColor: '#9aa0a4'})
const disabledInfoText = StyleSheet.compose(styles.infoText, {color: '#9aa0a4'})
const deleteInfoIconWrapper = StyleSheet.compose(styles.infoIcon, {backgroundColor: '#f12d22'})
const deleteInfoText = StyleSheet.compose(styles.infoText, {color: '#f12d22'})

export default OverlapSchedule
