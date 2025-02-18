import {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {Keyboard, StyleSheet, Modal, TextInput, View, Pressable, Text, Image} from 'react-native'
import {DefaultColorList, FontList} from '@/components/decorate'
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated'
import CancelIcon from '@/assets/icons/cancle.svg'
import {useRecoilValue} from 'recoil'
import {safeAreaInsetsState} from '@/store/system'

type ActiveControlType = 'TEXT_COLOR' | 'FONT'
interface Props {
  visible: boolean
  value: ScheduleCompletePhotoCardText | null
  gestureSafeArea: number
  onChange: (value: ScheduleCompletePhotoCardText) => void
  onClose: () => void
}
const EditPhotoCardTextModal = ({visible, value, gestureSafeArea, onChange, onClose}: Props) => {
  const textInputRef = useRef<TextInput>(null)
  const [_value, _setValue] = useState<ScheduleCompletePhotoCardText | null>(null)
  const [activeControlType, setActiveControlType] = useState<ActiveControlType | null>(null)

  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const controlContentsHeight = useSharedValue(0)

  const controlContentsAnimatedStyle = useAnimatedStyle(() => ({
    height: controlContentsHeight.value
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
    return [styles.textInput, {color, fontFamily: _value?.font, padding: gestureSafeArea}]
  }, [_value, gestureSafeArea])

  const controlBarButtonStyle = useCallback(
    (type: ActiveControlType) => {
      const backgroundColor = type === activeControlType ? '#555555' : 'transparent'

      return [controlStyles.barButton, {backgroundColor}]
    },
    [activeControlType]
  )

  const handleShowModal = useCallback(() => {
    textInputRef.current?.blur()
    textInputRef.current?.focus()
  }, [])

  const pressWrapper = useCallback(() => {
    setActiveControlType(null)
  }, [])

  const pressControlTextColor = useCallback(() => {
    setActiveControlType('TEXT_COLOR')
    Keyboard.dismiss()
  }, [])

  const pressControlFont = useCallback(() => {
    setActiveControlType('FONT')
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

  const changeFont = useCallback((font: FontType) => {
    _setValue(prevState => {
      return prevState ? {...prevState, font} : prevState
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
      controlContentsHeight.value = withTiming(e.endCoordinates.height, {duration: e.duration})
    })

    const hideKeyboardSubscription = Keyboard.addListener('keyboardDidHide', e => {
      if (activeControlType === null) {
        controlContentsHeight.value = withTiming(0, {duration: e.duration})
      }
    })

    return () => {
      showKeyboardSubscription.remove()
      hideKeyboardSubscription.remove()
    }
  }, [activeControlType])

  useEffect(() => {
    if (!visible) {
      setActiveControlType(null)
    }
  }, [visible])

  const ControlContentsComponent = useMemo(() => {
    switch (activeControlType) {
      case 'TEXT_COLOR':
        return (
          <DefaultColorList
            value={_value?.textColor || null}
            contentContainerStyle={{paddingTop: 20, paddingBottom: safeAreaInsets.bottom + 20}}
            onChange={changeTextColor}
          />
        )
      case 'FONT':
        return <FontList value={_value?.font || null} onChange={changeFont} />
      default:
        return <></>
    }
  }, [_value, activeControlType, changeTextColor, changeFont, safeAreaInsets.bottom])

  return (
    <Modal visible={visible} transparent statusBarTranslucent onShow={handleShowModal}>
      <Pressable style={styles.overlay} />

      <View style={containerStyle}>
        <View style={styles.appBarContainer}>
          <Pressable style={[styles.appBarButton, {paddingLeft: 16}]} onPress={onClose}>
            <CancelIcon stroke="#ffffff" strokeWidth={3} />
          </Pressable>

          <Pressable style={[styles.appBarButton, {paddingRight: 16}]} onPress={handleChange}>
            <Text style={saveButtonTextStyle}>{value?.text ? '수정' : '추가'}</Text>
          </Pressable>
        </View>

        <Pressable style={styles.wrapper} onPress={pressWrapper}>
          {activeControlType ? (
            _value?.text ? (
              <Text style={textStyle}>{_value.text}</Text>
            ) : (
              <Text style={styles.emptyText}>텍스트 입력하기</Text>
            )
          ) : (
            <TextInput
              ref={textInputRef}
              style={textStyle}
              value={_value?.text}
              multiline
              autoFocus
              autoCapitalize="none"
              placeholder="텍스트 입력하기"
              placeholderTextColor="#c3c5cc"
              onChangeText={changeText}
            />
          )}
        </Pressable>

        <View style={controlStyles.bar}>
          <Pressable style={controlBarButtonStyle('TEXT_COLOR')} onPress={pressControlTextColor}>
            <Image source={require('@/assets/icons/color.png')} style={controlStyles.colorIcon} />
          </Pressable>

          <Pressable style={controlBarButtonStyle('FONT')} onPress={pressControlFont}>
            <Text style={controlStyles.fontIcon}>Aa</Text>
          </Pressable>
        </View>

        <Animated.View style={[controlContentsAnimatedStyle, controlStyles.container]}>
          {ControlContentsComponent}
        </Animated.View>
      </View>
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
    opacity: 0.7
  },
  container: {
    flex: 1
  },
  appBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 53
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
    alignItems: 'center',
    backgroundColor: '#ffffff30'
  },
  textInput: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
    padding: 0
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: '#c3c5cc',
    textAlign: 'center'
  }
})

const controlStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 59,
    backgroundColor: '#000000d0',
    paddingVertical: 7
  },
  barButton: {
    width: 65,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  colorIcon: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 12
  },
  fontIcon: {
    fontFamily: 'Pretendard-Medium',
    color: '#fff',
    fontSize: 22
  },
  container: {
    width: '100%',
    backgroundColor: '#333333',
    paddingHorizontal: 10
  }
})

export default EditPhotoCardTextModal
