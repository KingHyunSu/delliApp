import {useCallback} from 'react'
import {StyleSheet, Pressable} from 'react-native'

import Animated, {useDerivedValue, withTiming, useAnimatedStyle, interpolateColor} from 'react-native-reanimated'

interface Props {
  value: boolean
  readonly?: boolean
  onChange?: (value: boolean) => void
}
const Switch = ({value = false, readonly = false, onChange}: Props) => {
  const duration = 200
  const precess = useDerivedValue(() => {
    return withTiming(value ? 1 : 0, {duration})
  })

  const translateXByPrecess = useDerivedValue(() => {
    return withTiming(value ? 22 : 0, {duration})
  })

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(precess.value, [0, 1], ['#eeeded', '#1E90FF'])
    return {backgroundColor}
  })

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateXByPrecess.value}]
    }
  })

  const change = useCallback(() => {
    if (!readonly && onChange) {
      onChange(!value)
    }
  }, [readonly, onChange, value])

  return (
    <Animated.View style={[backgroundStyle, styles.container]}>
      <Pressable style={styles.wrapper} onPress={change}>
        <Animated.View style={[translateStyle, styles.circle]} />
      </Pressable>
    </Animated.View>
  )
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 14
  },
  wrapper: {
    width: 50,
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff'
  }
})

export default Switch
