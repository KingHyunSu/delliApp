import React from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'
import {BottomSheetModal, BottomSheetScrollView, BottomSheetBackdropProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {scheduleState, colorTypeState} from '@/store/schedule'
import {showStyleBottomSheetState, showColorPickerBottomSheetState} from '@/store/bottomSheet'

import {COLOR_TYPE} from '@/utils/types'

const StyleBottomSheet = () => {
  const schedule = useRecoilValue(scheduleState)
  const setColorType = useSetRecoilState(colorTypeState)

  const [isShowStyleBottomSheet, setIsShowStyleBottomSheet] = useRecoilState(showStyleBottomSheetState)
  const [isShowColorPickerBottomSheet, setIsShowColorPickerBottomSheet] = useRecoilState(
    showColorPickerBottomSheetState
  )

  const styleBottomSheet = React.useRef<BottomSheetModal>(null)

  const snapPoints = React.useMemo(() => {
    return ['35%']
  }, [])

  const backgroundColorPickStyle = React.useMemo(() => {
    return [styles.color, {backgroundColor: schedule.background_color}]
  }, [schedule.background_color])

  const textColorPickStyle = React.useMemo(() => {
    return [styles.color, {backgroundColor: schedule.text_color}]
  }, [schedule.text_color])

  const handleDismiss = React.useCallback(() => {
    setIsShowStyleBottomSheet(false)
  }, [setIsShowStyleBottomSheet])

  const openColorPickerBottomSheet = React.useCallback(
    (colorType: COLOR_TYPE) => {
      setColorType(colorType)
      setIsShowColorPickerBottomSheet(true)
    },
    [setColorType, setIsShowColorPickerBottomSheet]
  )

  const openBackgroundStyleBottomSheet = React.useCallback(() => {
    openColorPickerBottomSheet('background')
  }, [openColorPickerBottomSheet])

  const openTextStyleBottomSheet = React.useCallback(() => {
    openColorPickerBottomSheet('text')
  }, [openColorPickerBottomSheet])

  React.useEffect(() => {
    if (isShowStyleBottomSheet) {
      styleBottomSheet.current?.present()
    } else {
      styleBottomSheet.current?.dismiss()
    }
  }, [isShowStyleBottomSheet])

  React.useEffect(() => {
    if (isShowColorPickerBottomSheet) {
      styleBottomSheet.current?.dismiss()
    }
  }, [isShowColorPickerBottomSheet])

  const backdropComponent = React.useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  return (
    <BottomSheetModal
      name="style"
      ref={styleBottomSheet}
      backdropComponent={backdropComponent}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}>
      <BottomSheetScrollView>
        <View style={styles.container}>
          <View>
            {/* <Text style={styles.label}>색상</Text> */}
            <View style={styles.colorContainer}>
              <Pressable style={styles.colorWrapper} onPress={openBackgroundStyleBottomSheet}>
                <Text style={styles.colorLabel}>배경색</Text>
                <View style={backgroundColorPickStyle} />
              </Pressable>

              <Pressable style={styles.colorWrapper} onPress={openTextStyleBottomSheet}>
                <Text style={styles.colorLabel}>글자색</Text>
                <View style={textColorPickStyle} />
              </Pressable>
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 30
  },
  label: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    marginBottom: 16,
    color: '#000'
  },
  colorContainer: {
    flexDirection: 'row',
    gap: 20
  },
  colorWrapper: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    height: 52,
    paddingHorizontal: 20,
    backgroundColor: '#f5f6f8',
    // alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  colorLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#555'
  },
  color: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'skyblue',
    borderWidth: 1,
    borderColor: '#e6e7e9'
  }
})

export default StyleBottomSheet
