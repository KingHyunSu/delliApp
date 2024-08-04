import React from 'react'
import {StyleSheet} from 'react-native'

import ColorPicker, {Panel1, Swatches, OpacitySlider, HueSlider, colorKit} from 'reanimated-color-picker'
import type {returnedResults} from 'reanimated-color-picker'
import {SharedValue} from 'react-native-reanimated'

interface Props {
  value: SharedValue<string>
  onChange: (color: returnedResults) => void
  onComplete: (color: returnedResults) => void
}
export default ({value, onChange, onComplete}: Props) => {
  const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex())

  return (
    <ColorPicker
      value={value.value}
      style={styles.container}
      sliderThickness={25}
      thumbSize={24}
      boundedThumb
      thumbShape="circle"
      thumbColor={'#fff'}
      onChange={onChange}
      onComplete={onComplete}>
      <Panel1 style={styles.panel} />
      <HueSlider style={styles.bar} />
      <OpacitySlider style={styles.bar} />

      {/*<Swatches colors={customSwatches} />*/}
    </ColorPicker>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 20
  },
  panel: {
    borderRadius: 0
  },
  bar: {
    marginHorizontal: 10,
    borderRadius: 20
  }
})
