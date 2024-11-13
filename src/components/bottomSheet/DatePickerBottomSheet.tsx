import React, {useMemo} from 'react'
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
  const datePickerBottomSheetRef = React.useRef<BottomSheetModal>(null)
  const datePickerRef = React.useRef<DatePickerRef>(null)

  const [selectDate, changeDate] = React.useState(value)

  const [showDatePickerBottomSheet, setShowDatePickerBottomSheet] = useRecoilState(showDatePickerBottomSheetState)
  const activeTheme = useRecoilValue(activeThemeState)

  const bottomSheetBackgroundColor = useMemo(() => {
    return activeTheme.theme_id === 1 ? '#ffffff' : activeTheme.color6
  }, [activeTheme.theme_id, activeTheme.color6])

  const onDismiss = () => {
    setShowDatePickerBottomSheet(false)
  }

  React.useEffect(() => {
    changeDate(value)
  }, [value])

  React.useEffect(() => {
    if (showDatePickerBottomSheet) {
      datePickerBottomSheetRef.current?.present()
    } else {
      datePickerBottomSheetRef.current?.dismiss()
    }
  }, [showDatePickerBottomSheet])

  const onChangeDate = (arg: string) => {
    if (arg) {
      changeDate(arg)
    }
  }

  const changeToday = () => {
    datePickerRef.current?.today()
  }

  const confirm = () => {
    onChange(selectDate)
    onDismiss()
  }

  // components
  const bottomSheetBackdrop = React.useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const bottomSheetHandler = React.useCallback((props: BottomSheetHandleProps) => {
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
      backgroundStyle={{backgroundColor: bottomSheetBackgroundColor}}
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
