import React from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {scheduleState, colorTypeState} from '@/store/schedule'
import {showStyleBottomSheetState, showColorPickerBottomSheetState} from '@/store/bottomSheet'

import {COLOR_TYPE} from '@/utils/types'

const StyleBottomSheet = () => {
  const styleBottomSheet = React.useRef<BottomSheetModal>(null)

  const schedule = useRecoilValue(scheduleState)
  const setColorType = useSetRecoilState(colorTypeState)

  const [isShowStyleBottomSheet, setIsShowStyleBottomSheet] = useRecoilState(showStyleBottomSheetState)
  const [isShowColorPickerBottomSheet, setIsShowColorPickerBottomSheet] = useRecoilState(
    showColorPickerBottomSheetState
  )

  const openColorPickerBottomSheet = (colorType: COLOR_TYPE) => {
    setColorType(colorType)
    setIsShowColorPickerBottomSheet(true)
  }

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

  return (
    <BottomSheetModal
      name="style"
      ref={styleBottomSheet}
      backdropComponent={props => {
        return <BottomSheetBackdrop props={props} />
      }}
      index={0}
      snapPoints={['35%']}
      onDismiss={() => setIsShowStyleBottomSheet(false)}>
      <BottomSheetScrollView>
        <View style={styles.container}>
          <View>
            <Text style={styles.label}>색상</Text>
            <View style={styles.colorContainer}>
              <Pressable style={styles.colorWrapper} onPress={() => openColorPickerBottomSheet('background')}>
                <Text style={styles.colorLabel}>배경색</Text>
                <View style={[styles.color, {backgroundColor: schedule.background_color}]} />
              </Pressable>

              <Pressable style={styles.colorWrapper} onPress={() => openColorPickerBottomSheet('text')}>
                <Text style={styles.colorLabel}>글자색</Text>
                <View style={[styles.color, {backgroundColor: schedule.text_color}]} />
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
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 18,
    marginBottom: 16,
    color: '#000'
  },
  colorContainer: {
    flexDirection: 'row',
    gap: 20
  },
  colorWrapper: {
    flexDirection: 'row',
    gap: 10,
    height: 52,
    paddingHorizontal: 20,
    backgroundColor: '#f5f6f8',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  colorLabel: {
    fontFamily: 'GmarketSansTTFMedium',
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
