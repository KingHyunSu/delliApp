import {StyleSheet, Modal, View, Pressable, Text} from 'react-native'

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
  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.container} onPress={onClose} />

      <View style={styles.wrapper}>
        {isShowScheduleCompleteRecordCard && (
          <Pressable style={styles.button} onPress={showScheduleCompleteRecordCard}>
            <Text style={styles.buttonText}>기록 카드 보기</Text>
          </Pressable>
        )}

        <Pressable style={styles.button} onPress={moveScheduleCompleteCardDetail}>
          <Text style={styles.buttonText}>상세 보기</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={moveAttachScheduleCompleteCard}>
          <Text style={styles.buttonText}>완료 카드 붙히기</Text>
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
    bottom: 365,
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
