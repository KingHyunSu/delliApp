import React from 'react'
import {
  useWindowDimensions,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  View,
  Text,
  Pressable
} from 'react-native'

import DatePicker from '@/components/DatePicker'
import {RangeFlag} from '@/components/DatePicker/type'

interface Props {
  value: string | Array<string>
  range: boolean
  rangeFlag: RangeFlag
  isShow: boolean
  onClose: Function
  onChange: Function
}
const DatePickerBottomSheet = ({value, range, rangeFlag, isShow, onClose, onChange}: Props) => {
  const {height} = useWindowDimensions()
  const [selectDate, changeDate] = React.useState(value)

  const panY = React.useRef(new Animated.Value(height)).current

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1]
  })

  const openMoal = Animated.timing(panY, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true
  })

  const closeModal = Animated.timing(panY, {
    toValue: height,
    duration: 200,
    useNativeDriver: true
  })

  const handleClose = () => {
    closeModal.start(() => {
      onClose()
    })
  }

  React.useEffect(() => {
    if (isShow) {
      openMoal.start()
    } else {
      closeModal.start()
    }
  }, [isShow, openMoal, closeModal])

  const onChangeDate = (arg: string | string[]) => {
    if (arg) {
      changeDate(arg)
    } else {
      changeDate('9999-12-31')
    }
  }

  const confirm = () => {
    onChange(selectDate)
    handleClose()
  }

  return (
    <Modal visible={isShow} transparent>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>

        <Animated.View style={[{transform: [{translateY: translateY}]}, styles.container]}>
          <DatePicker value={value} range={range} rangeFlag={rangeFlag} onChange={onChangeDate} />

          <Pressable style={styles.confirmBtn} onPress={confirm}>
            <Text style={styles.confirmText}>확인</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  background: {
    flex: 1
  },
  container: {
    gap: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  confirmBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#2d8cec'
  },
  confirmText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  }
})

export default DatePickerBottomSheet
