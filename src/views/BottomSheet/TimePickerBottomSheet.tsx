import React from 'react'
import {StyleSheet, View} from 'react-native'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import WheelPicker from 'react-native-wheely'
import TimeWheelPicker, {TimeWheelPickerRefs} from '@/components/TimeWheelPicker'

import {useRecoilState} from 'recoil'
import {showTimePickerBototmSheetState} from '@/store/bottomSheet'
import {activeTimeFlagState} from '@/store/schedule'

import {getTimeOfMinute} from '@/utils/helper'
import {RANGE_FLAG} from '@/utils/types'

interface Props {
  value: number[]
  onChange: Function
}
const TimePickerBottomSheet = ({value = [0, 0], onChange}: Props) => {
  const meridiemWheelRef = React.useRef<TimeWheelPickerRefs>(null)
  const hourWheelRef = React.useRef<TimeWheelPickerRefs>(null)

  const [isShow, setIsShow] = useRecoilState(showTimePickerBototmSheetState)
  const [activeTimeFlag, setActiveTimeFlag] = useRecoilState(activeTimeFlagState)

  const datePickerBottomSheetRef = React.useRef<BottomSheetModal>(null)

  const [meridiemIndex, setMeridiemIndex] = React.useState(0)
  const [hourIndex, setHourIndex] = React.useState(0)
  const [minuteIndex, setMinuteIndex] = React.useState(0)

  const hourList = React.useMemo(() => {
    const list = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
    const result = []

    for (let i = 0; i < 2; i++) {
      result.push(...list)
    }

    return result
  }, [])

  const minuteList = React.useMemo(() => {
    // prettier-ignore
    const list = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
    const result = []

    for (let i = 0; i < 24; i++) {
      result.push(...list)
    }

    return result
  }, [])

  // const timeInfo = React.useMemo(() => {
  //   let result = getTimeOfMinute(value[0])

  //   if (activeTimeFlag === RANGE_FLAG.END) {
  //     result = getTimeOfMinute(value[1])
  //   }

  //   console.log('result', result)

  //   return {
  //     meridiem: result.meridiem === '오전' ? 0 : 1,
  //     hour: result.hour,
  //     minute: Number(result.minute)
  //   }
  // }, [value, activeTimeFlag])

  React.useEffect(() => {
    let result = getTimeOfMinute(value[0])

    if (activeTimeFlag === RANGE_FLAG.END) {
      result = getTimeOfMinute(value[1])
    }

    console.log('useEffect result', result)

    const meridiem = result.meridiem === '오전' ? 0 : 1
    let hour = result.hour
    if (meridiem === 0) {
      if (hour === 12) {
        hour = 0
      }
    } else if (meridiem === 1) {
      hour += 12
    }
    // console.log('hour', hour)
    const minute = Number(result.minute)

    if (meridiemIndex !== meridiem) {
      meridiemWheelRef.current?.scrollToIndex(meridiem)
    }
    if (hourIndex !== hour) {
      hourWheelRef.current?.scrollToIndex(hour)
    }

    // setMeridiemIndex(result.meridiem === '오전' ? 0 : 1)
    // setHourIndex(result.hour)
    // setMinuteIndex(Number(result.minute))
  }, [value, activeTimeFlag, meridiemWheelRef.current])

  // React.useEffect(() => {
  //   console.log('timeInfo', timeInfo)
  //   setMeridiemIndex(timeInfo.meridiem)
  //   setHourIndex(timeInfo.hour)
  //   setMinuteIndex(timeInfo.minute)
  // }, [timeInfo])

  React.useEffect(() => {
    if (isShow) {
      datePickerBottomSheetRef.current?.present()
    } else {
      datePickerBottomSheetRef.current?.dismiss()
    }
  }, [isShow])

  const handleDismiss = () => {
    setIsShow(false)
  }

  // const handleChanged = () => {
  //   console.log('hourIndex', hourIndex)
  //   const meridiemToMinute = meridiemIndex === 0 ? 0 : 720
  //   const hourToMinute = hourIndex * 60
  //   const minute = minuteIndex % 60

  //   const result = meridiemToMinute + hourToMinute + minute
  //   console.log('result', result)
  //   onChange(result)
  // }

  const handleMeridiemChanged = (index: number) => {
    console.log('handleMeridiemChanged', index)
    setMeridiemIndex(index)

    let halfDay = 12

    if (index === 0) {
      halfDay *= -1
    }

    let changedHourIndex = hourIndex + halfDay

    // if (changedHourIndex < 0) {
    //   changedHourIndex = 0
    // } else if (changedHourIndex > hourList.length) {
    //   changedHourIndex = hourList.length
    // }

    // hourWheelRef.current?.scrollToIndex(changedHourIndex)

    const meridiemToMinute = index * 720
    const hourToMinute = changedHourIndex * 60
    const minute = minuteIndex % 60

    const result = meridiemToMinute + hourToMinute + minute

    onChange(result)
  }

  const handleHourChanged = (index: number) => {
    setHourIndex(index)

    // if (index < 12) {
    //   meridiemWheelRef.current?.scrollToIndex(0)
    // } else {
    //   meridiemWheelRef.current?.scrollToIndex(1)
    // }

    console.log('index', index)
    // const meridiemToMinute = meridiemIndex * 720
    // const hourToMinute = index * 60
    // const minute = minuteIndex % 60

    // const result = meridiemToMinute + hourToMinute + minute
    // console.log('result', result)
    // onChange(result)
  }

  const handleMinuteChanged = (index: number) => {
    setMinuteIndex(index)

    // const hour = Math.floor(index / 60)

    // if (hourIndex !== hour) {
    //   setHourIndex(hour)
    // }

    // // const minute = index % 60
    // // changeMinute(minute)
    // handleChanged()
  }

  // const changeMeridiem = (index: number) => {
  //   const meridiemToMinute = index === 0 ? 0 : 720
  //   const hourToMinute = hourIndex * 60
  //   const result = meridiemToMinute + hourToMinute + timeInfo.minute

  //   onChange(result)
  // }

  // const changeHour = (index: number) => {
  //   const meridiemToMinute = timeInfo.meridiem === 0 ? 0 : 720
  //   let hourToMinute = Number(hourList[index]) * 60

  //   if (timeInfo.meridiem === 0) {
  //     hourToMinute = 0
  //   }

  //   console.log('hourToMinute', hourToMinute)
  //   const result = meridiemToMinute + hourToMinute + timeInfo.minute

  //   onChange(result)
  // }

  // const changeMinute = (index: number) => {
  //   const meridiemToMinute = timeInfo.meridiem === 0 ? 0 : 720
  //   const hourToMinute = timeInfo.hour * 60
  //   const result = meridiemToMinute + hourToMinute + index

  //   onChange(result)
  // }

  const handleBackdropPress = () => {
    setActiveTimeFlag(null)
  }

  return (
    <BottomSheetModal
      name="datePicker"
      enableContentPanningGesture={false}
      ref={datePickerBottomSheetRef}
      backdropComponent={props => {
        return <BottomSheetBackdrop props={props} onPress={handleBackdropPress} />
      }}
      index={0}
      snapPoints={['35%']}
      onDismiss={handleDismiss}>
      <View style={styles.container}>
        <View style={styles.contents}>
          <TimeWheelPicker
            ref={meridiemWheelRef}
            selectedIndex={meridiemIndex}
            options={['오전', '오후']}
            visibleRest={2}
            containerStyle={styles.wheelContainer}
            selectedIndicatorStyle={[styles.wheelWrapper, styles.leftWheelWrapper]}
            itemTextStyle={styles.wheelItemText}
            onChange={index => handleMeridiemChanged(index)}
          />
          <TimeWheelPicker
            ref={hourWheelRef}
            selectedIndex={hourIndex}
            options={hourList}
            visibleRest={2}
            containerStyle={styles.wheelContainer}
            selectedIndicatorStyle={styles.wheelWrapper}
            itemTextStyle={styles.wheelItemText}
            onChange={index => handleHourChanged(index)}
          />
          <TimeWheelPicker
            selectedIndex={minuteIndex}
            options={minuteList}
            visibleRest={2}
            containerStyle={styles.wheelContainer}
            selectedIndicatorStyle={[styles.wheelWrapper, styles.rightWheelWrapper]}
            itemTextStyle={styles.wheelItemText}
            onChange={handleMinuteChanged}
          />
        </View>
      </View>
    </BottomSheetModal>
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

export default TimePickerBottomSheet
