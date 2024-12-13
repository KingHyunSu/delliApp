import {useMemo, useCallback, useState, useEffect} from 'react'
import {StyleSheet, Modal, View, Pressable, Text} from 'react-native'
import ColorPicker, {HueSlider, LuminanceSlider, Panel1, type returnedResults} from 'reanimated-color-picker'
import {Path, Svg} from 'react-native-svg'

import {useRecoilValue} from 'recoil'
import {activeBackgroundState, activeThemeState, windowDimensionsState} from '@/store/system'
import {describeArc} from '@/utils/pieHelper'

interface Props {
  visible: boolean
  value: EditColorThemeItem | null
  colorThemeList: EditColorThemeItem[]
  onChange: (value: EditColorThemeItem) => void
  onClose: () => void
}
const ColorThemeColorPickerModal = ({visible, value, colorThemeList, onChange, onClose}: Props) => {
  const [selectedColor, setSelectedColor] = useState('#ffffff')

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const activeTheme = useRecoilValue(activeThemeState)
  const activeBackground = useRecoilValue(activeBackgroundState)

  const changeColor = useCallback((color: returnedResults) => {
    setSelectedColor(color.hex)
  }, [])

  const handleSave = useCallback(async () => {
    if (!value || !selectedColor) return

    const newValue: EditColorThemeItem = {
      ...value,
      color: selectedColor,
      actionType: value.actionType === 'I' ? 'I' : 'U'
    }

    onChange(newValue)
    onClose()
  }, [selectedColor, value, onChange, onClose])

  useEffect(() => {
    if (value) {
      setSelectedColor(value.color)
    }
  }, [value])
  const previewComponent = useMemo(() => {
    const _colorThemeList = colorThemeList.map(item => {
      if (item.order === value?.order) {
        return {
          ...item,
          color: selectedColor
        }
      }

      return item
    })

    const list = [..._colorThemeList, ..._colorThemeList]
    const angle = 360 / list.length
    const radius = 15

    return (
      <View style={[styles.preview, {backgroundColor: activeBackground.background_color}]}>
        <Svg width={radius * 2} height={radius * 2}>
          {list.map((sItem, index) => {
            const {path} = describeArc({
              x: radius,
              y: radius,
              radius,
              startAngle: angle * index,
              endAngle: angle * index + angle
            })

            return <Path key={index} d={path} fill={sItem.color} />
          })}
        </Svg>
      </View>
    )
  }, [selectedColor, activeBackground.background_color, value?.order, colorThemeList])

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={[styles.wrapper, {backgroundColor: activeTheme.color5}]}>
          <ColorPicker
            value={selectedColor}
            sliderThickness={22}
            thumbSize={21}
            boundedThumb
            thumbShape="circle"
            thumbInnerStyle={styles.thumbInner}
            onChange={changeColor}>
            <Panel1 style={{width: '100%', height: windowDimensions.width - 62, borderRadius: 15}} />

            <View style={styles.controlBarContainer}>
              <View style={styles.previewContainer}>
                {previewComponent}
                <Text style={[styles.previewText, {color: activeTheme.color3}]}>미리보기</Text>
              </View>

              <View style={styles.controlBarWrapper}>
                <HueSlider style={styles.controlBar} />
                <LuminanceSlider style={styles.controlBar} />
              </View>
            </View>
          </ColorPicker>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: 42,
    height: 42
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

export default ColorThemeColorPickerModal
