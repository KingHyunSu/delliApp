import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {BottomSheetBackdropProps, BottomSheetModal} from '@gorhom/bottom-sheet'

import {useRecoilState} from 'recoil'
import {showScheduleTitleControllerBottomSheetState} from '@/store/bottomSheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'

const ScheduleTitleControllerBottomSheet = () => {
  const [isShow, setIsShow] = useRecoilState(showScheduleTitleControllerBottomSheetState)

  const bottomSheetRef = React.useRef<BottomSheetModal>(null)

  const handleDismiss = () => {
    setIsShow(false)
  }

  const backdropComponent = React.useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} opacity={0} />
  }, [])

  React.useEffect(() => {
    if (isShow) {
      bottomSheetRef.current?.present()
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [isShow])

  return (
    <BottomSheetModal
      name="ScheduleTitleControllerBottomSheet"
      ref={bottomSheetRef}
      index={0}
      snapPoints={[300]}
      backdropComponent={backdropComponent}
      onDismiss={handleDismiss}>
      <View>
        <Text>회전</Text>
      </View>
    </BottomSheetModal>
  )
}

export default ScheduleTitleControllerBottomSheet
