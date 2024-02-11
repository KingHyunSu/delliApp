import React from 'react'
import {useWindowDimensions, StyleSheet, FlatList, ListRenderItem, View, Text, Pressable} from 'react-native'
import {BottomSheetModal, BottomSheetScrollView, BottomSheetBackdropProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'

import {useRecoilState, useRecoilValue} from 'recoil'
import {scheduleState, colorTypeState} from '@/store/schedule'
import {showColorPickerBottomSheetState} from '@/store/bottomSheet'

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
    return [styles.item, {backgroundColor: item}, activeColor === item && {borderColor: '#BABABA'}]
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

const defaultColorList = [
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
// '#79a2f7',
// '#388e5a'
// '#cdf0ea',
// '#beaee2',
// '#ffee58',
// '#9997ef'

const ColorPickerBottomSheet = () => {
  const {width} = useWindowDimensions()

  const colorType = useRecoilValue(colorTypeState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const [isShow, setIsShow] = useRecoilState(showColorPickerBottomSheetState)

  const colorPickerBottomSheet = React.useRef<BottomSheetModal>(null)

  const snapPoints = React.useMemo(() => {
    return ['35%']
  }, [])
  const itemWidth = React.useMemo(() => {
    return (width - 32) / 5
  }, [width])

  const activeColor = React.useMemo(() => {
    if (colorType === 'background') {
      return schedule.background_color
    } else if (colorType === 'text') {
      return schedule.text_color
    }
    return ''
  }, [colorType, schedule.background_color, schedule.text_color])

  const activeTitle = React.useMemo(() => {
    if (colorType === 'background') {
      return '배경색 선택하기'
    } else if (colorType === 'text') {
      return '글자색 선택하기'
    }
  }, [colorType])

  const handleDismiss = React.useCallback(() => {
    setIsShow(false)
  }, [setIsShow])

  const changeColor = React.useCallback(
    (color: string) => {
      if (colorType === 'background') {
        setSchedule(prevState => ({
          ...prevState,
          background_color: color
        }))
      } else if (colorType === 'text') {
        setSchedule(prevState => ({
          ...prevState,
          text_color: color
        }))
      }
    },
    [colorType, setSchedule]
  )

  const keyExtractor = React.useCallback((item: string) => {
    return item
  }, [])

  React.useEffect(() => {
    if (isShow) {
      colorPickerBottomSheet.current?.present()
    } else {
      colorPickerBottomSheet.current?.dismiss()
    }
  }, [isShow])

  const backdropComponent = React.useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} opacity={0} />
  }, [])

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({item}) => {
      return <ColorItem item={item} wrapperSize={itemWidth} activeColor={activeColor} changeColor={changeColor} />
    },
    [activeColor, changeColor, itemWidth]
  )

  return (
    <BottomSheetModal
      name="colorPicker"
      ref={colorPickerBottomSheet}
      backdropComponent={backdropComponent}
      handleComponent={BottomSheetShadowHandler}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}>
      <BottomSheetScrollView style={styles.container} scrollEnabled={false}>
        {/* <Text style={styles.title}>{activeTitle}</Text> */}
        <FlatList
          data={defaultColorList}
          keyExtractor={keyExtractor}
          numColumns={5}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderItem}
        />
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20
  },
  columnWrapper: {
    paddingHorizontal: 16,
    marginBottom: 20
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    paddingLeft: 16,
    marginBottom: 30
  },
  label: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    paddingLeft: 16,
    marginBottom: 20
  },
  item: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#f5f6f8'
  },
  buttonWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 20
  },
  button: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  closebutton: {
    flex: 1,
    backgroundColor: '#BABABA'
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#1E90FF'
  },
  buttonText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#fff'
  }
})

export default ColorPickerBottomSheet
