import {useCallback, useMemo} from 'react'
import {StyleSheet, View, Text, TextInput} from 'react-native'
import ScheduleItem from '@/components/ScheduleItem'
import {GetGoalScheduleListResponse} from '@/repository/types/goal'

interface Props {
  item: GetGoalScheduleListResponse
  index: number
  onChange: (value: GetGoalScheduleListResponse, index: number) => void
}
const EditGoalScheduleItem = ({item, index, onChange}: Props) => {
  const hours = useMemo(() => {
    if (item.focus_time) {
      const value = Math.floor(item.focus_time / 60)

      return value > 0 ? value.toString() : ''
    }
    return ''
  }, [item.focus_time])

  const minutes = useMemo(() => {
    if (item.focus_time) {
      const value = Math.floor(item.focus_time % 60)

      return value > 0 ? value.toString() : ''
    }
    return ''
  }, [item.focus_time])

  const getNumericValue = useCallback((value: string) => {
    return Number(value.replace(/[^0-9]/g, ''))
  }, [])

  const changeHours = useCallback(
    (value: string) => {
      const numericValue = getNumericValue(value) * 60

      onChange(
        {
          ...item,
          focus_time: numericValue + Number(minutes)
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
          focus_time: Number(hours) * 60 + numericValue
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
          complete_count: numericValue
        },
        index
      )
    },
    [getNumericValue, item, index, onChange]
  )

  return (
    <View style={styles.itemContainer}>
      <ScheduleItem item={item} />

      <View style={styles.itemFormContainer}>
        <View style={styles.itemInputContainer}>
          <Text style={styles.itemLabel}>목표 집중 시간</Text>

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
          <Text style={styles.itemLabel}>목표 완료 횟수</Text>

          <View style={styles.completeCountInputWrapper}>
            <TextInput
              value={(item.complete_count || '').toString()}
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
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 10
  },
  itemFormContainer: {
    marginTop: 20,
    gap: 15
  },
  itemInputContainer: {
    gap: 5
  },
  itemLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#7c8698'
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
  }
})

export default EditGoalScheduleItem
