import React from 'react'
import {Platform, Pressable, StyleSheet, View, Text, FlatList} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import ColorPicker, {Panel1, Swatches, OpacitySlider, HueSlider, colorKit} from 'reanimated-color-picker'
import type {returnedResults} from 'reanimated-color-picker'
import Animated, {SharedValue, useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated'
import {Shadow} from 'react-native-shadow-2'
import {trigger} from 'react-native-haptic-feedback'

import {useRecoilState, useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'

import CancelIcon from '@/assets/icons/cancle.svg'
import RefreshIcon from '@/assets/icons/refresh.svg'
import {showColorModalState} from '@/store/modal'

interface Props {
  value: SharedValue<string>
  usedColorList: UsedColor[]
  onChange: (color: string) => void
  onComplete: (color: string) => void
}
interface RenderItem {
  item: UsedColor
}

const shadowOffset: [number, number] = [0, 1]
export default ({value, usedColorList, onChange, onComplete}: Props) => {
  const modalFullHeight = 154.4
  const modalTranslateY = 90
  const [showColorModal, setShowColorModal] = useRecoilState(showColorModalState)
  const windowDimensions = useRecoilValue(windowDimensionsState)

  const [randomKey, setRandomKey] = React.useState(0)

  const randomColorList = React.useMemo(() => {
    return new Array(8).fill('#fff').map(() => colorKit.randomRgbColor().hex())
  }, [randomKey])

  const modalFullWidth = React.useMemo(() => {
    return windowDimensions.width - 32 - 30 - 38
  }, [windowDimensions.width])

  // 모달 크기 및 위치 애니메이션을 위한 shared values
  const modalWidth = useSharedValue(0)
  const modalHeight = useSharedValue(0)
  const translateY = useSharedValue(modalTranslateY)

  // 애니메이션 스타일
  const modalStyle = useAnimatedStyle(() => {
    return {
      ...modalStyles.container,
      width: modalWidth.value,
      // height: 150
      height: modalHeight.value,
      transform: [{translateY: translateY.value}]
    }
  })

  // 모달 토글
  const handleModal = React.useCallback(() => {
    trigger('soft', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    })

    setShowColorModal(!showColorModal)
  }, [showColorModal])

  // 랜덤 색상 변경
  const changeRandomColorList = React.useCallback(() => {
    const date = new Date()

    setRandomKey(date.getTime())
  }, [])

  const keyExtractor = React.useCallback((item: UsedColor, index: number) => {
    return String(index)
  }, [])

  const doChange = React.useCallback(
    (color: returnedResults) => {
      onChange(color.hex)
    },
    [onChange]
  )

  const doComplete = React.useCallback(
    (color: returnedResults) => {
      onComplete(color.hex)
    },
    [onComplete]
  )

  const changeUsedColor = React.useCallback(
    (color: string) => () => {
      onChange(color)
      onComplete(color)
    },
    [onChange, onComplete]
  )

  const renderItem = React.useCallback(
    ({item}: RenderItem) => {
      const style = [modalStyles.item, {backgroundColor: item.color}]
      return <Pressable style={style} onPress={changeUsedColor(item.color)} />
    },
    [changeUsedColor]
  )

  // 모달 애니메이션 제어
  React.useEffect(() => {
    if (showColorModal) {
      modalWidth.value = withTiming(modalFullWidth, {duration: 200})
      modalHeight.value = withTiming(modalFullHeight, {duration: 200})
      translateY.value = withTiming(0, {duration: 200})
    } else {
      modalWidth.value = withTiming(0, {duration: 200})
      modalHeight.value = withTiming(0, {duration: 200})
      translateY.value = withTiming(modalTranslateY, {duration: 200})
    }
  }, [showColorModal])

  return (
    <View>
      <ColorPicker
        value={value.value}
        sliderThickness={22}
        thumbSize={21}
        boundedThumb
        thumbShape="circle"
        thumbInnerStyle={styles.thumbInner}
        onChange={doChange}
        onComplete={doComplete}>
        <Panel1 style={styles.panel} />

        <View style={styles.controlBox}>
          <Shadow startColor="#00000010" distance={2} offset={shadowOffset}>
            <Pressable style={styles.modalButton} onPress={handleModal}>
              {showColorModal ? (
                <CancelIcon stroke="#242933" strokeWidth={2.5} width={18} height={18} />
              ) : (
                <View style={styles.showModalButton}>
                  <View style={showModalButtonIconR} />
                  <View style={showModalButtonIconG} />
                  <View style={showModalButtonIconB} />
                </View>
              )}
            </Pressable>
          </Shadow>

          <View style={styles.controlBarBox}>
            <HueSlider style={styles.controlBar} />
            <OpacitySlider style={styles.controlBar} />
          </View>
        </View>

        <Animated.View style={modalStyle}>
          <View>
            <Text style={modalStyles.label} numberOfLines={1}>
              랜덤 색 추천
            </Text>

            <ScrollView horizontal nestedScrollEnabled contentContainerStyle={modalStyles.scrollInner}>
              <Shadow startColor="#00000010" distance={2} offset={shadowOffset}>
                <Pressable style={modalStyles.refreshButton} onPress={changeRandomColorList}>
                  <RefreshIcon fill="#1E90FF" width={18} height={18} />
                </Pressable>
              </Shadow>

              <Swatches swatchStyle={modalStyles.item} colors={randomColorList} />
            </ScrollView>
          </View>

          <View>
            <Text style={modalStyles.label} numberOfLines={1}>
              사용했던 색상
            </Text>

            {usedColorList.length > 0 ? (
              <FlatList
                data={usedColorList}
                contentContainerStyle={modalStyles.scrollInner}
                horizontal
                nestedScrollEnabled
                keyExtractor={keyExtractor}
                renderItem={renderItem}
              />
            ) : (
              <Text style={modalStyles.emptyText}>데이터 없음</Text>
            )}
          </View>
        </Animated.View>
      </ColorPicker>
    </View>
  )
}

const styles = StyleSheet.create({
  thumbInner: {
    borderWidth: 2,
    borderColor: '#fff'
  },
  panel: {
    borderRadius: 0
  },
  controlBox: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  modalButton: {
    width: 38,
    height: 38,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 19
  },
  showModalButton: {
    flexDirection: 'row',
    gap: 1.5
  },
  showModalButtonIcon: {
    width: 5,
    height: 5,
    borderRadius: 5
  },
  controlBarBox: {
    flex: 1,
    gap: 20
  },
  controlBar: {
    borderRadius: 20
  }
})

const modalStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 130,
    left: 58,
    height: 150,
    borderRadius: 10,
    paddingTop: 15,
    backgroundColor: '#fff',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2
      },
      android: {
        elevation: 3
      }
    })
  },
  label: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#424242',
    paddingLeft: 10,
    marginBottom: 10
  },
  scrollInner: {
    paddingLeft: 10
  },
  item: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 0,
    marginRight: 10,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2
      },
      android: {
        elevation: 2
      }
    })
  },
  refreshButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#eeeded',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#c3c5cc',
    paddingLeft: 10
  }
})

const showModalButtonIconR = StyleSheet.compose(styles.showModalButtonIcon, {backgroundColor: '#fd373c'})
const showModalButtonIconG = StyleSheet.compose(styles.showModalButtonIcon, {backgroundColor: '#62b561'})
const showModalButtonIconB = StyleSheet.compose(styles.showModalButtonIcon, {backgroundColor: '#0d99eb'})
