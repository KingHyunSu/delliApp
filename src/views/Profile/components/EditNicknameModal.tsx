import {useState, useMemo, useCallback, useEffect} from 'react'
import {Platform, StyleSheet, Modal, KeyboardAvoidingView, View, Text, TextInput, Pressable} from 'react-native'
import {useRecoilValue} from 'recoil'
import {safeAreaInsetsState} from '@/store/system'

interface Props {
  visible: boolean
  value: string
  onChange: (value: string) => void
  onClose: () => void
}
const EditNicknameModal = ({visible, value, onChange, onClose}: Props) => {
  const [_value, _setValue] = useState('')

  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const containerStyle = useMemo(() => {
    return [styles.container, {paddingTop: safeAreaInsets.top}]
  }, [safeAreaInsets.top])

  const changeValue = useCallback(() => {
    onChange(_value)
    onClose()
  }, [_value, onChange, onClose])

  useEffect(() => {
    _setValue(value)
  }, [value])

  return (
    <Modal visible={visible} transparent>
      <View style={styles.overlay} />

      <View style={containerStyle}>
        <View style={styles.appBarContainer}>
          <Pressable style={[styles.appBarButton, {paddingLeft: 16}]} onPress={onClose}>
            <Text style={styles.appBarButtonText}>취소</Text>
          </Pressable>

          <Pressable style={[styles.appBarButton, {paddingRight: 16}]} onPress={changeValue}>
            <Text style={styles.appBarButtonText}>저장</Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.wrapper}>
          <View>
            <TextInput value={_value} style={styles.textInput} autoFocus maxLength={20} onChangeText={_setValue} />
            <Text style={styles.textCountText}>{_value.length} / 10</Text>
          </View>
        </KeyboardAvoidingView>
      </View>
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
    opacity: 0.85
  },
  container: {
    flex: 1
  },
  appBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 48
  },
  appBarButton: {
    width: 48,
    height: '100%',
    justifyContent: 'center'
  },
  appBarButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#fff'
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  textInput: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#484747',
    paddingVertical: 15
  },
  textCountText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#fff',
    paddingTop: 15
  }
})

export default EditNicknameModal
