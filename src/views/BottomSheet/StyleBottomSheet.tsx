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

const defaultBackgroundColorList = [
  '#ffffff',
  '#f0c1ca',
  '#f6d3c0',
  '#fff29e',
  '#c2e6da',
  '#cdf0ea',
  '#9bf6ff',
  '#bbcbf4',
  '#c7c7f0'
]

const defaultTextColorList = ['#000000', '#ffffff']

const StyleBottomSheet = () => {
  const {width} = useWindowDimensions()

  const [activeColorType, setActiveColorType] = React.useState<COLOR_TYPE>('background')
  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const [isShowStyleBottomSheet, setIsShowStyleBottomSheet] = useRecoilState(showStyleBottomSheetState)

  const styleBottomSheet = React.useRef<BottomSheetModal>(null)

  const snapPoints = React.useMemo(() => {
    return ['35%', '80%']
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
    gap: 30
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
