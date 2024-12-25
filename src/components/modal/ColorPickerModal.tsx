import {useCallback, useEffect, useState} from 'react'
import {StyleSheet, Modal, View, Pressable, Text} from 'react-native'
import ColorPicker, {HueSlider, LuminanceSlider, Panel1, type returnedResults} from 'reanimated-color-picker'

import {useRecoilState, useRecoilValue} from 'recoil'
import {activeThemeState, windowDimensionsState} from '@/store/system'
import {showColorPickerModalState} from '@/store/modal'
import {useQueryClient} from '@tanstack/react-query'
import {useSetScheduleColor} from '@/apis/hooks/useColor'
import {GetScheduleColorListResponse} from '@/apis/types/color'

const ColorPickerModal = () => {
  const queryClient = useQueryClient()

  const {mutateAsync: setColorMutateAsync} = useSetScheduleColor()

  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [showColorPickerModal, setShowColorPickerModal] = useRecoilState(showColorPickerModalState)

  const activeTheme = useRecoilValue(activeThemeState)
  const windowDimensions = useRecoilValue(windowDimensionsState)

  const onComplete = useCallback((color: returnedResults) => {
    setSelectedColor(color.hex)
  }, [])

  const handleSave = useCallback(async () => {
    const result = await setColorMutateAsync({color: selectedColor})

    queryClient.setQueryData<GetScheduleColorListResponse[]>(['scheduleColorList'], oldData => [
      ...oldData,
      {
        schedule_color_id: result.schedule_color_id,
        color: selectedColor
      }
    ])

    setShowColorPickerModal(false)
  }, [selectedColor, queryClient, setColorMutateAsync, setShowColorPickerModal])

  useEffect(() => {
    if (showColorPickerModal) {
      setSelectedColor('#ffffff')
    }
  }, [showColorPickerModal, setSelectedColor])

  return (
    <Modal visible={showColorPickerModal} transparent={true}>
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={[styles.wrapper, {backgroundColor: activeTheme.color5}]}>
          <ColorPicker
            sliderThickness={22}
            thumbSize={21}
            boundedThumb
            thumbShape="circle"
            thumbInnerStyle={styles.thumbInner}
            onChange={onComplete}>
            <Panel1 style={{width: '100%', height: windowDimensions.width - 62, borderRadius: 15}} />

            <View style={styles.controlBarContainer}>
              <View style={styles.previewContainer}>
                <View style={[styles.preview, {backgroundColor: selectedColor}]} />
                <Text style={[styles.previewText, {color: activeTheme.color3}]}>미리보기</Text>
              </View>

              <View style={styles.controlBarWrapper}>
                <HueSlider style={styles.controlBar} />
                <LuminanceSlider style={styles.controlBar} />
              </View>
            </View>
          </ColorPicker>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={() => setShowColorPickerModal(false)}>
              <Text style={styles.cancelButtonText}>닫기</Text>
            </Pressable>
            <Pressable style={styles.makeButton} onPress={handleSave}>
              <Text style={styles.makeButtonText}>저장</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000080'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  wrapper: {
    width: '100%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#ffffff'
  },
  thumbInner: {
    borderWidth: 2,
    borderColor: '#fff'
  },
  controlBarContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20
  },
  controlBarWrapper: {
    flex: 1,
    gap: 20
  },
  controlBar: {
    borderRadius: 20
  },
  previewContainer: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  preview: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#f5f6f8'
  },
  previewText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: '#424242'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 40
  },
  cancelButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#efefef',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  cancelButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#6B727E'
  },
  makeButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  makeButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#ffffff'
  }
})

export default ColorPickerModal
