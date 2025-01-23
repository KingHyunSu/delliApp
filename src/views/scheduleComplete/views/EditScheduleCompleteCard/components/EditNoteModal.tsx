import {useRef, useState, useMemo, useEffect, useCallback} from 'react'
import {Keyboard, StyleSheet, Modal, View, Pressable, Text, TextInput} from 'react-native'
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import CancelIcon from '@/assets/icons/cancle.svg'
import {useRecoilValue} from 'recoil'
import {safeAreaInsetsState, windowDimensionsState} from '@/store/system'

interface Props {
  visible: boolean
  value: string
  onChange: (value: string) => void
  onClose: () => void
}
const EditNoteModal = ({visible, value, onChange, onClose}: Props) => {
  const textInputRef = useRef<TextInput>(null)

  const [isScrolling, setIsScrolling] = useState(false)
  const [isInputMode, setIsInputMode] = useState(false)

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const width = useSharedValue(0)
  const height = useSharedValue(0)
  const paddingTop = useSharedValue(30)

  const wrapperAnimatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    paddingTop: paddingTop.value
  }))

  const isEditable = useMemo(() => {
    if (isInputMode) {
      return true
    }
    return !isScrolling
  }, [isInputMode, isScrolling])

  const pressTextInput = useCallback(() => {
    if (!isScrolling) {
      setIsInputMode(true)
    }
  }, [isScrolling])

  useEffect(() => {
    if (isInputMode) {
      textInputRef.current?.focus()

      width.value = withTiming(windowDimensions.width)
      height.value = withTiming(windowDimensions.height)
      paddingTop.value = withTiming(safeAreaInsets.top + 30)
    } else {
      Keyboard.dismiss()

      width.value = withTiming(windowDimensions.width - 32)
      height.value = withTiming(windowDimensions.height * 0.5)
      paddingTop.value = withTiming(30)
    }
  }, [isInputMode, windowDimensions.width, windowDimensions.height, safeAreaInsets.top])

  return (
    <Modal visible={visible} transparent>
      <View style={styles.overlay} />

      <Pressable style={styles.container} onPress={() => setIsInputMode(false)}>
        <Animated.View style={[styles.wrapper, wrapperAnimatedStyle]}>
          <Text style={styles.title}>기록</Text>

          <KeyboardAwareScrollView
            style={styles.textInputWrapper}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={50}
            onScrollBeginDrag={() => setIsScrolling(true)}
            onScrollEndDrag={() => setIsScrolling(false)}>
            <TextInput
              value={value}
              ref={textInputRef}
              style={styles.textInput}
              multiline
              editable={isEditable}
              scrollEnabled={false}
              placeholder="일정명을 입력해주세요"
              placeholderTextColor="#c3c5cc"
              onChangeText={onChange}
              onPress={pressTextInput}
            />
          </KeyboardAwareScrollView>

          <View style={styles.cancelButtonWrapper}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <CancelIcon stroke="#ffffff" strokeWidth={3} />
            </Pressable>
          </View>
        </Animated.View>
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
    backgroundColor: '#00000080'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  wrapper: {
    width: '100%',
    height: '50%',
    backgroundColor: '#ffffff',
    // borderRadius: 20,
    paddingTop: 30,
    paddingBottom: 20,
    gap: 20
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
    color: '#424242',
    paddingHorizontal: 20
  },
  textInputWrapper: {
    flex: 1
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 20
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
    backgroundColor: '#000000'
  }
})

export default EditNoteModal
