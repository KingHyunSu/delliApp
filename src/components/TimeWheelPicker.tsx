import React from 'react'
import {StyleSheet, View} from 'react-native'
// import WheelPicker, {WheelPickerRefs} from '@/components/WheelPicker'
import WheelPicker from 'react-native-wheely'

interface Props {
  initValue: number
  visibleRest?: number
  onChange: Function
}
const TimeWheelPicker = ({initValue, visibleRest = 2, onChange}: Props) => {
  // prettier-ignore
  const hourList = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
  // prettier-ignore
  const minuteList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']

  const [meridiemIndex, setMeridiemIndex] = React.useState(-1)
  const [hourIndex, setHourIndex] = React.useState(-1)
  const [minuteIndex, setMinuteIndex] = React.useState(-1)

  const isShow = React.useMemo(() => {
    return meridiemIndex > -1 && hourIndex > -1 && minuteIndex > -1
  }, [meridiemIndex, hourIndex, minuteIndex])

  const handleMeridiemChanged = (index: number) => {
    setMeridiemIndex(index)

    const hourToMinute = (hourIndex + index * 12) * 60
    const result = hourToMinute + minuteIndex

    onChange(result)
  }

  const handleHourChanged = (index: number) => {
    setHourIndex(index)

    const hourToMinute = (index + meridiemIndex * 12) * 60
    const result = hourToMinute + minuteIndex

    onChange(result)
  }

  const handleMinuteChanged = (index: number) => {
    setMinuteIndex(index)

    const hourToMinute = (hourIndex + meridiemIndex * 12) * 60
    const result = hourToMinute + index

    onChange(result)
  }

  React.useEffect(() => {
    let totalMinute = initValue

    let meridie = 0
    let hour = Math.floor(totalMinute / 60)
    const minute = totalMinute % 60

    if (totalMinute > 720) {
      meridie = 1
      hour -= 12
    }

    setMeridiemIndex(meridie)
    setHourIndex(hour)
    setMinuteIndex(minute)
  }, [initValue])

  return (
    <View style={styles.container}>
      {isShow && (
        <View style={styles.contents}>
          <WheelPicker
            options={['오전', '오후']}
            selectedIndex={meridiemIndex}
            visibleRest={visibleRest}
            containerStyle={styles.wheelContainer}
            selectedIndicatorStyle={[styles.wheelWrapper, styles.leftWheelWrapper]}
            itemTextStyle={styles.wheelItemText}
            onChange={handleMeridiemChanged}
          />
          <WheelPicker
            options={hourList}
            selectedIndex={hourIndex}
            visibleRest={visibleRest}
            containerStyle={styles.wheelContainer}
            selectedIndicatorStyle={styles.wheelWrapper}
            itemTextStyle={styles.wheelItemText}
            onChange={handleHourChanged}
          />
          <WheelPicker
            options={minuteList}
            selectedIndex={minuteIndex}
            visibleRest={visibleRest}
            containerStyle={styles.wheelContainer}
            selectedIndicatorStyle={[styles.wheelWrapper, styles.rightWheelWrapper]}
            itemTextStyle={styles.wheelItemText}
            onChange={handleMinuteChanged}
          />
        </View>
      )}
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
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 16,
    color: '#7c8698'
  }
})

export default TimeWheelPicker
