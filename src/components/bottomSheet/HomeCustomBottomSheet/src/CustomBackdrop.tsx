import {StyleSheet, Pressable} from 'react-native'
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet'
import Animated, {Extrapolation, interpolate, useAnimatedStyle} from 'react-native-reanimated'

interface Props {
  props: BottomSheetBackdropProps
  onClose: () => void
}
const CustomBackdrop = ({props, onClose}: Props) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(props.animatedIndex.value, [-1, 0], [0, 1], Extrapolation.CLAMP)
  }))

  return (
    <Pressable style={styles.container} onPress={onClose}>
      <Animated.View style={[containerAnimatedStyle, styles.overlay]} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 200
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000070'
  }
})

export default CustomBackdrop
