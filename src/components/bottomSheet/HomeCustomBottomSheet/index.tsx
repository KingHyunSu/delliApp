import {useRef, useMemo, useEffect, useCallback} from 'react'
import {StyleSheet, View} from 'react-native'
import {BottomSheetBackdropProps, BottomSheetModal} from '@gorhom/bottom-sheet'
import BackgroundList from './src/BackgroundList'
import CustomBackdrop from './src/CustomBackdrop'

import {useRecoilValue} from 'recoil'
import {safeAreaInsetsState} from '@/store/system'

interface Props {
  visible: boolean
  activeMenu: 'background' | 'outline' | null
  activeBackground: DownloadedBackgroundItem | null
  onChangeBackground: (value: DownloadedBackgroundItem) => void
  onDismiss: () => void
}
const HomeCustomBottomSheet = ({visible, activeMenu, activeBackground, onChangeBackground, onDismiss}: Props) => {
  const customBackgroundBottomSheetRef = useRef<BottomSheetModal>(null)

  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const bottomInset = useMemo(() => {
    return 72 + 1 + safeAreaInsets.bottom
  }, [safeAreaInsets.bottom])

  useEffect(() => {
    if (visible) {
      customBackgroundBottomSheetRef.current?.present()
    } else {
      customBackgroundBottomSheetRef.current?.dismiss()
    }
  }, [visible])

  // components
  const getBottomSheetBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => {
      return <CustomBackdrop props={props} onClose={onDismiss} />
    },
    [onDismiss]
  )

  return (
    <BottomSheetModal
      name="customBackground"
      ref={customBackgroundBottomSheetRef}
      snapPoints={['50%', '90%']}
      bottomInset={bottomInset}
      backdropComponent={getBottomSheetBackdrop}
      onDismiss={onDismiss}>
      <View style={styles.container}>
        {activeMenu === 'background' ? (
          <BackgroundList activeItem={activeBackground} onChange={onChangeBackground} />
        ) : (
          <></>
        )}
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20
  }
})

export default HomeCustomBottomSheet
