import {StyleSheet, Modal, View, Text, Pressable} from 'react-native'

interface Props {
  visible: boolean
  onMove: () => void
  onClose: () => void
}
const SuccessModal = ({visible, onMove, onClose}: Props) => {
  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.title}>구입 완료</Text>

          <Text style={styles.desc}>내 테마에서 바로 사용할 수 있어요</Text>

          <View style={styles.buttonContainer}>
            <Pressable style={moveButtonStyle} onPress={onMove}>
              <Text style={moveButtonTextStyle}>내 테마 바로가기</Text>
            </Pressable>

            <Pressable style={cancelButtonStyle} onPress={onClose}>
              <Text style={cancelButtonTextStyle}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 20,
    gap: 20,
    alignItems: 'center'
  },
  title: {
    marginTop: 5,
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#424242',
    paddingHorizontal: 5
  },
  desc: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#424242',
    paddingHorizontal: 5
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
    marginTop: 10
  },
  button: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#424242'
  }
})

const moveButtonStyle = StyleSheet.compose(styles.button, {backgroundColor: '#1E90FF'})
const moveButtonTextStyle = StyleSheet.compose(styles.buttonText, {color: '#ffffff'})
const cancelButtonStyle = StyleSheet.compose(styles.button, {backgroundColor: '#efefef'})
const cancelButtonTextStyle = StyleSheet.compose(styles.buttonText, {color: '#6B727E'})

export default SuccessModal
