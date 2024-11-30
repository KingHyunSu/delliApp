import {useCallback, useMemo} from 'react'
import {StyleSheet, Pressable, View, Text} from 'react-native'
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet'

import Animated, {Extrapolation, interpolate, useAnimatedStyle} from 'react-native-reanimated'
import {useRecoilState, useRecoilValue} from 'recoil'
import {safeAreaInsetsState} from '@/store/system'
import {colorToChangeState, scheduleState} from '@/store/schedule'

interface Props {
  props: BottomSheetBackdropProps
  activeCategoryTab: 'theme' | 'custom'
  activeTheme: ActiveTheme
  snapPoints: number[]
  onChangeCategoryTab: (type: CategoryTab) => void
  onClose: () => void
}
type CategoryTab = 'theme' | 'custom'
type ColorType = 'background' | 'font' | 'border'
const CustomBackdrop = ({props, activeCategoryTab, activeTheme, snapPoints, onChangeCategoryTab, onClose}: Props) => {
  const [colorToChange, setColorToChange] = useRecoilState(colorToChangeState)

  const schedule = useRecoilValue(scheduleState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(props.animatedIndex.value, [0, 1], [0, 1], Extrapolation.CLAMP)
  }))
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: interpolate(props.animatedIndex.value, [-1, 0], [-130, 0], Extrapolation.CLAMP)}]
  }))
  const colorTypeButtonWrapperAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(props.animatedIndex.value, [-1, 0], [0, 1], Extrapolation.CLAMP),
    bottom: interpolate(props.animatedIndex.value, [0, 1], [snapPoints[0], snapPoints[1]], Extrapolation.CLAMP)
  }))

  const categoryButtonStyle = useMemo(() => {
    return styles.categoryButton
  }, [])

  const getCategoryButtonTextStyle = useCallback(
    (type: CategoryTab) => {
      let color = activeTheme.color8

      if (activeCategoryTab === type) {
        color = activeTheme.color7
      }
      return [styles.categoryButtonText, {color}]
    },
    [activeTheme.color8, activeTheme.color7, activeCategoryTab]
  )

  const getColorTypeButtonStyle = useCallback(
    (type: ColorType) => {
      let backgroundColor = activeTheme.color2
      const borderColor = activeTheme.color6

      if (type === colorToChange) {
        backgroundColor = schedule.background_color
      }

      return [styles.colorTypeButton, {backgroundColor, borderColor}]
    },
    [colorToChange, activeTheme.color2, activeTheme.color6, schedule.background_color]
  )

  const getColorTypeButtonTextStyle = useCallback(
    (type: ColorType) => {
      let color = activeTheme.color3

      if (type === colorToChange) {
        color = schedule.text_color
      }

      return [styles.colorTypeButtonText, {color}]
    },
    [colorToChange, activeTheme.color3, schedule.text_color]
  )

  const changeCategoryTab = useCallback(
    (tab: CategoryTab) => () => {
      onChangeCategoryTab(tab)
    },
    [onChangeCategoryTab]
  )

  const changeColorType = useCallback(
    (type: ColorType) => () => {
      setColorToChange(type)
    },
    [setColorToChange]
  )

  return (
    <View style={props.style}>
      <Animated.View style={[backgroundAnimatedStyle, styles.overlay, {backgroundColor: '#00000050'}]} />
      <Pressable style={styles.overlay} onPress={onClose} />

      <Animated.View style={[headerAnimatedStyle, {backgroundColor: activeTheme.color5}]}>
        <View style={[styles.categoryButtonWrapper, {paddingTop: safeAreaInsets.top + 10}]}>
          <Pressable style={categoryButtonStyle} onPress={changeCategoryTab('custom')}>
            <Text style={getCategoryButtonTextStyle('custom')}>직접 지정</Text>
          </Pressable>

          <Pressable style={categoryButtonStyle} onPress={changeCategoryTab('theme')}>
            <Text style={getCategoryButtonTextStyle('theme')}>테마</Text>
          </Pressable>
        </View>
      </Animated.View>

      {activeCategoryTab === 'custom' && (
        <Animated.View style={[colorTypeButtonWrapperAnimatedStyle, styles.colorTypeButtonWrapper]}>
          <Pressable style={getColorTypeButtonStyle('background')} onPress={changeColorType('background')}>
            <Text style={getColorTypeButtonTextStyle('background')}>배경색</Text>
          </Pressable>

          <Pressable style={getColorTypeButtonStyle('font')} onPress={changeColorType('font')}>
            <Text style={getColorTypeButtonTextStyle('font')}>글자색</Text>
          </Pressable>
          {/*<Pressable style={getButtonStyle('border')} onPress={changeColorType('border')}>*/}
          {/*  <Text style={getButtonTextStyle('border')}>테투리색</Text>*/}
          {/*</Pressable>*/}
        </Animated.View>
      )}
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
  categoryButtonWrapper: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingLeft: 10
  },
  categoryButton: {
    height: 42,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20
  },

  colorTypeButtonWrapper: {
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 16,
    paddingVertical: 10
  },
  colorTypeButton: {
    height: 42,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  },
  colorTypeButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14
  }
})

export default CustomBackdrop
