import {useRef, useMemo, useEffect, useCallback} from 'react'
import {Pressable, StyleSheet, Text, View} from 'react-native'
import {
  BottomSheetBackdropProps,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetFooter
} from '@gorhom/bottom-sheet'
import BackgroundList from './src/BackgroundList'
import OutlineList from './src/OutlineList'
import CustomBackdrop from './src/CustomBackdrop'

import {useRecoilValue, useSetRecoilState} from 'recoil'
import {safeAreaInsetsState} from '@/store/system'
import {showOutlineColorPickerModalState} from '@/store/modal'

interface Props {
  visible: boolean
  activeMenu: 'background' | 'outline' | null
  activeBackground: ActiveBackground
  activeOutline: ActiveOutline
  onChangeBackground: (value: ActiveBackground) => void
  onDismiss: () => void
}
const HomeCustomBottomSheet = ({
  visible,
  activeMenu,
  activeBackground,
  activeOutline,
  onChangeBackground,
  onDismiss
}: Props) => {
  const customBackgroundBottomSheetRef = useRef<BottomSheetModal>(null)

  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)
  const setShowOutlineColorPickerModal = useSetRecoilState(showOutlineColorPickerModalState)

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
  const getBackdropComponent = useCallback(
    (props: BottomSheetBackdropProps) => {
      return <CustomBackdrop props={props} onClose={onDismiss} />
    },
    [onDismiss]
  )

  const getFooterComponent = useCallback(
    (props: BottomSheetFooterProps) => {
      if (activeMenu === 'outline') {
        return (
          <BottomSheetFooter {...props} bottomInset={10}>
            <Pressable style={footerStyles.button} onPress={() => setShowOutlineColorPickerModal(true)}>
              <Text style={footerStyles.buttonText}>색상 변경</Text>
            </Pressable>
          </BottomSheetFooter>
        )
      }

      return null
    },
    [activeMenu, setShowOutlineColorPickerModal]
  )

  const renderContents = useMemo(() => {
    switch (activeMenu) {
      case 'background':
        return <BackgroundList activeItem={activeBackground} onChange={onChangeBackground} />
      case 'outline':
        return <OutlineList activeItem={activeOutline} activeBackground={activeBackground} />
      default:
        return <></>
    }
  }, [activeMenu, activeBackground, activeOutline, onChangeBackground])

  return (
    <BottomSheetModal
      name="customBackground"
      ref={customBackgroundBottomSheetRef}
      snapPoints={['50%', '90%']}
      enableDynamicSizing={false}
      bottomInset={bottomInset}
      backdropComponent={getBackdropComponent}
      footerComponent={getFooterComponent}
      onDismiss={onDismiss}>
      <View style={styles.container}>{renderContents}</View>
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

const footerStyles = StyleSheet.create({
  button: {
    height: 42,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    borderRadius: 50,
    paddingHorizontal: 25
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#ffffff'
  }
})

export default HomeCustomBottomSheet
