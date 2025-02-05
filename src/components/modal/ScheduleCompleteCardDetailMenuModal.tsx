import {StyleSheet, Modal, View, Pressable, Text} from 'react-native'
import {useRecoilValue} from 'recoil'
import {safeAreaInsetsState} from '@/store/system'
import {useMemo} from 'react'

interface Props {
  visible: boolean
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}
const ScheduleCompleteCardDetailMenuModal = ({visible, onEdit, onDelete, onClose}: Props) => {
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const wrapperStyle = useMemo(() => {
    return [styles.wrapper, {top: safeAreaInsets.top + 45}]
  }, [safeAreaInsets.top])

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.container} onPress={onClose} />

      <View style={wrapperStyle}>
        <Pressable style={styles.button} onPress={onEdit}>
          <Text style={styles.buttonText}>다시 만들기</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={onDelete}>
          <Text style={[styles.buttonText, {color: '#ff4160'}]}>삭제하기</Text>
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
    right: 10,
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

export default ScheduleCompleteCardDetailMenuModal
