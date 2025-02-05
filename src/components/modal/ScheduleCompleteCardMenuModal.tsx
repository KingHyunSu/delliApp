import {StyleSheet, Modal, View, Pressable, Text} from 'react-native'

interface Props {
  visible: boolean
  moveAttachScheduleCompleteCard: () => void
  moveScheduleCompleteCardDetail: () => void
  onClose: () => void
}
const ScheduleCompleteCardMenuModal = ({
  visible,
  moveAttachScheduleCompleteCard,
  moveScheduleCompleteCardDetail,
  onClose
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.container} onPress={onClose} />

      <View style={styles.wrapper}>
        <Pressable style={styles.button} onPress={moveAttachScheduleCompleteCard}>
          <Text style={styles.buttonText}>완료 카드 붙히기</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={moveScheduleCompleteCardDetail}>
          <Text style={styles.buttonText}>상세보기</Text>
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
