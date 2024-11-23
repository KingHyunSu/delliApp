import {useCallback, useEffect, useMemo} from 'react'
import {StyleSheet, Modal, Pressable, Text} from 'react-native'
import Animated, {useSharedValue, useAnimatedStyle, withTiming, runOnJS} from 'react-native-reanimated'

import ThemeIcon from '@/assets/icons/theme.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'
import PlusIcon from '@/assets/icons/plus.svg'

import {safeAreaInsetsState} from '@/store/system'
import {useRecoilValue} from 'recoil'

interface Props {
  visible: boolean
  translateY: number
  moveMyThemeList: () => void
  moveEditSchedule: () => void
  onClose: () => void
}
const HomeFabExtensionModal = ({visible, translateY, moveMyThemeList, moveEditSchedule, onClose}: Props) => {
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const rotate = useSharedValue(0)
  const fabOffset1 = useSharedValue(0)
  const fabOffset2 = useSharedValue(0)
  const fabOpacity1 = useSharedValue(0)
  const fabOpacity2 = useSharedValue(0)
  const overlayOpacity = useSharedValue(0)

  const bottom = useMemo(() => {
    const bottomTabHeight = 56

    return 70 + bottomTabHeight + safeAreaInsets.bottom + translateY * -1
  }, [translateY, safeAreaInsets.bottom])

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotate.value}deg`}]
  }))

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: fabOpacity1.value,
    transform: [{translateY: fabOffset1.value}]
  }))

  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: fabOpacity2.value,
    transform: [{translateY: fabOffset2.value}]
  }))

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value
  }))

  const handleClose = useCallback(() => {
    rotate.value = withTiming(0, {duration: 150}, () => {
      runOnJS(onClose)()
    })

    overlayOpacity.value = withTiming(0)
    fabOffset1.value = withTiming(0)
    fabOffset2.value = withTiming(0)
    fabOpacity1.value = withTiming(0, {duration: 200})
    fabOpacity2.value = withTiming(0, {duration: 200})
  }, [onClose])

  const handleMoveMyThemeList = useCallback(() => {
    moveMyThemeList()
    onClose()
  }, [onClose, moveMyThemeList])

  const handleMoveEditSchedule = useCallback(() => {
    moveEditSchedule()
    onClose()
  }, [onClose, moveEditSchedule])

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(0.8, {duration: 200})
      rotate.value = withTiming(45, {duration: 200})
      fabOffset1.value = withTiming(-67, {duration: 200})
      fabOffset2.value = withTiming(-134, {duration: 200})
      fabOpacity1.value = withTiming(1, {duration: 200})
      fabOpacity2.value = withTiming(1, {duration: 200})
    }

    return () => {
      if (visible) {
        overlayOpacity.value = 0
        rotate.value = 0
        fabOffset1.value = 0
        fabOffset2.value = 0
        fabOpacity1.value = 0
        fabOpacity2.value = 0
      }
    }
  }, [visible])

  return (
    <Modal visible={visible} transparent={true}>
      <Animated.View style={[styles.overlay, animatedOverlayStyle]} />

      <Animated.View style={[styles.fabWrapper, animatedStyle3, {bottom}]}>
        <Text style={styles.fabText}>테마</Text>

        <Pressable style={themeButtonStyle} onPress={handleMoveMyThemeList}>
          <ThemeIcon width={24} height={24} fill="#424242" />
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.fabWrapper, animatedStyle2, {bottom}]}>
        <Text style={styles.fabText}>일정</Text>

        <Pressable style={themeButtonStyle} onPress={handleMoveEditSchedule}>
          <ScheduleIcon width={24} height={24} fill="#424242" />
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.fabWrapper, animatedStyle1, {bottom}]}>
        <Pressable style={ButtonStyle} onPress={handleClose}>
          <PlusIcon stroke="#ffffff" strokeWidth={3} />
        </Pressable>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000'
  },
  fabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 15,
    position: 'absolute',
    right: 20
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green'
  },
  fabText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#ffffff'
  }
})

const themeButtonStyle = StyleSheet.compose(styles.fab, {backgroundColor: '#ffffff'})
const ButtonStyle = StyleSheet.compose(styles.fab, {backgroundColor: '#424242'})

export default HomeFabExtensionModal
