import React from 'react'
import {useWindowDimensions, StyleSheet, FlatList, ListRenderItem, View, Pressable, Text} from 'react-native'
import {BottomSheetModal, BottomSheetScrollView, BottomSheetBackdropProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'

import {useRecoilState} from 'recoil'
import {scheduleState} from '@/store/schedule'
import {showStyleBottomSheetState} from '@/store/bottomSheet'

import {COLOR_TYPE} from '@/utils/types'

interface ColorItemProps {
  item: string
  wrapperSize: number
  activeColor: string
  changeColor: Function
}
const ColorItem = ({item, wrapperSize, activeColor, changeColor}: ColorItemProps) => {
  const containerStyle = React.useMemo(() => {
    return {width: wrapperSize}
  }, [wrapperSize])

  const buttonStyles = React.useMemo(() => {
    return [styles.itemWrapper, {backgroundColor: item}, activeColor === item && {borderColor: '#BABABA'}]
  }, [activeColor, item])

  const handleColorChanged = React.useCallback(() => {
    changeColor(item)
  }, [changeColor, item])

  return (
    <View style={containerStyle}>
      <Pressable style={buttonStyles} onPress={handleColorChanged} />
    </View>
  )
}

const redColorList = ['#FF6666', '#FF8080', '#FF9999', '#FFB2B2', '#FFCCCC']
const orangeColorList = ['#FFA500', '#FFB366', '#FFC199', '#FFD1B3', '#FFE0CC']
const yellowColorList = ['#FFD700', '#FFE04C', '#FFE57F', '#FFEB99', '#FFF0B3']
const greenColorList = ['#09CE20', '#3AD347', '#62DC65', '#8CF281', '#B4F99E']
const blueColorList = ['#0099FF', '#4DB8FF', '#66C8FF', '#7FD9FF', '#99E9FF']
const indigoColorList = ['#001C91', '#0033A6', '#0041B5', '#0050C4', '#0060D4']
const purpleColorList = ['#5E4E97', '#7C6DB1', '#9782C5', '#B094D9', '#C6A8ED']
const blackColorList = ['#111111', '#222222', '#333333', '#444444', '#555555']
// const blackColorList = ['#101B3F', '#343434']

const defaultBackgroundColorList = [
  ...redColorList,
  ...orangeColorList,
  ...yellowColorList,
  ...greenColorList,
  ...blueColorList,
  ...indigoColorList,
  ...purpleColorList,
  ...blackColorList
]

const defaultTextColorList = ['#424242', '#ffffff']

const StyleBottomSheet = () => {
  const {width} = useWindowDimensions()

  const [activeColorType, setActiveColorType] = React.useState<COLOR_TYPE>('background')
  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const [isShowStyleBottomSheet, setIsShowStyleBottomSheet] = useRecoilState(showStyleBottomSheetState)

  const styleBottomSheet = React.useRef<BottomSheetModal>(null)

  const snapPoints = React.useMemo(() => {
    return ['35%', '85%']
  }, [])

  const itemWidth = React.useMemo(() => {
    return (width - 32) / 5
  }, [width])

  const backgroundColorButton = React.useMemo(() => {
    return [styles.colorButton, activeColorType === 'background' && styles.activeColorWrapper]
  }, [activeColorType])

  const textColorButton = React.useMemo(() => {
    return [styles.colorButton, activeColorType === 'text' && styles.activeColorWrapper]
  }, [activeColorType])

  const backgroundColorPickStyle = React.useMemo(() => {
    return [styles.color, {backgroundColor: schedule.background_color}]
  }, [schedule.background_color])

  const textColorPickStyle = React.useMemo(() => {
    return [styles.color, {backgroundColor: schedule.text_color}]
  }, [schedule.text_color])

  const colorList = React.useMemo(() => {
    if (activeColorType === 'background') {
      return defaultBackgroundColorList
    } else if (activeColorType === 'text') {
      return defaultTextColorList
    }
    return ''
  }, [activeColorType])

  const activeColor = React.useMemo(() => {
    if (activeColorType === 'background') {
      return schedule.background_color
    } else if (activeColorType === 'text') {
      return schedule.text_color
    }
    return ''
  }, [activeColorType, schedule.background_color, schedule.text_color])

  const handleDismiss = React.useCallback(() => {
    setIsShowStyleBottomSheet(false)
  }, [setIsShowStyleBottomSheet])

  const activeBackgroundStyleBottomSheet = React.useCallback(() => {
    setActiveColorType('background')
  }, [setActiveColorType])

  const activeTextStyleBottomSheet = React.useCallback(() => {
    setActiveColorType('text')
  }, [setActiveColorType])

  const changeColor = React.useCallback(
    (color: string) => {
      if (activeColorType === 'background') {
        setSchedule(prevState => ({
          ...prevState,
          background_color: color
        }))
      } else if (activeColorType === 'text') {
        setSchedule(prevState => ({
          ...prevState,
          text_color: color
        }))
      }
    },
    [activeColorType, setSchedule]
  )

  React.useEffect(() => {
    if (isShowStyleBottomSheet) {
      styleBottomSheet.current?.present()
    } else {
      styleBottomSheet.current?.dismiss()
    }
  }, [isShowStyleBottomSheet])

  const backdropComponent = React.useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} opacity={0} />
  }, [])

  const keyExtractor = React.useCallback((item: string) => {
    return item
  }, [])

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({item}) => {
      return <ColorItem item={item} wrapperSize={itemWidth} activeColor={activeColor} changeColor={changeColor} />
    },
    [activeColor, changeColor, itemWidth]
  )

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
          <View style={styles.colorContainer}>
            <Pressable style={backgroundColorButton} onPress={activeBackgroundStyleBottomSheet}>
              <Text style={styles.colorLabel}>배경색</Text>
              <View style={backgroundColorPickStyle} />
            </Pressable>

            <Pressable style={textColorButton} onPress={activeTextStyleBottomSheet}>
              <Text style={styles.colorLabel}>글자색</Text>
              <View style={textColorPickStyle} />
            </Pressable>
          </View>

          <FlatList
            data={colorList}
            keyExtractor={keyExtractor}
            numColumns={5}
            scrollEnabled={false}
            columnWrapperStyle={styles.item}
            renderItem={renderItem}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 50
  },
  colorContainer: {
    flexDirection: 'row',
    gap: 10
  },
  colorButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    height: 52,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f5f6f8'
  },
  colorLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#7c8698'
  },
  activeColorWrapper: {
    borderColor: '#1E90FF'
  },
  color: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'skyblue',
    borderWidth: 1,
    borderColor: '#e6e7e9'
  },
  item: {
    paddingHorizontal: 16,
    marginBottom: 20
  },
  itemWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#f5f6f8'
  }
})

export default StyleBottomSheet
