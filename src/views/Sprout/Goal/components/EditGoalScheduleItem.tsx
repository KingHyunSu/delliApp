import {useCallback, useMemo} from 'react'
import {StyleSheet, View, Text, TextInput, Pressable} from 'react-native'
import ScheduleItem from '@/components/ScheduleItem'
import TimerIcon from '@/assets/icons/timer.svg'
import PriorityIcon from '@/assets/icons/priority2.svg'
import {GoalSchedule} from '@/@types/goal'

interface Props {
  item: GoalSchedule
  index: number
  onChange: (value: GoalSchedule, index: number) => void
  onDelete: (value: GoalSchedule) => void
}
const EditGoalScheduleItem = ({item, index, onChange, onDelete}: Props) => {
  const hours = useMemo(() => {
    if (item.total_focus_time) {
      const value = Math.floor(item.total_focus_time / 60)

      return value > 0 ? value.toString() : ''
    }
    return ''
  }, [item.total_focus_time])

  const minutes = useMemo(() => {
    if (item.total_focus_time) {
      const value = Math.floor(item.total_focus_time % 60)

      return value > 0 ? value.toString() : ''
    }
    return ''
  }, [item.total_focus_time])

  const getNumericValue = useCallback((value: string) => {
    return Number(value.replace(/[^0-9]/g, ''))
  }, [])

  const changeHours = useCallback(
    (value: string) => {
      const numericValue = getNumericValue(value) * 60

      onChange(
        {
          ...item,
          total_focus_time: numericValue + Number(minutes)
        },
        index
      )
    },
    [getNumericValue, minutes, item, index, onChange]
  )

  const changeMinutes = useCallback(
    (value: string) => {
      let numericValue = getNumericValue(value)

      if (numericValue > 59) {
        numericValue = numericValue / 10
      }

      onChange(
        {
          ...item,
          total_focus_time: Number(hours) * 60 + numericValue
        },
        index
      )
    },
    [getNumericValue, hours, item, index, onChange]
  )

  const changeCompleteCount = useCallback(
    (value: string) => {
      const numericValue = getNumericValue(value)

      onChange(
        {
          ...item,
          total_complete_count: numericValue
        },
        index
      )
    },
    [getNumericValue, item, index, onChange]
  )

  return (
    <View style={styles.itemContainer}>
      <ScheduleItem
        title={item.title}
        categoryId={item.schedule_category_id}
        time={{startTime: item.start_time, endTime: item.end_time}}
        date={{startDate: item.start_date, endDate: item.end_date}}
        dayOfWeek={{
          mon: item.mon,
          tue: item.tue,
          wed: item.wed,
          thu: item.thu,
          fri: item.fri,
          sat: item.sat,
          sun: item.sun
        }}
      />

      <View style={styles.itemFormContainer}>
        <View style={styles.itemInputContainer}>
          <View style={styles.itemLabelWrapper}>
            <TimerIcon width={18} height={18} fill="#424242" />
            <Text style={styles.itemLabel}>목표 집중 시간</Text>
          </View>

          <View style={styles.focusTimeInputWrapper}>
            <View style={styles.focusTimeInput}>
              <TextInput
                value={hours}
                style={styles.itemInput}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor="#c3c5cc"
                onChangeText={changeHours}
              />
              <Text style={styles.itemInputUnitText}>시간</Text>
            </View>

            <View style={styles.focusTimeInput}>
              <TextInput
                value={minutes}
                style={styles.itemInput}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="0"
                placeholderTextColor="#c3c5cc"
                onChangeText={changeMinutes}
              />
              <Text style={styles.itemInputUnitText}>분</Text>
            </View>
          </View>
        </View>

        <View style={styles.itemInputContainer}>
          <View style={styles.itemLabelWrapper}>
            <PriorityIcon width={19} height={19} fill="#424242" />
            <Text style={styles.itemLabel}>목표 완료 횟수</Text>
          </View>

          <View style={styles.completeCountInputWrapper}>
            <TextInput
              value={(item.total_complete_count || '').toString()}
              style={styles.completeCountInput}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="#c3c5cc"
              onChangeText={changeCompleteCount}
            />
            <Text style={styles.itemInputUnitText}>회</Text>
          </View>
        </View>
      </View>

      <View style={styles.deleteButtonWrapper}>
        <Pressable style={styles.deleteButton} onPress={() => onDelete(item)}>
          <Text style={styles.deleteButtonText}>삭제하기</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingHorizontal: 16,
    marginTop: 10
  },
  itemFormContainer: {
    marginTop: 20,
    gap: 15
  },
  itemInputContainer: {
    gap: 7
  },
  itemLabelWrapper: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  itemLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  itemInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  itemInputUnitText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#c3c5cc'
  },
  focusTimeInputWrapper: {
    flexDirection: 'row',
    gap: 10
  },
  focusTimeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 10
  },
  completeCountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 10
  },
  completeCountInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  deleteButtonWrapper: {
    alignItems: 'center',
    marginTop: 10
  },
  deleteButton: {
    paddingHorizontal: 20,
    height: 48,
    justifyContent: 'center'
  },
  deleteButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#babfc5'
  }
})

export default EditGoalScheduleItem
