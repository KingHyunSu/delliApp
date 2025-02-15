import {useRef, useCallback, useEffect} from 'react'
import {StyleSheet, Pressable, Text} from 'react-native'
import {BottomSheetModal, BottomSheetView, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'

type SelectType = 'photo' | 'record'

interface Props {
  visible: boolean
  onSelect: (type: SelectType) => void
  onClose: () => void
}
const EditScheduleCompleteCardMenuBottomSheet = ({visible, onSelect, onClose}: Props) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const activeTheme = useRecoilValue(activeThemeState)

  const handleSelect = useCallback(
    (type: SelectType) => {
      onSelect(type)
      onClose()
    },
    [onSelect, onClose]
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
      name="scheduleCompleteCardMenu"
      ref={bottomSheetModalRef}
      index={0}
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      backdropComponent={getBottomSheetBackdrop}
      handleComponent={getBottomSheetHandler}
      onDismiss={onClose}>
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>완료 카드 수정하기</Text>

        <Pressable style={styles.button} onPress={() => handleSelect('photo')}>
          <Text style={styles.buttonText}>포토 카드 수정</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleSelect('record')}>
          <Text style={styles.buttonText}>기록 카드 수정</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 50
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    marginBottom: 15
  },
  button: {
    height: 52,
    justifyContent: 'center'
  },
  buttonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16
  }
})

export default EditScheduleCompleteCardMenuBottomSheet
