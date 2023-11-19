import React from 'react'
import {StyleSheet} from 'react-native'
import {BottomSheetBackdrop as Backdrop, BottomSheetBackgroundProps} from '@gorhom/bottom-sheet'

interface Props {
  props: BottomSheetBackgroundProps
  opacity?: number
  enableTouchThrough?: boolean
  pressBehavior?: 'none' | 'close' | 'collapse' | number
  onPress?: Function
}
const BottomSheetBackdrop = ({
  props,
  opacity = 0.5,
  enableTouchThrough = false,
  pressBehavior = 'close',
  onPress
}: Props) => {
  const handlePress = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <Backdrop
      {...props}
      opacity={opacity}
      enableTouchThrough={enableTouchThrough}
      pressBehavior={pressBehavior}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      onPress={handlePress}
      style={[styles.container, StyleSheet.absoluteFillObject]}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 1)'
  }
})

export default BottomSheetBackdrop
