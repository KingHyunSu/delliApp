import React from 'react'
import {StyleSheet, View} from 'react-native'
import WheelPicker, {WheelPickerRefs} from '@/components/WheelPicker'

interface Props {
  value: number
  visibleRest?: number
  onChange: Function
}
const TimeWheelPickerTemp = ({value, visibleRest = 2, onChange}: Props) => {
  const meridiemWheelRef = React.useRef<WheelPickerRefs>(null)
  const hourWheelRef = React.useRef<WheelPickerRefs>(null)
  const minuteWheelRef = React.useRef<WheelPickerRefs>(null)

  // prettier-ignore
  const hourList = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
  // prettier-ignore
  const minutelist = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']

  const [hourOptions, setHourOptions] = React.useState([...hourList, ...hourList, ...hourList])
  const [minuteOptions, setMinuteOptions] = React.useState([...minutelist, ...minutelist, ...minutelist])

  const [meridiemIndex, setMeridiemIndex] = React.useState(0)
  const [hourIndex, setHourIndex] = React.useState(0)
  const [minuteIndex, setMinuteIndex] = React.useState(0)

  React.useEffect(() => {
    let totalMinute = value

    let meridie = 0
    const hour = Math.floor(totalMinute / 60)
    const minute = totalMinute % 60

    if (totalMinute >= 720) {
      meridie = 1
    }

    console.log('hour', hour)
    console.log('minute', minute)

    setMeridiemIndex(meridie)
    setHourIndex(hour + 12)
    setMinuteIndex(minute + 60)
  }, [])

  const handleHourStartReached = () => {
    setHourOptions([...hourList, ...hourOptions])
    hourWheelRef.current?.scrollToIndex(hourIndex + 12)
  }
  const handleMinuteStartReached = () => {
    setMinuteOptions([...minutelist, ...minuteOptions])
    minuteWheelRef.current?.scrollToIndex(minuteIndex + 60)
  }
  const handleHourEndReached = () => {
    setHourOptions([...hourOptions, ...hourList])
  }
  const handleMinuteEndReached = () => {
    setHourOptions([...minuteOptions, ...minutelist])
  }

  const handleMeridiemChanged = (index: number, activeName: string | null) => {
    setMeridiemIndex(index)

    if (activeName && activeName === 'meridiem') {
      let halfDay = 12

      if (index === 0) {
        halfDay *= -1
      }

      const changedHour = hourIndex + halfDay
      const changedMinute = minuteIndex + changedHour * 60
      console.log('changedMinute', changedMinute)
      hourWheelRef.current?.scrollToIndex(changedHour)
      // minuteWheelRef.current?.scrollToIndex(changedMinute)

      // let changedHourIndex = hourIndex + halfDay

      // if (changedHourIndex < 0) {
      //   changedHourIndex = 0
      // } else if (changedHourIndex > hourList.length) {
      //   changedHourIndex = hourList.length
      // }

      // hourWheelRef.current?.scrollToIndex(changedHourIndex)

      // const meridiemToMinute = index * 720
      const hourToMinute = hourIndex * 60
      const minute = minuteIndex % 60

      const result = hourToMinute + minute

      onChange(result)
    }
  }

  const handleHourChanged = (index: number, activeName: string | null) => {
    setHourIndex(index)

    if (index > 11) {
      meridiemWheelRef.current?.scrollToIndex(1)
    } else {
      meridiemWheelRef.current?.scrollToIndex(0)
    }

    if (activeName && activeName === 'hour') {
      const hourToMinute = index * 60
      const minute = minuteIndex % 60

      const result = hourToMinute + minute
      onChange(result)
    }
  }

  const handleMinuteChanged = (index: number) => {
    setMinuteIndex(index)

    const meridiem = meridiemIndex * 720
    const hour = hourIndex * 60
    const minute = index % 60

    const total = meridiem + hour + minute

    onChange(total)
  }

  return (
    <View style={styles.container}>
      <View style={styles.contents}>
        <WheelPicker
          name="meridiem"
          ref={meridiemWheelRef}
          selectedIndex={meridiemIndex}
          options={['오전', '오후']}
          visibleRest={visibleRest}
          containerStyle={styles.wheelContainer}
          selectedIndicatorStyle={[styles.wheelWrapper, styles.leftWheelWrapper]}
          itemTextStyle={styles.wheelItemText}
          onChange={handleMeridiemChanged}
        />
        <WheelPicker
          name="hour"
          ref={hourWheelRef}
          isInfinite={true}
          selectedIndex={hourIndex}
          options={hourOptions}
          visibleRest={visibleRest}
          containerStyle={styles.wheelContainer}
          selectedIndicatorStyle={styles.wheelWrapper}
          itemTextStyle={styles.wheelItemText}
          onStartReached={handleHourStartReached}
          onEndReached={handleHourEndReached}
          onChange={handleHourChanged}
        />
        <WheelPicker
          name="minute"
          ref={minuteWheelRef}
          isInfinite={true}
          selectedIndex={minuteIndex}
          options={minuteOptions}
          visibleRest={visibleRest}
          containerStyle={styles.wheelContainer}
          selectedIndicatorStyle={[styles.wheelWrapper, styles.rightWheelWrapper]}
          itemTextStyle={styles.wheelItemText}
          onStartReached={handleMinuteStartReached}
          onEndReached={handleMinuteEndReached}
          onChange={handleMinuteChanged}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between'
  },
  contents: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  wheelContainer: {
    flex: 1
  },
  wheelWrapper: {
    borderRadius: 0,
    backgroundColor: '#f5f6f8'
  },
  leftWheelWrapper: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  rightWheelWrapper: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  wheelItemText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: '#7c8698'
  }
})

export default TimeWheelPickerTemp
