import {useRef, useCallback, useEffect} from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'
import {BottomSheetModal, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import CameraIcon from '@/assets/icons/camera.svg'
import ImageIcon from '@/assets/icons/image.svg'

import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'

export type SelectType = 'camera' | 'photo'

interface Props {
  visible: boolean
  onSelect: (key: SelectType) => void
  onClose: () => void
}
const EditScheduleCompleteCardBottomSheet = ({visible, onSelect, onClose}: Props) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const activeTheme = useRecoilValue(activeThemeState)

  const handleSelected = useCallback(
    (key: SelectType) => () => {
      onSelect(key)
    },
    [onSelect]
  )

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present()
    } else {
      bottomSheetModalRef.current?.dismiss()
    }
  }, [visible])

  // components
  const getBottomSheetBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const getBottomSheetHandler = useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={1}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  return (
    <BottomSheetModal
      name="photoMenu"
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={[250]}
      // snapPoints={[300]}
      enableDynamicSizing={false}
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      backdropComponent={getBottomSheetBackdrop}
      handleComponent={getBottomSheetHandler}
      onDismiss={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, {color: activeTheme.color3}]}>
          사진 등록하기
          {/*카드 수정하기*/}
        </Text>

        <Pressable style={styles.button} onPress={handleSelected('camera')}>
          <CameraIcon width={20} height={20} fill={activeTheme.color3} />
          <Text style={[styles.buttonText, {color: activeTheme.color3}]}>카메라로 촬영하기</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleSelected('photo')}>
          <ImageIcon width={20} height={20} fill={activeTheme.color3} />
          <Text style={[styles.buttonText, {color: activeTheme.color3}]}>앨범에서 선택하기</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    marginBottom: 20
  },
  button: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  buttonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16
  }
})

export default EditScheduleCompleteCardBottomSheet
