import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import DatePicker from '@/components/DatePicker'

import {format} from 'date-fns'

import {RANGE_FLAG} from '@/utils/types'

interface Props {
  value: string | string[]
  isShow: boolean
  range?: boolean
  rangeFlag?: RANGE_FLAG
  onChangeRangeFlag?: Function
  onClose: Function
  onChange: Function
}
const DatePickerBottomSheet = ({
  value,
  isShow,
  range = false,
  rangeFlag = 1,
  onChangeRangeFlag,
  onClose,
  onChange
}: Props) => {
  const datePickerBottomSheetRef = React.useRef<BottomSheetModal>(null)
  const snapPoints = React.useMemo(() => [range ? 580 : 500], [range])

  const [selectDate, changeDate] = React.useState(value)

  const onDismiss = () => {
    onClose()
  }

  React.useEffect(() => {
    changeDate(value)
  }, [value])

  React.useEffect(() => {
    if (isShow) {
      datePickerBottomSheetRef.current?.present()
    } else {
      datePickerBottomSheetRef.current?.dismiss()
    }
  }, [isShow])

  const onChangeDate = (arg: string) => {
    if (arg) {
      changeDate(arg)
    }
  }

  const changeToday = () => {
    const today = format(new Date(), 'yyyy-MM-dd')

    if (range) {
      if (rangeFlag === RANGE_FLAG.START) {
        changeDate([today, selectDate[1]])
      } else if (rangeFlag === RANGE_FLAG.END) {
        changeDate([selectDate[0], today])
      }
    } else {
      changeDate(today)
    }
  }

  const confirm = () => {
    onChange(selectDate)
    onDismiss()
  }

  return (
    <BottomSheetModal
      name="datePicker"
      ref={datePickerBottomSheetRef}
      backdropComponent={props => {
        return <BottomSheetBackdrop props={props} />
      }}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}>
      <View style={styles.container}>
        <DatePicker
          value={selectDate}
          range={range}
          flag={rangeFlag}
          onChangeFlag={onChangeRangeFlag}
          onChange={onChangeDate}
        />

        <View style={styles.buttonWrapper}>
          <Pressable style={[styles.button, styles.todayButton]} onPress={changeToday}>
            <Text style={styles.text}>오늘</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.confirmButton]} onPress={confirm}>
            <Text style={styles.text}>확인</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40
  },
  buttonWrapper: {
    flexDirection: 'row',
    gap: 10
  },
  button: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  todayButton: {
    flex: 1,
    backgroundColor: '#7c8698'
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#2d8cec'
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#fff'
  }
})

export default DatePickerBottomSheet
