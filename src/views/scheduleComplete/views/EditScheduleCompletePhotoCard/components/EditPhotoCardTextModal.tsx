import {useState, useMemo, useCallback, useEffect} from 'react'
import {Keyboard, StyleSheet, Modal, TextInput, View, Pressable, Text, Image} from 'react-native'
import {DefaultColorList} from '@/components/decorate'
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated'
import CancelIcon from '@/assets/icons/cancle.svg'
import {useRecoilValue} from 'recoil'
import {safeAreaInsetsState} from '@/store/system'

interface Props {
  visible: boolean
  value: ScheduleCompletePhotoCardText | null
  gestureSafeArea: number
  onChange: (value: ScheduleCompletePhotoCardText) => void
  onClose: () => void
}
const EditPhotoCardTextModal = ({visible, value, gestureSafeArea, onChange, onClose}: Props) => {
  const [_value, _setValue] = useState<ScheduleCompletePhotoCardText | null>(null)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [activeControl, setActiveControl] = useState(false)

  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const textInputOpacity = useSharedValue(0)

  const textInputAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textInputOpacity.value
  }))

  const containerStyle = useMemo(() => {
    return [styles.container, {paddingTop: safeAreaInsets.top}]
  }, [safeAreaInsets.top])

  const saveButtonTextStyle = useMemo(() => {
    const color = _value ? '#ffffff' : '#777777'
    return [styles.appBarButtonText, {color}]
  }, [_value])

  const textStyle = useMemo(() => {
    const color = _value ? _value.textColor : '#000000'
    return [styles.textInput, {color, padding: gestureSafeArea}]
  }, [_value, gestureSafeArea])

  const pressControlTextColor = useCallback(() => {
    setActiveControl(true)
    Keyboard.dismiss()
  }, [])

  const changeText = useCallback((text: string) => {
    _setValue(prevState => {
      return prevState ? {...prevState, text} : prevState
    })
  }, [])

  const changeTextColor = useCallback((color: string) => {
    _setValue(prevState => {
      return prevState ? {...prevState, textColor: color} : prevState
    })
  }, [])

  const handleChange = useCallback(() => {
    if (!_value) return

    onChange(_value)
  }, [_value, onChange])

  useEffect(() => {
    if (value) {
      _setValue(value)
    }
  }, [value])

  useEffect(() => {
    const showKeyboardSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height)
      textInputOpacity.value = withTiming(1)
    })

    return () => {
      showKeyboardSubscription.remove()
    }
  }, [])

  useEffect(() => {
    if (!visible) {
      setActiveControl(false)
    }
  }, [visible])

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} />

      <Pressable style={containerStyle}>
        <View style={styles.appBarContainer}>
          <Pressable style={[styles.appBarButton, {paddingLeft: 16}]} onPress={onClose}>
            <CancelIcon stroke="#ffffff" strokeWidth={3} />
          </Pressable>

          <Pressable style={[styles.appBarButton, {paddingRight: 16}]} onPress={handleChange}>
            <Text style={saveButtonTextStyle}>{value === null ? '추가' : '수정'}</Text>
          </Pressable>
        </View>

        <View style={styles.wrapper}>
          <Animated.View style={textInputAnimatedStyle}>
            {activeControl ? (
              <Pressable onPress={() => setActiveControl(false)}>
                {_value?.text ? (
                  <Text style={textStyle}>{_value.text}</Text>
                ) : (
                  <Text style={styles.emptyText}>텍스트 입력하기</Text>
                )}
              </Pressable>
            ) : (
              <TextInput
                style={textStyle}
                value={_value?.text}
                placeholder="텍스트 입력하기"
                placeholderTextColor="#c3c5cc"
                autoFocus
                multiline
                onChangeText={changeText}
              />
            )}
          </Animated.View>
        </View>

        <View style={controlStyles.bar}>
          <Pressable style={controlStyles.barButton} onPress={pressControlTextColor}>
            <Image source={require('@/assets/icons/color.png')} style={controlStyles.colorIcon} />
          </Pressable>
        </View>

        <View style={[controlStyles.container, {height: keyboardHeight}]}>
          <DefaultColorList
            value={_value?.textColor || null}
            contentContainerStyle={{paddingTop: 20, paddingBottom: safeAreaInsets.bottom + 20}}
            onChange={changeTextColor}
          />
        </View>
      </Pressable>
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
    backgroundColor: '#000000',
    opacity: 0.85
  },
  container: {
    flex: 1
  },
  appBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 48
  },
  appBarButton: {
    width: 48,
    height: '100%',
    justifyContent: 'center'
  },
  appBarButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#ffffff'
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    fontSize: 24,
    fontFamily: 'Pretendard-Medium',
    padding: 0
  },
  emptyText: {
    fontSize: 24,
    fontFamily: 'Pretendard-Medium',
    color: '#c3c5cc'
  }
})

const controlStyles = StyleSheet.create({
  bar: {
    width: '100%',
    height: 52,
    backgroundColor: '#00000080',
    alignItems: 'center'
  },
  barButton: {
    width: 52,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorIcon: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 12
  },
  container: {
    width: '100%',
    backgroundColor: '#333333',
    paddingHorizontal: 10
  }
})

export default EditPhotoCardTextModal
