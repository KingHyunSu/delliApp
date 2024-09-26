import {useMemo, useCallback} from 'react'
import {StyleSheet, Modal, View, Text, Pressable} from 'react-native'
import {useRecoilState} from 'recoil'
import {alertState} from '@/store/system'

const Alert = () => {
  const [alertInfo, setAlertInfo] = useRecoilState(alertState)

  const confirmButtonStyle = useMemo(() => {
    let backgroundColor = '#1E90FF'

    if (alertInfo?.type === 'danger') {
      backgroundColor = '#ff4160'
    }
    return [styles.button, {backgroundColor}]
  }, [alertInfo?.type])

  const handleCancel = useCallback(() => {
    if (alertInfo && alertInfo.cancelFn !== undefined) {
      alertInfo.cancelFn()
    }

    setAlertInfo(null)
  }, [alertInfo, setAlertInfo])

  const handleConfirm = useCallback(() => {
    if (alertInfo && alertInfo.confirmFn !== undefined) {
      alertInfo.confirmFn()
    }

    setAlertInfo(null)
  }, [alertInfo, setAlertInfo])

  if (alertInfo) {
    return (
      <Modal visible={!!alertInfo} transparent onRequestClose={handleCancel}>
        <View style={styles.container}>
          <View style={styles.box}>
            {alertInfo.title !== undefined && <Text style={styles.title}>{alertInfo.title}</Text>}

            {alertInfo.desc !== undefined && <Text style={styles.desc}>{alertInfo.desc}</Text>}

            <View style={styles.buttonContainer}>
              <Pressable style={cancelButtonStyle} onPress={handleCancel}>
                <Text style={cancelButtonTextStyle}>{alertInfo.cancelButtonText || '취소'}</Text>
              </Pressable>

              <Pressable style={confirmButtonStyle} onPress={handleConfirm}>
                <Text style={confirmButtonTextStyle}>{alertInfo.confirmButtonText || '확인'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return <></>
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
    gap: 20
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
    flexDirection: 'row',
    gap: 10
  },
  button: {
    flex: 1,
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

const cancelButtonStyle = StyleSheet.compose(styles.button, {backgroundColor: '#efefef'})
const cancelButtonTextStyle = StyleSheet.compose(styles.buttonText, {color: '#6B727E'})
const confirmButton = StyleSheet.compose(styles.button, {backgroundColor: 'blue'})
const confirmButtonTextStyle = StyleSheet.compose(styles.buttonText, {color: '#ffffff'})

export default Alert
