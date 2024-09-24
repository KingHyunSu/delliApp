import {useRef, useMemo, useCallback, useEffect} from 'react'
import {View, Text} from 'react-native'
import {BottomSheetBackdropProps, BottomSheetHandleProps, BottomSheetModal} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import {showSearchScheduleCategoryFilterBottomSheetState} from '@/store/bottomSheet'
import {useRecoilState} from 'recoil'

const SearchScheduleCategoryFilterBottomSheet = () => {
  const searchScheduleCategoryFilterBottomSheetRef = useRef<BottomSheetModal>(null)

  const [showSearchScheduleCategoryFilterBottomSheet, setShowSearchScheduleCategoryFilterBottomSheet] = useRecoilState(
    showSearchScheduleCategoryFilterBottomSheetState
  )

  const snapPoints = useMemo(() => [300], [])

  const handleDismiss = useCallback(() => {
    setShowSearchScheduleCategoryFilterBottomSheet(false)
  }, [setShowSearchScheduleCategoryFilterBottomSheet])

  useEffect(() => {
    if (showSearchScheduleCategoryFilterBottomSheet) {
      searchScheduleCategoryFilterBottomSheetRef.current?.present()
    } else {
      searchScheduleCategoryFilterBottomSheetRef.current?.dismiss()
    }
  }, [showSearchScheduleCategoryFilterBottomSheet])

  // components
  const getBackdropComponent = useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const getHandleComponent = useCallback((props: BottomSheetHandleProps) => {
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
      name="scheduleCategoryModal"
      ref={searchScheduleCategoryFilterBottomSheetRef}
      backdropComponent={getBackdropComponent}
      handleComponent={getHandleComponent}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}>
      <View>
        <Text>123</Text>
      </View>
    </BottomSheetModal>
  )
}

export default SearchScheduleCategoryFilterBottomSheet
