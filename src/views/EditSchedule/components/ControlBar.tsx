import {forwardRef, useImperativeHandle, useState, useMemo, useCallback} from 'react'
import {StyleSheet, View, Text, Pressable, Image, ScrollView} from 'react-native'
import Slider from '@react-native-community/slider'
import {Shadow} from 'react-native-shadow-2'
import {useSetRecoilState} from 'recoil'
import {showColorSelectorBottomSheetState} from '@/store/bottomSheet'
import AlignCenterIcon from '@/assets/icons/align_center.svg'

type ControlMode = 'fontSize' | 'rotate' | null

export interface Ref {
  close: () => void
}
interface Props {
  schedule: EditScheduleForm
  displayMode: 'light' | 'dark'
  isActiveSubmit: boolean
  changeFontSize: (value: number) => void
  onActiveControlMode: () => void
  onSubmit: () => void
}
const ControlBar = forwardRef<Ref, Props>((props, ref) => {
  const {schedule, displayMode, isActiveSubmit, changeFontSize, onActiveControlMode, onSubmit} = props

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

  const fontSizeButtonIconStyle = useMemo(() => {
    let color = displayMode === 'light' ? '#babfc5' : '#424242'

    if (activeControlMode === 'fontSize') {
      color = displayMode === 'light' ? '#424242' : '#babfc5'
    }
    return [styles.fontSizeButtonIcon, {color}]
  }, [displayMode, activeControlMode])

  const getButtonTextStyle = useCallback(
    (bool: boolean) => {
      let color = displayMode === 'light' ? '#babfc5' : '#424242'

      if (bool) {
        color = displayMode === 'light' ? '#424242' : '#babfc5'
      }

      return [styles.buttonText, {color}]
    },
    [displayMode]
  )

  const submitButtonStyle = useMemo(() => {
    let backgroundColor = displayMode === 'light' ? '#f9f9f9' : '#f9f9f9'

    if (isActiveSubmit) {
      backgroundColor = '#1E90FF'
    }

    return [styles.submitButton, {backgroundColor}]
  }, [displayMode, isActiveSubmit])

  const submitButtonTextStyle = useMemo(() => {
    let color = displayMode === 'light' ? '#babfc5' : '#424242'

    if (isActiveSubmit) {
      color = '#ffffff'
    }

    return [styles.submitButtonText, {color}]
  }, [displayMode, isActiveSubmit])

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
    [activeControlMode, setActiveControlMode]
  )

  const showColorSelectorBottomSheet = useCallback(() => {
    setActiveControlMode(null)
    setShowColorSelectorBottomSheet(true)
    onActiveControlMode()
  }, [setActiveControlMode, setShowColorSelectorBottomSheet, onActiveControlMode])

  // TODO 글자 중앙 정렬 sudo code
  // const handleFixedAlignCenter = React.useCallback(() => {
  //   setIsFixedAlignCenter(!isFixedAlignCenter)
  // }, [isFixedAlignCenter, setIsFixedAlignCenter])

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

  return (
    <View>
      {activeControlMode === 'fontSize' && (
        <Shadow containerStyle={controlViewStyles.container} stretch={true} startColor={shadowColor} distance={15}>
          <View style={[controlViewStyles.wrapper, {backgroundColor: displayMode === 'light' ? '#efefef' : '#0F0F0F'}]}>
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
        </Shadow>
      )}

      <Shadow stretch={true} startColor={shadowColor} distance={30} offset={[0, 20]}>
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

            {/* TODO - 테마 작업 후 추가 예정*/}
            {/*<Pressable style={styles.controlButton} onPress={handleFixedAlignCenter}>*/}
            {/*  <View style={styles.controlButtonWrapper}>*/}
            {/*    <AlignCenterIcon width={24} height={24} stroke={fixedAlignCenterColor} />*/}
            {/*  </View>*/}

            {/*  <Text style={getControlButtonTextStyle(isFixedAlignCenter)}>중앙 맞춤</Text>*/}
            {/*</Pressable>*/}

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
    gap: 20
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#ffffff'
  }
})

export default ControlBar
