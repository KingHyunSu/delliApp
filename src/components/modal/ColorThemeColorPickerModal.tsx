import {useMemo, useCallback, useState, useEffect} from 'react'
import {StyleSheet, Modal, View, Pressable, Text} from 'react-native'
import ColorPicker, {HueSlider, LuminanceSlider, Panel1, type returnedResults} from 'reanimated-color-picker'

import {useRecoilValue} from 'recoil'
import {activeThemeState, windowDimensionsState} from '@/store/system'

type ActiveTab = 'background' | 'text'
interface Props {
  visible: boolean
  value: EditColorThemeItem | null
  onChange: (value: EditColorThemeItem) => void
  onClose: () => void
}
const ColorThemeColorPickerModal = ({visible, value, onChange, onClose}: Props) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('background')
  const [_value, _setValue] = useState(value)

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const activeTheme = useRecoilValue(activeThemeState)

  const selectedColor = useMemo(() => {
    if (!_value) return '#ffffff'

    if (activeTab === 'background') {
      return _value.background_color
    } else if (activeTab === 'text') {
      return _value.text_color
    }

    return '#ffffff'
  }, [_value, activeTab])

  const getTabButtonStyle = useCallback(
    (tab: ActiveTab) => {
      const backgroundColor = activeTab === tab ? activeTheme.color7 : activeTheme.color2

      return [styles.tabButton, {backgroundColor}]
    },
    [activeTab, activeTheme.color2, activeTheme.color7]
  )

  const getTabButtonTextStyle = useCallback(
    (tab: ActiveTab) => {
      const color = activeTab === tab ? activeTheme.color2 : activeTheme.color3

      return [styles.tabButtonText, {color}]
    },
    [activeTab, activeTheme.color2, activeTheme.color3]
  )

  const changeColor = useCallback(
    (color: returnedResults) => {
      if (activeTab === 'background') {
        _setValue(prevState =>
          prevState
            ? {
                ...prevState,
                background_color: color.hex
              }
            : _value
        )
      } else if (activeTab === 'text') {
        _setValue(prevState =>
          prevState
            ? {
                ...prevState,
                text_color: color.hex
              }
            : _value
        )
      }
    },
    [_value, activeTab]
  )

  const handleSave = useCallback(async () => {
    if (!_value) return

    onChange({
      ..._value,
      actionType: _value.actionType === 'I' ? 'I' : 'U'
    })
    onClose()
  }, [_value, onChange, onClose])

  useEffect(() => {
    if (value) {
      _setValue(value)
    }
  }, [value])

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={[styles.wrapper, {backgroundColor: activeTheme.color5}]}>
          <View style={[styles.tabWrapper, {backgroundColor: activeTheme.color2}]}>
            <Pressable style={getTabButtonStyle('background')} onPress={() => setActiveTab('background')}>
              <Text style={getTabButtonTextStyle('background')}>배경</Text>
            </Pressable>
            <Pressable style={getTabButtonStyle('text')} onPress={() => setActiveTab('text')}>
              <Text style={getTabButtonTextStyle('text')}>글자</Text>
            </Pressable>
          </View>

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
                <View style={[styles.preview, {backgroundColor: _value ? _value.background_color : '#ffffff'}]}>
                  <Text style={[styles.previewText, {color: _value ? _value.text_color : '#000000'}]}>가</Text>
                </View>

                <Text style={[styles.previewLabel, {color: activeTheme.color3}]}>미리보기</Text>
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
  tabWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 50,
    padding: 5
  },
  tabButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 50
  },
  tabButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16
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
    fontSize: 18
  },
  previewLabel: {
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
