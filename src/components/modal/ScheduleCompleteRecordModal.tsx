import {useRef, useState, useMemo, useEffect, useCallback} from 'react'
import {Keyboard, Platform, StyleSheet, Modal, View, Pressable, Text, TextInput} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated'
import CancelIcon from '@/assets/icons/cancle.svg'
import {useRecoilValue} from 'recoil'
import {activeThemeState, safeAreaInsetsState, windowDimensionsState} from '@/store/system'

interface Props {
  visible: boolean
  value: string
  readonly?: boolean
  onChange?: (value: string) => void
  onClose: () => void
}
const EditNoteModal = ({visible, value, readonly, onChange, onClose}: Props) => {
  const textInputRef = useRef<TextInput>(null)

  const [_value, _setIsValue] = useState('')
  const [isScrolling, setIsScrolling] = useState(false)
  const [isInputMode, setIsInputMode] = useState(false)

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)
  const activeTheme = useRecoilValue(activeThemeState)

  const width = useSharedValue(0)
  const height = useSharedValue(0)

  const wrapperAnimatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value
  }))

  const isEditable = useMemo(() => {
    if (readonly) {
      return false
    }
    if (isInputMode) {
      return true
    }
    return !isScrolling
  }, [readonly, isInputMode, isScrolling])

  const pressTextInput = useCallback(() => {
    if (readonly) return

    if (!isScrolling) {
      setIsInputMode(true)
    }
  }, [isScrolling, readonly])

  const blurTextInput = useCallback(() => {
    if (isInputMode) {
      return
    }
  }, [isInputMode])

  const handleClose = useCallback(() => {
    _setIsValue(value)
    setIsInputMode(false)
  }, [value])

  const handleSave = useCallback(() => {
    if (onChange) {
      onChange(_value)
      setIsInputMode(false)
    }
  }, [_value, onChange])

  useEffect(() => {
    const fullHeight =
      Platform.OS === 'android' ? windowDimensions.height + safeAreaInsets.top : windowDimensions.height

    if (isInputMode) {
      textInputRef.current?.focus()

      width.value = withTiming(windowDimensions.width)
      height.value = withTiming(fullHeight)
    } else {
      Keyboard.dismiss()

      width.value = withTiming(windowDimensions.width - 32)
      height.value = withTiming(fullHeight * 0.6)
    }
  }, [isInputMode, safeAreaInsets.top, windowDimensions.width, windowDimensions.height])

  useEffect(() => {
    _setIsValue(value)
  }, [value])

  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Animated.View style={[styles.wrapper, wrapperAnimatedStyle]}>
          {/* app bar */}
          {isInputMode && (
            <View style={{paddingTop: safeAreaInsets.top, backgroundColor: '#202023'}}>
              <View style={styles.appBarWrapper}>
                <Pressable style={styles.closeButton} onPress={handleClose}>
                  <CancelIcon stroke={activeTheme.color3} strokeWidth={3} />
                </Pressable>

                <Pressable style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>저장</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.titleWrapper}>
            <Text style={styles.title}>기록</Text>
          </View>

          <KeyboardAwareScrollView
            enableOnAndroid
            style={styles.textInputWrapper}
            contentContainerStyle={isInputMode && styles.textInputWrapper}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={0}
            onScrollBeginDrag={() => setIsScrolling(true)}
            onScrollEndDrag={() => setIsScrolling(false)}>
            <TextInput
              value={_value}
              ref={textInputRef}
              style={styles.textInput}
              multiline
              editable={isEditable}
              scrollEnabled={false}
              autoCapitalize="none"
              placeholder="기록을 입력해 주세요"
              placeholderTextColor="#c3c5cc"
              onChangeText={_setIsValue}
              onPress={pressTextInput}
              onBlur={blurTextInput}
            />
          </KeyboardAwareScrollView>

          <View style={styles.cancelButtonWrapper}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <CancelIcon stroke="#ffffff" strokeWidth={3} />
            </Pressable>
          </View>
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
    opacity: 0.8
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  wrapper: {
    backgroundColor: '#ffffff'
  },
  appBarWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52
  },
  closeButton: {
    width: 52,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 16
  },
  titleWrapper: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingVertical: 20
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
    color: '#424242',
    paddingHorizontal: 20
  },
  textInputWrapper: {
    flex: 1,
    paddingBottom: 10
  },
  textInput: {
    fontSize: 16,
    paddingTop: 0,
    paddingHorizontal: 20
  },
  saveButton: {
    width: 52,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16
  },
  saveButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#1E90FF'
  },
  cancelButtonWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: -76,
    alignItems: 'center'
  },
  cancelButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6B727E'
  }
})

export default EditNoteModal
