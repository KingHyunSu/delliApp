import {useCallback, useMemo} from 'react'
import {StyleSheet, Pressable, Text, View, ScrollView} from 'react-native'
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet'
import {Shadow} from 'react-native-shadow-2'

import Animated, {Extrapolation, interpolate, useAnimatedStyle, useDerivedValue} from 'react-native-reanimated'
import {useRecoilState, useRecoilValue} from 'recoil'
import {safeAreaInsetsState} from '@/store/system'
import {colorToChangeState, scheduleState} from '@/store/schedule'

interface Props {
  props: BottomSheetBackdropProps
  activeTheme: ActiveTheme
  onClose: () => void
}
type ColorType = 'background' | 'font' | 'border'
const CustomBackdrop = ({props, activeTheme, onClose}: Props) => {
  const [colorToChange, setColorToChange] = useRecoilState(colorToChangeState)

  const schedule = useRecoilValue(scheduleState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const transformOriginY = useDerivedValue(() =>
    interpolate(props.animatedIndex.value, [-1, 0], [-100, 0], Extrapolation.CLAMP)
  )

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: transformOriginY.value}]
  }))

  const shadowColor = useMemo(() => {
    return activeTheme.theme_id === 1 ? '#f0eff586' : activeTheme.color6
  }, [activeTheme.theme_id, activeTheme.color6])

  const getButtonStyle = useCallback(
    (type: ColorType) => {
      let backgroundColor = activeTheme.color2
      const borderColor = activeTheme.color6

      if (type === colorToChange) {
        backgroundColor = schedule.background_color
      }

      return [styles.button, {backgroundColor, borderColor}]
    },
    [colorToChange, activeTheme.color2, activeTheme.color6, schedule.background_color]
  )

  const getButtonTextStyle = useCallback(
    (type: ColorType) => {
      let color = activeTheme.color3

      if (type === colorToChange) {
        color = schedule.text_color
      }

      return [styles.buttonText, {color}]
    },
    [colorToChange, activeTheme.color3, schedule.text_color]
  )

  const changeColorType = useCallback(
    (type: ColorType) => () => {
      setColorToChange(type)
    },
    [setColorToChange]
  )

  return (
    <View style={props.style}>
      <Pressable style={styles.overlay} onPress={onClose} />

      <Animated.View style={containerAnimatedStyle}>
        <Shadow style={{backgroundColor: activeTheme.color5}} stretch={true} startColor={shadowColor} distance={10}>
          <ScrollView
            contentContainerStyle={[styles.buttonWrapper, {paddingTop: safeAreaInsets.top + 10}]}
            horizontal={true}>
            <Pressable style={getButtonStyle('background')} onPress={changeColorType('background')}>
              <Text style={getButtonTextStyle('background')}>배경색</Text>
            </Pressable>
            <Pressable style={getButtonStyle('font')} onPress={changeColorType('font')}>
              <Text style={getButtonTextStyle('font')}>글자색</Text>
            </Pressable>
            {/*<Pressable style={getButtonStyle('border')} onPress={changeColorType('border')}>*/}
            {/*  <Text style={getButtonTextStyle('border')}>테투리색</Text>*/}
            {/*</Pressable>*/}
          </ScrollView>
        </Shadow>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  buttonWrapper: {
    paddingHorizontal: 16,

    paddingBottom: 15,
    gap: 10
  },
  button: {
    height: 42,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 2
  },
  buttonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16
  }
})

export default CustomBackdrop
