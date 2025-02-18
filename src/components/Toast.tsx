import {useMemo, useEffect} from 'react'
import {StyleSheet, Text} from 'react-native'
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'

import {useRecoilState, useRecoilValue} from 'recoil'
import {toastState, safeAreaInsetsState} from '@/store/system'

const Toast = () => {
  const [toast, setToast] = useRecoilState(toastState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (toast.visible) {
      scale.value = withTiming(1, {duration: 150})
      opacity.value = withTiming(1, {duration: 250})

      const timer = setTimeout(() => {
        opacity.value = withTiming(0, {duration: 300}, () => {
          scale.value = 0
          runOnJS(setToast)({
            visible: false,
            message: ''
          })
        })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [toast.visible])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
      opacity: opacity.value
    }
  })

  const containerStyle = useMemo(() => {
    return [animatedStyle, styles.container, {top: safeAreaInsets.top}]
  }, [safeAreaInsets.top])

  if (!toast.visible) {
    return <></>
  }

  return (
    <Animated.View style={containerStyle}>
      <Text style={styles.text}>{toast.message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#2a2b2e', // #242729
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    zIndex: 1000
  },
  text: {
    color: '#fff',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14
  }
})

export default Toast
