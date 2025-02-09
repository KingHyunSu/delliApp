import {useRef, useCallback, useEffect} from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'
import {BottomSheetModal, BottomSheetView, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import CameraIcon from '@/assets/icons/camera.svg'
import ImageIcon from '@/assets/icons/image.svg'
import EditIcon from '@/assets/icons/edit_square.svg'

import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'

export type SelectType = 'camera' | 'photo' | 'record'

interface Props {
  visible: boolean
  activePhotoCard: boolean
  activeRecordCard: boolean
  onSelect: (key: SelectType) => void
  onClose: () => void
}
const EditScheduleCompleteCardBottomSheet = ({
  visible,
  activePhotoCard,
  activeRecordCard,
  onSelect,
  onClose
}: Props) => {
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
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      backdropComponent={getBottomSheetBackdrop}
      handleComponent={getBottomSheetHandler}
      onDismiss={onClose}>
      <BottomSheetView style={styles.container}>
        <View>
          {activePhotoCard && activeRecordCard ? (
            <Text style={[styles.title, {color: activeTheme.color3}]}>포토 카드</Text>
          ) : (
            <Text style={[styles.title, {color: activeTheme.color3, paddingBottom: 15}]}>사진 등록하기</Text>
          )}

          <Pressable style={styles.button} onPress={handleSelected('camera')}>
            <CameraIcon width={20} height={20} fill={activeTheme.color3} />
            <Text style={[styles.buttonText, {color: activeTheme.color3}]}>카메라로 촬영하기</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleSelected('photo')}>
            <ImageIcon width={20} height={20} fill={activeTheme.color3} />
            <Text style={[styles.buttonText, {color: activeTheme.color3}]}>앨범에서 선택하기</Text>
          </Pressable>
        </View>

        {activePhotoCard && activeRecordCard && (
          <View>
            <Text style={[styles.title, {color: activeTheme.color3}]}>기록 카드</Text>

            <Pressable style={styles.button} onPress={handleSelected('record')}>
              <EditIcon width={20} height={20} fill={activeTheme.color3} />
              <Text style={[styles.buttonText, {color: activeTheme.color3}]}>기록 수정하기</Text>
            </Pressable>
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 20
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    marginBottom: 5
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
