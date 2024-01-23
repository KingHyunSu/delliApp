import React from 'react'
import {StyleSheet, View} from 'react-native'
import WheelPicker from '@/components/WheelPicker'

type FlexAlignType = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'

interface Props {
  initValue: number | null
  visibleRest?: number
  align?: FlexAlignType
  onChange: Function
}

const meridiemList = ['오전', '오후']
// prettier-ignore
const hourList = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
// prettier-ignore
const minuteList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']

const TimeWheelPicker = React.memo(({initValue, visibleRest = 2, align = 'flex-start', onChange}: Props) => {
  const meridiemRef = React.useRef<TimeWheelRefs>(null)
  const hourRef = React.useRef<TimeWheelRefs>(null)
  const minuteRef = React.useRef<TimeWheelRefs>(null)

  const [meridiemIndex, setMeridiemIndex] = React.useState(0)
  const [hourIndex, setHourIndex] = React.useState(0)
  const [minuteIndex, setMinuteIndex] = React.useState(0)

  const containerStyle = React.useMemo(() => {
    return [styles.container, {alignItems: align}]
  }, [align])

  const handleMeridiemChanged = React.useCallback(
    (index: number) => {
      setMeridiemIndex(index)

      const hourToMinute = (hourIndex + index * 12) * 60
      const result = hourToMinute + minuteIndex

      onChange(result)
    },
    [hourIndex, minuteIndex, onChange]
  )

  const handleHourChanged = React.useCallback(
    (index: number) => {
      setHourIndex(index)

      const hourToMinute = (index + meridiemIndex * 12) * 60
      const result = hourToMinute + minuteIndex

      onChange(result)
    },
    [meridiemIndex, minuteIndex, onChange]
  )

  const handleMinuteChanged = React.useCallback(
    (index: number) => {
      setMinuteIndex(index)

      const hourToMinute = (hourIndex + meridiemIndex * 12) * 60
      const result = hourToMinute + index

      onChange(result)
    },
    [hourIndex, meridiemIndex, onChange]
  )

  React.useEffect(() => {
    if (initValue) {
      let meridie = 0
      let hour = Math.floor(initValue / 60)
      const minute = initValue % 60

      if (initValue >= 720) {
        meridie = 1
        hour -= 12
      }

      meridiemRef.current?.scrollToIndex(meridie)
      hourRef.current?.scrollToIndex(hour)
      minuteRef.current?.scrollToIndex(minute)
    }
  }, [initValue])

  return (
    <View style={containerStyle}>
      <WheelPicker
        ref={meridiemRef}
        options={meridiemList}
        selectedIndex={meridiemIndex}
        visibleRest={visibleRest}
        containerStyle={styles.wheelContainer}
        selectedIndicatorStyle={leftWheelWrapperStyle}
        itemTextStyle={styles.wheelItemText}
        onChange={handleMeridiemChanged}
      />
      <WheelPicker
        ref={hourRef}
        options={hourList}
        selectedIndex={hourIndex}
        visibleRest={visibleRest}
        containerStyle={styles.wheelContainer}
        selectedIndicatorStyle={styles.wheelWrapper}
        itemTextStyle={styles.wheelItemText}
        onChange={handleHourChanged}
      />
      <WheelPicker
        ref={minuteRef}
        options={minuteList}
        selectedIndex={minuteIndex}
        visibleRest={visibleRest}
        containerStyle={styles.wheelContainer}
        selectedIndicatorStyle={rightWheelWrapperStyle}
        itemTextStyle={styles.wheelItemText}
        onChange={handleMinuteChanged}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
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

const leftWheelWrapperStyle = StyleSheet.compose(styles.wheelWrapper, styles.leftWheelWrapper)
const rightWheelWrapperStyle = StyleSheet.compose(styles.wheelWrapper, styles.rightWheelWrapper)

export default TimeWheelPicker
