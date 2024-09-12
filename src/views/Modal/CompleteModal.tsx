import React from 'react'
import {StyleSheet, Modal, Text} from 'react-native'
import LottieView from 'lottie-react-native'
import {useRecoilState} from 'recoil'
import {showCompleteModalState} from '@/store/modal'
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'

const CompleteModal = () => {
  const [showCompleteModal, setShowCompleteModal] = useRecoilState(showCompleteModalState)

  const opacity = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const containerStyle = React.useMemo(() => {
    return [styles.container, animatedStyle]
  }, [])

  React.useEffect(() => {
    if (showCompleteModal) {
      opacity.value = 1

      setTimeout(() => {
        opacity.value = withTiming(0, {duration: 300}, () => {
          runOnJS(setShowCompleteModal)(false)
        })
      }, 1000)
    }
  }, [showCompleteModal])

  return (
    <Modal visible={showCompleteModal}>
      <Animated.View style={containerStyle}>
        <LottieView source={require('@/assets/lottie/congrats.json')} style={styles.lottie} autoPlay loop={false} />
        <Text style={styles.text}>잘했어요</Text>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  lottie: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  text: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    color: '#000000'
  }
})

export default CompleteModal
