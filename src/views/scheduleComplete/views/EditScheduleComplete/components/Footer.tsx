import {StyleSheet, Pressable, Text} from 'react-native'
import {BottomSheetFooter, BottomSheetFooterProps} from '@gorhom/bottom-sheet'

interface Props {
  props: BottomSheetFooterProps
  onSubmit: () => void
}
const EditScheduleCompleteFooter = ({props, onSubmit}: Props) => {
  return (
    <BottomSheetFooter {...props}>
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>저장하기</Text>
      </Pressable>
    </BottomSheetFooter>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#ffffff'
  }
})

export default EditScheduleCompleteFooter
