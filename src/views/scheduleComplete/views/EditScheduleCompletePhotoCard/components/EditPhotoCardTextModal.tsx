import {useState, useMemo, useCallback, useEffect} from 'react'
import {Platform, StyleSheet, Modal, KeyboardAvoidingView, TextInput, View, Pressable, Text} from 'react-native'
import CancelIcon from '@/assets/icons/cancle.svg'
import {useRecoilValue} from 'recoil'
import {safeAreaInsetsState} from '@/store/system'

interface Props {
  visible: boolean
  value: string | null
  onChange: (value: string) => void
  onClose: () => void
}
const EditPhotoCardTextModal = ({visible, value, onChange, onClose}: Props) => {
  const [_value, _setValue] = useState('')

  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const containerStyle = useMemo(() => {
    return [styles.container, {paddingTop: safeAreaInsets.top}]
  }, [safeAreaInsets.top])

  const saveButtonTextStyle = useMemo(() => {
    const color = _value ? '#ffffff' : '#777777'
    return [styles.appBarButtonText, {color}]
  }, [_value])

  const handleChange = useCallback(() => {
    if (!_value) return

    onChange(_value)
    onClose()
  }, [_value, onChange, onClose])

  useEffect(() => {
    _setValue(value || '')
  }, [value])

  return (
    <Modal visible={visible} transparent>
      <View style={styles.overlay} />

      <View style={containerStyle}>
        <View style={styles.appBarContainer}>
          <Pressable style={[styles.appBarButton, {paddingLeft: 16}]} onPress={onClose}>
            <CancelIcon stroke="#ffffff" strokeWidth={3} />
          </Pressable>

          <Pressable style={[styles.appBarButton, {paddingRight: 16}]} onPress={handleChange}>
            <Text style={saveButtonTextStyle}>{value === null ? '추가' : '수정'}</Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.wrapper}>
          <TextInput
            style={styles.textInput}
            value={_value}
            placeholder="텍스트 입력하기"
            placeholderTextColor="#c3c5cc"
            autoFocus
            multiline
            onChangeText={_setValue}
            onBlur={() => {
              return
            }}
          />
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
    color: '#ffffff'
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  textInput: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#fff'
  }
})

export default EditPhotoCardTextModal
