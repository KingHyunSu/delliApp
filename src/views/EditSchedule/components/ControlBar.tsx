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
import TextDirectionIcon from '@/assets/icons/text_direction.svg'

import {TEXT_ALIGN_TYPE, TEXT_DIRECTION_TYPE} from '@/utils/types'

type ControlMode = 'fontSize' | 'textAlign' | null

export interface Ref {
  close: () => void
}
interface Props {
  data: EditScheduleForm
  displayMode: 'light' | 'dark'
  isActiveSubmit: boolean
  onActiveControlMode: () => void
  onChange: (value: EditScheduleForm) => void
  onSubmit: () => void
}
const ControlBar = forwardRef<Ref, Props>((props, ref) => {
  const {data, displayMode, isActiveSubmit, onActiveControlMode, onChange, onSubmit} = props

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

  const labelStyle = useMemo(() => {
    let color = displayMode === 'light' ? '#424242' : '#eeeeee'
    if (data.font_align === TEXT_ALIGN_TYPE.NONE) {
      color = displayMode === 'light' ? '#babfc5' : '#424242'
    }

    return [controlViewStyles.label, {color}]
  }, [displayMode, data.font_align])

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
    return data.font_size || 16
  }, [data.font_size])

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

  const changeFontSize = useCallback(
    (value: number) => {
      onChange({
        ...data,
        font_size: value
      })
    },
    [data, onChange]
  )

  const changeTextAlign = useCallback(
    (value: FontAlign) => () => {
      let textDirection = data.text_direction

      if (value === TEXT_ALIGN_TYPE.NONE) {
        textDirection = TEXT_DIRECTION_TYPE.NONE
      } else if (data.font_align === TEXT_ALIGN_TYPE.NONE && value !== TEXT_ALIGN_TYPE.NONE) {
        textDirection = TEXT_DIRECTION_TYPE.RIGHT
      }

      onChange({
        ...data,
        font_align: value,
        text_direction: textDirection
      })
    },
    [data, onChange]
  )

  const changeTextDirection = useCallback(
    (value: TextDirection) => () => {
      onChange({
        ...data,
        text_direction: value
      })
    },
    [data, onChange]
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
    switch (data.font_align) {
      case TEXT_ALIGN_TYPE.LEFT:
        return <AlignLeftIcon fill={getButtonColor(activeControlMode === 'textAlign')} />
      case TEXT_ALIGN_TYPE.CENTER:
        return <AlignCenterIcon fill={getButtonColor(activeControlMode === 'textAlign')} />
      case TEXT_ALIGN_TYPE.RIGHT:
        return <AlignRightIcon fill={getButtonColor(activeControlMode === 'textAlign')} />
      case TEXT_ALIGN_TYPE.NONE:
      default:
        return <AlignJustifyIcon fill={getButtonColor(activeControlMode === 'textAlign')} />
    }
  }, [data.font_align, getButtonColor, activeControlMode])

  const activeControlModal = useMemo(() => {
    const wrapperBackgroundColor = displayMode === 'light' ? '#efefef' : '#0F0F0F'

    if (activeControlMode === 'fontSize') {
      return (
        <View style={controlViewStyles.container}>
          <View style={[controlViewStyles.wrapper, controlViewStyles.row, {backgroundColor: wrapperBackgroundColor}]}>
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
            <View style={controlViewStyles.row}>
              <Pressable style={controlViewStyles.button} onPress={changeTextAlign(TEXT_ALIGN_TYPE.LEFT)}>
                <AlignLeftIcon fill={getButtonColor(data.font_align === TEXT_ALIGN_TYPE.LEFT)} />
              </Pressable>
              <Pressable style={controlViewStyles.button} onPress={changeTextAlign(TEXT_ALIGN_TYPE.CENTER)}>
                <AlignCenterIcon fill={getButtonColor(data.font_align === TEXT_ALIGN_TYPE.CENTER)} />
              </Pressable>
              <Pressable style={controlViewStyles.button} onPress={changeTextAlign(TEXT_ALIGN_TYPE.RIGHT)}>
                <AlignRightIcon fill={getButtonColor(data.font_align === TEXT_ALIGN_TYPE.RIGHT)} />
              </Pressable>
              <Pressable style={controlViewStyles.button} onPress={changeTextAlign(TEXT_ALIGN_TYPE.NONE)}>
                <AlignJustifyIcon fill={getButtonColor(data.font_align === TEXT_ALIGN_TYPE.NONE)} />
              </Pressable>
            </View>

            <View
              style={[
                controlViewStyles.section,
                {justifyContent: 'space-between', borderTopColor: displayMode === 'light' ? '#424242' : '#eeeeee'}
              ]}>
              <Text style={labelStyle}>글자 방향</Text>

              <View style={controlViewStyles.row}>
                <Pressable
                  style={[controlViewStyles.button, {transform: [{rotateY: '180deg'}]}]}
                  disabled={data.font_align === TEXT_ALIGN_TYPE.NONE}
                  onPress={changeTextDirection(TEXT_DIRECTION_TYPE.LEFT)}>
                  <TextDirectionIcon fill={getButtonColor(data.text_direction === TEXT_DIRECTION_TYPE.LEFT)} />
                </Pressable>
                <Pressable
                  style={controlViewStyles.button}
                  disabled={data.font_align === TEXT_ALIGN_TYPE.NONE}
                  onPress={changeTextDirection(TEXT_DIRECTION_TYPE.RIGHT)}>
                  <TextDirectionIcon fill={getButtonColor(data.text_direction === TEXT_DIRECTION_TYPE.RIGHT)} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )
    }

    return <></>
  }, [
    activeControlMode,
    displayMode,
    labelStyle,
    fontSize,
    data.font_align,
    data.text_direction,
    getButtonColor,
    changeFontSize,
    changeTextAlign,
    changeTextDirection
  ])

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
            <Text style={submitButtonTextStyle}>{data.schedule_id ? '수정' : '등록'}</Text>
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
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 'auto'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20
  },
  section: {
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 1,
    marginTop: 5,
    paddingTop: 5
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#ffffff'
  },
  label: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    marginLeft: 10
  },
  button: {
    height: 40,
    paddingHorizontal: 7,
    justifyContent: 'center'
  }
})

export default ControlBar
