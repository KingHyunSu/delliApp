import {useCallback, useEffect, useMemo, useState} from 'react'
import {StyleSheet, Modal, View, Pressable, Text} from 'react-native'
import ColorPicker, {HueSlider, LuminanceSlider, Panel1, type returnedResults} from 'reanimated-color-picker'

import {useRecoilState, useRecoilValue} from 'recoil'
import {activeThemeState, windowDimensionsState} from '@/store/system'
import {showOutlineColorPickerModalState} from '@/store/modal'
import {DefaultOutline} from '@/components/timetableOutline'

type ActiveTab = 'background' | 'progress' | null
interface Props {
  value: ActiveOutline
  activeBackground: DownloadedBackgroundItem
  onChange: (value: ActiveOutline) => void
}
const OutlineColorPickerModal = ({value, activeBackground, onChange}: Props) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(null)
  const [_value, _setValue] = useState(value)

  const [showOutlineColorPickerModal, setShowOutlineColorPickerModal] = useRecoilState(showOutlineColorPickerModalState)

  const activeTheme = useRecoilValue(activeThemeState)
  const windowDimensions = useRecoilValue(windowDimensionsState)

  const selectedColor = useMemo(() => {
    if (activeTab === 'background') {
      return _value.background_color
    } else if (activeTab === 'progress') {
      return _value.progress_color
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

  const _onChange = useCallback(
    (color: returnedResults) => {
      if (activeTab === 'background') {
        _setValue(prevState => ({
          ...prevState,
          background_color: color.hex
        }))
      } else if (activeTab === 'progress') {
        _setValue(prevState => ({
          ...prevState,
          progress_color: color.hex
        }))
      }
    },
    [activeTab]
  )

  const handleSave = useCallback(() => {
    onChange(_value)
    setShowOutlineColorPickerModal(false)
  }, [_value, onChange, setShowOutlineColorPickerModal])

  useEffect(() => {
    if (showOutlineColorPickerModal) {
      _setValue(value)
      setActiveTab('progress')
    } else {
      setActiveTab(null)
    }
  }, [value, _setValue, showOutlineColorPickerModal])

  return (
    <Modal visible={showOutlineColorPickerModal} transparent={true}>
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={[styles.wrapper, {backgroundColor: activeTheme.color5}]}>
          <View style={[styles.tabWrapper, {backgroundColor: activeTheme.color2}]}>
            <Pressable style={getTabButtonStyle('progress')} onPress={() => setActiveTab('progress')}>
              <Text style={getTabButtonTextStyle('progress')}>진행바</Text>
            </Pressable>
            <Pressable style={getTabButtonStyle('background')} onPress={() => setActiveTab('background')}>
              <Text style={getTabButtonTextStyle('background')}>배경</Text>
            </Pressable>
          </View>

          <ColorPicker
            value={selectedColor}
            sliderThickness={22}
            thumbSize={21}
            boundedThumb
            thumbShape="circle"
            thumbInnerStyle={styles.thumbInner}
            onChange={_onChange}>
            <Panel1 style={{width: '100%', height: windowDimensions.width - 62, borderRadius: 15}} />

            <View style={styles.controlBarContainer}>
              <View style={styles.previewContainer}>
                <View style={[styles.preview, {backgroundColor: activeBackground.background_color}]}>
                  <DefaultOutline
                    backgroundColor={_value.background_color}
                    progressColor={_value.progress_color}
                    radius={10}
                    strokeWidth={5}
                    percentage={50}
                  />
                </View>
                <Text style={[styles.previewText, {color: activeTheme.color3}]}>미리보기</Text>
              </View>

              <View style={styles.controlBarWrapper}>
                <HueSlider style={styles.controlBar} />
                <LuminanceSlider style={styles.controlBar} />
              </View>
            </View>
          </ColorPicker>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={() => setShowOutlineColorPickerModal(false)}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </Pressable>
            <Pressable style={styles.makeButton} onPress={handleSave}>
              <Text style={styles.makeButtonText}>변경하기</Text>
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
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f5f6f8',
    justifyContent: 'center',
    alignItems: 'center'
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

export default OutlineColorPickerModal
