import {StyleSheet, View, Pressable, Text} from 'react-native'
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet'
import AppBar from '@/components/AppBar'
import {useCallback} from 'react'

const uploadRequestTextList = [
  '오늘의 성취를 사진으로 남겨보세요',
  '오늘의 노력을 사진으로 남겨보세요',
  '완료한 순간을 사진으로 남겨보세요',
  '열정적인 순간을 사진으로 남겨보세요',
  '기념할 사진이 있나요?'
]

interface Props {
  props: BottomSheetBackdropProps
  imageHeight: number
}
const EditScheduleCompleteCustomBackdrop = ({props, imageHeight}: Props) => {
  const handlePress = useCallback(() => {
    console.log('238293829')
  }, [])

  return (
    <View style={styles.container}>
      <AppBar backPress title="기록하기" />

      <View style={[styles.wrapper, {height: imageHeight}]}>
        <Text style={styles.requestText}>오늘의 성취를 사진으로 남겨보세요</Text>

        <Pressable style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>사진 등록하기</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef'
  },
  requestText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#555'
  },
  button: {
    marginTop: 15,
    paddingHorizontal: 30,
    height: 52,
    borderRadius: 15,
    backgroundColor: '#1E90FF',
    justifyContent: 'center'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#ffffff'
  }
})

export default EditScheduleCompleteCustomBackdrop
