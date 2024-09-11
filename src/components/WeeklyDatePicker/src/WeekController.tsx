import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import {format} from 'date-fns'
import DatePickerBottomSheet from '@/views/BottomSheet/DatePickerBottomSheet'
import RightArrowIcon from '@/assets/icons/arrow_right.svg'

interface Props {
  date: Date
  onChange: Function
}
const WeekController = ({date, onChange}: Props) => {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']

  const [showDatePickerBottomSheet, setShowDatePickerBottomSheet] = React.useState(false)
  const screenDateStr = React.useMemo(() => format(date, 'yyyy-MM-dd'), [date])

  const dateString = React.useMemo(() => {
    const dayOfWeekIndex = date.getDay()
    return format(date, 'yyyy년 MM월 dd일') + ' ' + `${weekdays[dayOfWeekIndex]}요일`
  }, [date])

  const changeDate = React.useCallback((data: string) => {
    onChange(new Date(data))
  }, [])

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.button} onPress={() => setShowDatePickerBottomSheet(true)}>
        <Text style={styles.text}>{dateString}</Text>
        <RightArrowIcon stroke="#424242" strokeWidth={3} />
      </Pressable>

      <DatePickerBottomSheet
        value={screenDateStr}
        isShow={showDatePickerBottomSheet}
        onClose={() => setShowDatePickerBottomSheet(false)}
        onChange={changeDate}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 22,
    color: '#424242'
  }
})

export default WeekController
