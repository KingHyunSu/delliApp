import {useCallback, useMemo, useEffect} from 'react'
import {StyleSheet, Modal} from 'react-native'
import MonthPicker, {EventTypes} from 'react-native-month-year-picker'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'

interface Props {
  visible: boolean
  value: Date
  onChange: (value: Date) => void
  onClose: () => void
}
const YearMonthPickerModal = ({visible, value, onChange, onClose}: Props) => {
  const opacity = useSharedValue(0)

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const overlayStyle = useMemo(() => {
    return [styles.overlay, overlayAnimatedStyle]
  }, [])

  const changeDate = useCallback(
    (event: EventTypes, newDate: Date) => {
      if (event === 'dateSetAction') {
        onChange(newDate)
      }

      onClose()
    },
    [onChange, onClose]
  )

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1)
    } else {
      opacity.value = 0
    }
  }, [visible])

  return (
    <Modal visible={visible} transparent={true}>
      <Animated.View style={overlayStyle} />

      <MonthPicker value={value} locale={'ko'} okButton="확인" cancelButton="취소" onChange={changeDate} />
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000050'
  }
})

export default YearMonthPickerModal
