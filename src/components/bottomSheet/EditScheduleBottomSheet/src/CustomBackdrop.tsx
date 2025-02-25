import {useMemo} from 'react'
import {StyleSheet, Image, Text, View} from 'react-native'
import Animated, {Extrapolation, interpolate, useAnimatedStyle} from 'react-native-reanimated'
import {getTimeOfMinute} from '@/utils/helper'
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet'
import {useRecoilValue} from 'recoil'
import {editScheduleTimeState} from '@/store/schedule'

interface Props {
  props: BottomSheetBackdropProps
  activeTheme: ActiveTheme
}
const CustomBackdrop = ({props, activeTheme}: Props) => {
  const editScheduleTime = useRecoilValue(editScheduleTimeState)

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: interpolate(props.animatedIndex.value, [-1, 0, 1], [250, 0, 250], Extrapolation.CLAMP)}]
    }
  }, [])

  const startTimeString = useMemo(() => {
    const timeOfMinute = getTimeOfMinute(editScheduleTime.start)

    return `${timeOfMinute.meridiem} ${timeOfMinute.hour}시 ${timeOfMinute.minute}분`
  }, [editScheduleTime.start])

  const endTimeString = useMemo(() => {
    const timeOfMinute = getTimeOfMinute(editScheduleTime.end)

    return `${timeOfMinute.meridiem} ${timeOfMinute.hour}시 ${timeOfMinute.minute}분`
  }, [editScheduleTime.end])

  return (
    <Animated.View style={[containerAnimatedStyle, styles.container, {backgroundColor: activeTheme.color5}]}>
      <View style={styles.wrapper}>
        <Image source={require('@/assets/icons/time.png')} style={styles.icon} />
        <Text style={[styles.text, {color: activeTheme.color3}]}>{startTimeString}</Text>
        <Text style={{color: activeTheme.color3}}>-</Text>
        <Text style={[styles.text, {color: activeTheme.color3}]}>{endTimeString}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: -10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10
  },
  wrapper: {
    paddingRight: 10,
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 16,
    height: 16
  },
  text: {
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold'
  }
})

export default CustomBackdrop
