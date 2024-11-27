import {useRef, useState, useCallback, useEffect} from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import {BottomSheetBackdropProps, BottomSheetHandleProps, BottomSheetModal} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import DatePicker from '@/components/DatePicker'

import {useRecoilState, useRecoilValue} from 'recoil'
import {showDatePickerBottomSheetState} from '@/store/bottomSheet'
import {activeThemeState} from '@/store/system'
import type {Refs as DatePickerRef} from '@/components/DatePicker'

interface Props {
  value: string | null
  onChange: Function
}
const DatePickerBottomSheet = ({value, onChange}: Props) => {
  const datePickerBottomSheetRef = useRef<BottomSheetModal>(null)
  const datePickerRef = useRef<DatePickerRef>(null)

  const [selectDate, changeDate] = useState(value)

  const [showDatePickerBottomSheet, setShowDatePickerBottomSheet] = useRecoilState(showDatePickerBottomSheetState)
  const activeTheme = useRecoilValue(activeThemeState)

  const onDismiss = useCallback(() => {
    setShowDatePickerBottomSheet(false)
  }, [setShowDatePickerBottomSheet])

  useEffect(() => {
    changeDate(value)
  }, [value])

  useEffect(() => {
    if (showDatePickerBottomSheet) {
      datePickerBottomSheetRef.current?.present()
    } else {
      datePickerBottomSheetRef.current?.dismiss()
    }
  }, [showDatePickerBottomSheet])

  const onChangeDate = useCallback(
    (arg: string) => {
      if (arg) {
        changeDate(arg)
      }
    },
    [changeDate]
  )

  const changeToday = useCallback(() => {
    datePickerRef.current?.today()
  }, [])

  const confirm = useCallback(() => {
    onChange(selectDate)
    onDismiss()
  }, [selectDate, onChange, onDismiss])

  // components
  const bottomSheetBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const bottomSheetHandler = useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={1}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  return (
    <BottomSheetModal
      name="datePicker"
      ref={datePickerBottomSheetRef}
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      backdropComponent={bottomSheetBackdrop}
      handleComponent={bottomSheetHandler}
      index={0}
      snapPoints={[500]}
      onDismiss={onDismiss}>
      <View style={styles.container}>
        <DatePicker ref={datePickerRef} value={selectDate} onChange={onChangeDate} />

        <View style={styles.buttonWrapper}>
          <Pressable
            style={[styles.button, styles.todayButton, {backgroundColor: activeTheme.color2}]}
            onPress={changeToday}>
            <Text style={[styles.text, {color: activeTheme.color3}]}>오늘</Text>
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
    flex: 1
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#1E90FF'
  },
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#ffffff'
  }
})

export default DatePickerBottomSheet
