import {useMemo} from 'react'
import {StyleSheet, Modal, View, Pressable, Text} from 'react-native'
import {useRecoilValue} from 'recoil'
import {activeThemeState, safeAreaInsetsState} from '@/store/system'

interface Props {
  visible: boolean
  isShowScheduleCompleteRecordCard: boolean
  showScheduleCompleteRecordCard: () => void
  moveScheduleCompleteCardDetail: () => void
  moveAttachScheduleCompleteCard: () => void
  onClose: () => void
}
const ScheduleCompleteCardMenuModal = ({
  visible,
  isShowScheduleCompleteRecordCard,
  showScheduleCompleteRecordCard,
  moveScheduleCompleteCardDetail,
  moveAttachScheduleCompleteCard,
  onClose
}: Props) => {
  const activeTheme = useRecoilValue(activeThemeState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const buttonTextStyle = useMemo(() => {
    return [styles.buttonText, {color: activeTheme.color3}]
  }, [activeTheme.color3])

  const wrapperStyle = useMemo(() => {
    const bottom = 330 + safeAreaInsets.bottom
    return [styles.wrapper, {bottom, backgroundColor: activeTheme.color5}]
  }, [safeAreaInsets.bottom])

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.container} onPress={onClose} />

      <View style={wrapperStyle}>
        {isShowScheduleCompleteRecordCard && (
          <Pressable style={styles.button} onPress={showScheduleCompleteRecordCard}>
            <Text style={buttonTextStyle}>기록 카드 보기</Text>
          </Pressable>
        )}

        <Pressable style={styles.button} onPress={moveScheduleCompleteCardDetail}>
          <Text style={buttonTextStyle}>상세 보기</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={moveAttachScheduleCompleteCard}>
          <Text style={buttonTextStyle}>완료 카드 붙히기</Text>
        </Pressable>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000090'
  },
  wrapper: {
    position: 'absolute',
    right: 16,
    width: 150,
    backgroundColor: '#ffffff',
    borderRadius: 10
  },
  button: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14
  }
})

export default ScheduleCompleteCardMenuModal
