import {useCallback, useEffect, useMemo} from 'react'
import {StyleSheet, Modal, Pressable, Text} from 'react-native'
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated'

import ThemeIcon from '@/assets/icons/theme.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'
import CancelIcon from '@/assets/icons/cancle.svg'

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

  const offset1 = useSharedValue(0)
  const offset2 = useSharedValue(0)

  const bottom = useMemo(() => {
    const bottomTabHeight = 56

    return 70 + bottomTabHeight + safeAreaInsets.bottom + translateY * -1
  }, [translateY, safeAreaInsets.bottom])

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{translateY: offset1.value}]
  }))

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{translateY: offset2.value}]
  }))

  const handleClose = useCallback(() => {
    offset1.value = withTiming(0)
    offset2.value = withTiming(0)
    onClose()
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
      offset1.value = withTiming(-67, {duration: 200})
      offset2.value = withTiming(-134, {duration: 200})
    }
  }, [visible])

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <Pressable style={styles.overlay} />

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

      <Animated.View style={[styles.fabWrapper, {bottom}]}>
        <Pressable style={ButtonStyle} onPress={handleClose}>
          <CancelIcon width={24} height={24} stroke="#ffffff" strokeWidth={2} />
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
    backgroundColor: '#000000',
    opacity: 0.8
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
