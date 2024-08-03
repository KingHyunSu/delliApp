import React from 'react'
import {StyleSheet, View} from 'react-native'

import ColorPicker, {Panel1, Swatches, OpacitySlider, HueSlider, colorKit, PreviewText} from 'reanimated-color-picker'
import type {returnedResults} from 'reanimated-color-picker'
import {useSharedValue} from 'react-native-reanimated'

interface Props {
  value: string
  onChange: (color: returnedResults) => void
}
export default ({value, onChange}: Props) => {
  const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex())

  const selectedColor = useSharedValue('#ffffff')

  const onColorSelect = React.useCallback(
    (color: returnedResults) => {
      onChange(color)
      // selectedColor.value = color.hex
    },
    [onChange]
  )

  // React.useEffect(() => {
  //   selectedColor.value = value
  // }, [value])

  return (
    <ColorPicker
      value={value}
      sliderThickness={25}
      thumbSize={24}
      thumbShape="circle"
      onChange={onChange}
      boundedThumb
      thumbColor={'#fff'}
      style={styles.container}>
      <Panel1 style={styles.panel} />
      <HueSlider style={styles.bar} />
      <OpacitySlider style={styles.bar} />
    </ColorPicker>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 20
  },
  panel: {
    borderRadius: 0
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    //
    // elevation: 5
  },
  bar: {
    marginHorizontal: 10,
    borderRadius: 20
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    //
    // elevation: 5
  }
})
