import React from 'react'
import {StyleSheet, ViewStyle, TextStyle, Text, View} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue} from 'react-native-reanimated'
import Panel from '@/components/Panel'
import ColorPicker from '@/components/ColorPicker'
import {useSetRecoilState} from 'recoil'
import {showColorModalState} from '@/store/modal'
import {scheduleRepository} from '@/repository'

interface Props {
  value: boolean
  isEdit: boolean
  data: Schedule
  itemPanelHeight: number
  headerContainerStyle: ViewStyle
  headerLabelStyle: TextStyle
  itemHeaderContainerStyle: ViewStyle
  itemHeaderLabelStyle: TextStyle
  handleExpansion: () => void
  changeBackgroundColor: (color: string) => void
  changeTextColor: (color: string) => void
}
const ColorPanel = ({
  value,
  isEdit,
  data,
  itemPanelHeight,
  headerContainerStyle,
  headerLabelStyle,
  itemHeaderContainerStyle,
  itemHeaderLabelStyle,
  handleExpansion,
  changeBackgroundColor,
  changeTextColor
}: Props) => {
  const panelItemContentsHeight = 304
  const [activeColorPanelItemIndex, setActiveColorPanelItemIndex] = React.useState(0)
  const [usedBackgroundColorList, setUsedBackgroundColorList] = React.useState<UsedColor[]>([])
  const [usedTextColorList, setUsedTextColorList] = React.useState<UsedColor[]>([])

  const setShowColorModal = useSetRecoilState(showColorModalState)

  const backgroundColor = useSharedValue(data.background_color)
  const textColor = useSharedValue(data.text_color)

  const backgroundColorAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value
  }))
  const textColorAnimatedStyle = useAnimatedStyle(() => ({
    color: textColor.value
  }))
  const previewTextColorAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: textColor.value
  }))

  const previewColorBox = React.useMemo(() => {
    return [styles.previewColorBox, backgroundColorAnimatedStyle]
  }, [])

  const previewColorBoxText = React.useMemo(() => {
    return [
      {
        fontSize: 14,
        fontFamily: 'Pretendard-Medium'
      },
      textColorAnimatedStyle
    ]
  }, [])

  const previewBackgroundColorCircle = React.useMemo(() => {
    return [styles.previewColorCircle, backgroundColorAnimatedStyle]
  }, [])

  const previewTextColorCircle = React.useMemo(() => {
    return [styles.previewColorCircle, previewTextColorAnimatedStyle]
  }, [])

  const handleBackgroundColorPanel = React.useCallback(() => {
    setShowColorModal(false)
    setActiveColorPanelItemIndex(0)
  }, [setShowColorModal])

  const handleTextColorPanel = React.useCallback(() => {
    setShowColorModal(false)
    setActiveColorPanelItemIndex(1)
  }, [setShowColorModal])

  const _changeBackgroundColor = React.useCallback((color: string) => {
    backgroundColor.value = color
  }, [])

  const _changeTextColor = React.useCallback((color: string) => {
    textColor.value = color
  }, [])

  React.useEffect(() => {
    if (!value) {
      setActiveColorPanelItemIndex(0)
    }
  }, [value])

  React.useEffect(() => {
    const getColorList = async () => {
      const backgroundColorList = await scheduleRepository.getBackgroundColorList()
      const textColorList = await scheduleRepository.getTextColorList()

      setUsedBackgroundColorList(backgroundColorList)
      setUsedTextColorList(textColorList)
    }

    if (isEdit) {
      getColorList()
    }
  }, [isEdit])

  // components
  const headerComponent = React.useMemo(() => {
    return (
      <View style={headerContainerStyle}>
        <Text style={headerLabelStyle}>색상</Text>
        <Animated.View style={previewColorBox}>
          <Animated.Text style={previewColorBoxText}>일정명</Animated.Text>
        </Animated.View>
      </View>
    )
  }, [])

  const backgroundColorPanelHeaderComponent = React.useMemo(() => {
    return (
      <View style={[itemHeaderContainerStyle, {borderTopWidth: 0}]}>
        <Text style={itemHeaderLabelStyle}>배경색</Text>

        <Animated.View style={previewBackgroundColorCircle} />
      </View>
    )
  }, [])

  const backgroundColorPanelContentsComponent = React.useMemo(() => {
    return (
      <ColorPicker
        value={backgroundColor}
        usedColorList={usedBackgroundColorList}
        onChange={_changeBackgroundColor}
        onComplete={changeBackgroundColor}
      />
    )
  }, [])

  const textColorPanelHeaderComponent = React.useMemo(() => {
    return (
      <View style={itemHeaderContainerStyle}>
        <Text style={itemHeaderLabelStyle}>글자색</Text>

        <Animated.View style={previewTextColorCircle} />
      </View>
    )
  }, [])

  const textColorPanelContentsComponent = React.useMemo(() => {
    return (
      <ColorPicker
        value={textColor}
        usedColorList={usedTextColorList}
        onChange={_changeTextColor}
        onComplete={changeTextColor}
      />
    )
  }, [])

  return (
    <Panel
      type="container"
      value={value}
      contentsHeight={itemPanelHeight * 2 + panelItemContentsHeight + 3}
      handleExpansion={handleExpansion}
      headerComponent={headerComponent}
      contentsComponent={
        <View>
          {/* 배경색 */}
          <Panel
            type="item"
            value={activeColorPanelItemIndex === 0}
            headerHeight={itemPanelHeight}
            contentsHeight={panelItemContentsHeight}
            handleExpansion={handleBackgroundColorPanel}
            headerComponent={backgroundColorPanelHeaderComponent}
            contentsComponent={backgroundColorPanelContentsComponent}
          />

          {/* 글자색 */}
          <Panel
            type="item"
            value={activeColorPanelItemIndex === 1}
            headerHeight={itemPanelHeight}
            contentsHeight={panelItemContentsHeight}
            handleExpansion={handleTextColorPanel}
            headerComponent={textColorPanelHeaderComponent}
            contentsComponent={textColorPanelContentsComponent}
          />
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  previewColorBox: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#f5f6f8'
  },
  previewColorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f5f6f8'
  }
})

export default ColorPanel
