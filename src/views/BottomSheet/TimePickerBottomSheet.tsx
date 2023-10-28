import React from 'react'
import {StyleSheet, View} from 'react-native'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import WheelPicker from 'react-native-wheely'

import {useSetRecoilState} from 'recoil'
import {activeStartTimeControllerState, activeEndTimeControllerState} from '@/store/schedule'

import {getTimeOfMinute} from '@/utils/helper'
import {RANGE_FLAG} from '@/utils/types'

const hourList = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
// prettier-ignore
const minuteList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']

interface Props {
  value: number[]
  isShow: boolean
  rangeFlag: RANGE_FLAG
  onClose: Function
  onChange: Function
}
const TimePickerBottomSheet = ({value = [0, 0], rangeFlag, isShow, onClose, onChange}: Props) => {
  const setActiveStartTimeController = useSetRecoilState(activeStartTimeControllerState)
  const setActiveEndTimeController = useSetRecoilState(activeEndTimeControllerState)

  const datePickerBottomSheetRef = React.useRef<BottomSheetModal>(null)
  const snapPoints = [240]

  const [meridiemIndex, setMeridiemIndex] = React.useState(0)
  const [hourIndex, setHourIndex] = React.useState(0)
  const [minuteIndex, setMinuteIndex] = React.useState(0)

  const timeInfo = React.useMemo(() => {
    let result = getTimeOfMinute(0)

    if (rangeFlag === RANGE_FLAG.START) {
      result = getTimeOfMinute(value[0])
    } else if (rangeFlag === RANGE_FLAG.END) {
      result = getTimeOfMinute(value[1])
    }

    return {
      meridiem: result.meridiem === '오전' ? 0 : 1,
      hour: result.hour,
      minute: Number(result.minute)
    }
  }, [value, rangeFlag])

  React.useEffect(() => {
    setMeridiemIndex(timeInfo.meridiem)
    setHourIndex(timeInfo.hour - 1)
    setMinuteIndex(timeInfo.minute)
  }, [timeInfo])

  React.useEffect(() => {
    if (isShow) {
      datePickerBottomSheetRef.current?.present()
    } else {
      datePickerBottomSheetRef.current?.dismiss()
    }
  }, [isShow])

  const changeMeridiem = (index: number) => {
    const meridiemToMinute = index === 0 ? 0 : 720
    const hourToMinute = timeInfo.hour * 60
    const result = meridiemToMinute + hourToMinute + timeInfo.minute

    onChange(result)
  }

  const changeHour = (index: number) => {
    const meridiemToMinute = timeInfo.meridiem === 0 ? 0 : 720
    const hourToMinute = Number(hourList[index]) * 60
    const result = meridiemToMinute + hourToMinute + timeInfo.minute

    onChange(result)
  }

  const changeMinute = (index: number) => {
    const meridiemToMinute = timeInfo.meridiem === 0 ? 0 : 720
    const hourToMinute = timeInfo.hour * 60
    const result = meridiemToMinute + hourToMinute + index

    onChange(result)
  }

  const handleBackdropPress = () => {
    setActiveStartTimeController(false)
    setActiveEndTimeController(false)
  }

  return (
    <BottomSheetModal
      name="datePicker"
      ref={datePickerBottomSheetRef}
      backdropComponent={props => {
        return <BottomSheetBackdrop props={props} onPress={handleBackdropPress} />
      }}
      index={0}
      snapPoints={snapPoints}
      onDismiss={() => onClose()}>
      <View style={styles.container}>
        <View style={styles.contents}>
          <WheelPicker
            selectedIndex={meridiemIndex}
            options={['오전', '오후']}
            visibleRest={2}
            containerStyle={styles.wheelContainer}
            selectedIndicatorStyle={[styles.wheelWrapper, styles.leftWheelWrapper]}
            itemTextStyle={styles.wheelItemText}
            onChange={index => changeMeridiem(index)}
          />
          <WheelPicker
            selectedIndex={hourIndex}
            options={hourList}
            visibleRest={2}
            containerStyle={styles.wheelContainer}
            selectedIndicatorStyle={styles.wheelWrapper}
            itemTextStyle={styles.wheelItemText}
            onChange={index => changeHour(index)}
          />
          <WheelPicker
            selectedIndex={minuteIndex}
            options={minuteList}
            visibleRest={2}
            containerStyle={styles.wheelContainer}
            selectedIndicatorStyle={[styles.wheelWrapper, styles.rightWheelWrapper]}
            itemTextStyle={styles.wheelItemText}
            onChange={index => changeMinute(index)}
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
    marginTop: 20,
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
