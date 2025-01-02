import {forwardRef, useImperativeHandle, useState, useMemo, useCallback} from 'react'
import {StyleSheet, View, Text, Pressable, Image, ScrollView} from 'react-native'
import Slider from '@react-native-community/slider'
import {Shadow} from 'react-native-shadow-2'
import {useSetRecoilState} from 'recoil'
import {showColorSelectorBottomSheetState} from '@/store/bottomSheet'

import AlignJustifyIcon from '@/assets/icons/align_justify.svg'
import AlignLeftIcon from '@/assets/icons/align_left.svg'
import AlignCenterIcon from '@/assets/icons/align_center.svg'
import AlignRightIcon from '@/assets/icons/align_right.svg'

type ControlMode = 'fontSize' | 'rotate' | 'textAlign' | null

export interface Ref {
  close: () => void
}
interface Props {
  schedule: EditScheduleForm
  displayMode: 'light' | 'dark'
  isActiveSubmit: boolean
  changeFontSize: (value: number) => void
  changeFontAlign: (value: FontAlign) => void
  onActiveControlMode: () => void
  onSubmit: () => void
}
const ControlBar = forwardRef<Ref, Props>((props, ref) => {
  const {schedule, displayMode, isActiveSubmit, changeFontSize, changeFontAlign, onActiveControlMode, onSubmit} = props

  const [activeControlMode, setActiveControlMode] = useState<ControlMode>(null)

  const setShowColorSelectorBottomSheet = useSetRecoilState(showColorSelectorBottomSheetState)

  const shadowColor = useMemo(() => {
    return displayMode === 'light' ? '#ffffff' : '#27272C'
  }, [displayMode])

  const containerStyle = useMemo(() => {
    return [styles.container, {backgroundColor: displayMode === 'light' ? '#efefef' : '#0F0F0F'}]
  }, [displayMode])

  const colorButtonIconStyle = useMemo(() => {
    const borderColor = displayMode === 'light' ? '#babfc5' : '#424242'

    return [styles.colorButtonIcon, {borderColor}]
  }, [displayMode])

  const getButtonColor = useCallback(
    (bool: boolean) => {
      let color = displayMode === 'light' ? '#babfc5' : '#424242'

      if (bool) {
        color = displayMode === 'light' ? '#424242' : '#babfc5'
      }

      return color
    },
    [displayMode]
  )

  const fontSizeButtonIconStyle = useMemo(() => {
    const color = getButtonColor(activeControlMode === 'fontSize')
    return [styles.fontSizeButtonIcon, {color}]
  }, [activeControlMode, getButtonColor])

  const getButtonTextStyle = useCallback(
    (bool: boolean) => {
      const color = getButtonColor(bool)
      return [styles.buttonText, {color}]
    },
    [getButtonColor]
  )

  const submitButtonStyle = useMemo(() => {
    const backgroundColor = isActiveSubmit ? '#1E90FF' : '#f9f9f9'
    return [styles.submitButton, {backgroundColor}]
  }, [isActiveSubmit])

  const submitButtonTextStyle = useMemo(() => {
    const color = isActiveSubmit ? '#ffffff' : '#babfc5'
    return [styles.submitButtonText, {color}]
  }, [isActiveSubmit])

  const fontSize = useMemo(() => {
    return schedule.font_size || 16
  }, [schedule.font_size])

  const changeActiveControlMode = useCallback(
    (controlMode: ControlMode) => () => {
      if (activeControlMode && activeControlMode === controlMode) {
        setActiveControlMode(null)
      } else {
        onActiveControlMode()
        setActiveControlMode(controlMode)
      }
    },
    [activeControlMode, onActiveControlMode, setActiveControlMode]
  )

  const showColorSelectorBottomSheet = useCallback(() => {
    setActiveControlMode(null)
    setShowColorSelectorBottomSheet(true)
    onActiveControlMode()
  }, [setActiveControlMode, setShowColorSelectorBottomSheet, onActiveControlMode])

  useImperativeHandle(
    ref,
    () => {
      return {
        close() {
          setActiveControlMode(null)
        }
      }
    },
    [setActiveControlMode]
  )

  const activeFontAlignIcon = useMemo(() => {
    switch (schedule.font_align) {
      case 1:
        return <AlignLeftIcon fill={getButtonColor(activeControlMode === 'textAlign')} />
      case 2:
        return <AlignCenterIcon fill={getButtonColor(activeControlMode === 'textAlign')} />
      case 3:
        return <AlignRightIcon fill={getButtonColor(activeControlMode === 'textAlign')} />
      default:
        return <AlignJustifyIcon fill={getButtonColor(activeControlMode === 'textAlign')} />
    }
  }, [schedule.font_align, getButtonColor, activeControlMode])

  const activeControlModal = useMemo(() => {
    const wrapperBackgroundColor = displayMode === 'light' ? '#efefef' : '#0F0F0F'

    if (activeControlMode === 'fontSize') {
      return (
        <View style={controlViewStyles.container}>
          <View style={[controlViewStyles.wrapper, {backgroundColor: wrapperBackgroundColor}]}>
            <Slider
              style={{flex: 1}}
              value={fontSize}
              step={2}
              minimumValue={10}
              maximumValue={32}
              minimumTrackTintColor={displayMode === 'light' ? '#424242' : '#babfc5'}
              maximumTrackTintColor={displayMode === 'light' ? '#babfc5' : '#424242'}
              onValueChange={changeFontSize}
            />

            <Text style={[controlViewStyles.text, {color: displayMode === 'light' ? '#424242' : '#eeeeee'}]}>
              {fontSize}
            </Text>
          </View>
        </View>
      )
    } else if (activeControlMode === 'textAlign') {
      return (
        <View style={controlViewStyles.container}>
          <View style={[controlViewStyles.wrapper, {backgroundColor: wrapperBackgroundColor}]}>
            <Pressable style={controlViewStyles.button} onPress={() => changeFontAlign(1)}>
              <AlignLeftIcon fill={getButtonColor(schedule.font_align === 1)} />
            </Pressable>
            <Pressable style={controlViewStyles.button} onPress={() => changeFontAlign(2)}>
              <AlignCenterIcon fill={getButtonColor(schedule.font_align === 2)} />
            </Pressable>
            <Pressable style={controlViewStyles.button} onPress={() => changeFontAlign(3)}>
              <AlignRightIcon fill={getButtonColor(schedule.font_align === 3)} />
            </Pressable>
            <Pressable style={controlViewStyles.button} onPress={() => changeFontAlign(0)}>
              <AlignJustifyIcon fill={getButtonColor(schedule.font_align === 0)} />
            </Pressable>
          </View>
        </View>
      )
    }

    return <></>
  }, [activeControlMode, displayMode, fontSize, schedule.font_align, getButtonColor, changeFontSize, changeFontAlign])

  return (
    <View>
      {activeControlModal}

      <Shadow stretch={true} startColor={shadowColor} distance={30}>
        <View style={containerStyle}>
          <Pressable style={styles.colorButton} onPress={showColorSelectorBottomSheet}>
            <Image source={require('@/assets/icons/color.png')} style={colorButtonIconStyle} />
          </Pressable>

          <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={true}>
            <Pressable style={styles.button} onPress={changeActiveControlMode('fontSize')}>
              <View style={styles.buttonIconWrapper}>
                <Text style={fontSizeButtonIconStyle}>{fontSize}</Text>
              </View>

              <Text style={getButtonTextStyle(activeControlMode === 'fontSize')}>글자 크기</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={changeActiveControlMode('textAlign')}>
              <View style={styles.buttonIconWrapper}>{activeFontAlignIcon}</View>

              <Text style={getButtonTextStyle(activeControlMode === 'textAlign')}>글자 정렬</Text>
            </Pressable>

            {/* TODO - 폰트 작업 후 추가 예정 */}
            {/*<Pressable style={styles.controlButton}>*/}
            {/*  <View style={styles.controlButtonWrapper}>*/}
            {/*    <Text style={styles.fontSizeButtonText}>A</Text>*/}
            {/*  </View>*/}

            {/*  <Text style={styles.controlButtonText}>폰트</Text>*/}
            {/*</Pressable>*/}
          </ScrollView>

          <Pressable style={submitButtonStyle} disabled={!isActiveSubmit} onPress={onSubmit}>
            <Text style={submitButtonTextStyle}>{schedule.schedule_id ? '수정' : '등록'}</Text>
          </Pressable>
        </View>
      </Shadow>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#424242'
  },
  scrollContainer: {
    gap: 5
  },
  button: {
    width: 52,
    height: 42,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonIconWrapper: {
    height: 29,
    justifyContent: 'center',
    transform: [{translateY: -1}]
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 10,
    color: '#696969'
  },

  fontSizeButtonIcon: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 26,
    color: '#696969'
  },
  colorButton: {
    paddingRight: 15
  },
  colorButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#696969'
  },

  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    borderRadius: 24,
    paddingHorizontal: 20,
    marginLeft: 15
  },
  submitButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14
  }
})

const controlViewStyles = StyleSheet.create({
  container: {
    zIndex: 999,
    position: 'absolute',
    bottom: 72,
    left: 0,
    right: 0
  },
  wrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,

    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginHorizontal: 'auto',
    gap: 20
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#ffffff'
  },
  button: {
    height: 40,
    paddingHorizontal: 7,
    justifyContent: 'center'
  }
})

export default ControlBar
