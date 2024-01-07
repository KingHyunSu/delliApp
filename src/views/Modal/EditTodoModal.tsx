import React from 'react'
import {useWindowDimensions, StyleSheet, Modal, SafeAreaView, Pressable, View, Text, TextInput} from 'react-native'
import Switch from '@/components/Swtich'

import Animated, {runOnJS, useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'

import {useRecoilState} from 'recoil'
import {showEditTodoModalState} from '@/store/modal'

const EditTodoModal = () => {
  const {height} = useWindowDimensions()
  const containerHeight = height * 0.65

  const [isRepeat, setIsRepeat] = React.useState(false)

  const [showEditTodoModal, setShowEditTodoModal] = useRecoilState(showEditTodoModalState)

  const translateY = useSharedValue(containerHeight * -1)
  const opacity = useSharedValue(0)

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}]
  }))
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const handleClose = () => {
    opacity.value = withTiming(0)

    translateY.value = withTiming(containerHeight * -1, {duration: 300}, isFinish => {
      if (isFinish) {
        runOnJS(setShowEditTodoModal)(false)
      }
    })
  }

  React.useEffect(() => {
    if (showEditTodoModal) {
      opacity.value = withTiming(1)
      translateY.value = withTiming(0)
    }
  }, [showEditTodoModal])

  return (
    <Modal visible={showEditTodoModal} transparent statusBarTranslucent>
      <Animated.View style={[overlayAnimatedStyle, styles.background]}>
        <Pressable style={styles.overlay} onPress={handleClose} />
      </Animated.View>

      <Animated.View style={[containerAnimatedStyle, styles.container, {height: containerHeight}]}>
        <SafeAreaView>
          <View style={styles.wrapper}>
            <View style={styles.formContainer}>
              <TextInput style={styles.title} placeholder="할 일을 입력해주세요" placeholderTextColor="#c3c5cc" />

              <View>
                <View style={styles.repeatContainer}>
                  <Text style={styles.repeatHeaderLabel}>반복</Text>

                  <Switch value={isRepeat} onChange={() => setIsRepeat(!isRepeat)} />
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable style={[styles.button, styles.closeButton]} onPress={handleClose}>
                <Text style={styles.buttonText}>닫기</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.editButton]}>
                <Text style={styles.buttonText}>추가하기</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
    height: '100%',
    justifyContent: 'space-between'
  },
  overlay: {
    flex: 1
  },
  formContainer: {
    gap: 30
  },
  title: {
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
    color: '#424242',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },
  repeatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  repeatHeaderLabel: {
    fontSize: 16,
    fontFamily: 'Pretendard-Light',
    color: '#424242'
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 10
  },
  button: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#bababa'
  },
  editButton: {
    flex: 2,
    backgroundColor: '#1E90FF'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#fff'
  }
})

export default EditTodoModal
