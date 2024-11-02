import {useCallback} from 'react'
import {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {ListRenderItem, Pressable, View, ViewStyle} from 'react-native'

const defaultColorList = [
  // red
  '#FFCBCB',
  '#FF8A8A',
  '#FF7F7F',
  '#FF6E6E',
  '#FF5C5C',

  // orange
  '#FFD9B3',
  '#FFD1B3',
  '#FFAD7A',
  '#FF9C66',
  '#FF8866',

  // yellow
  // '#FFF0B3', // 유료 색상
  '#FFF5B2',
  '#FFF2A1',
  '#FFEB84',
  '#FFE680',
  '#FFDE70',

  // green
  '#D4FFB3',
  '#B4F99E',
  '#A5E88F',
  '#94DA82',
  '#85C973',

  // blue
  '#CCF2FF',
  '#99E4FE',
  '#66D5FD',
  '#33C4FC',
  '#02AEFA',

  // navy
  '#A2B9E0',
  '#91A8D0',
  '#7F94BF',
  '#6C83AF',
  '#5A729F',

  // purple
  '#D1B3FF',
  '#CDA5E8',
  '#B28AC6',
  '#A37ABF',
  '#8F67A9',

  // black
  '#A9A9A9',
  '#8E8E8E',
  '#7D7D7D',
  '#6E6E6E',
  '#5C5C5C',

  // other
  '#ffffff',
  '#000000',
  '',
  '',
  ''

  // '#f59ed3',
  // '#f2f2a6',
  // '#a6e3f5',
  // '#b1f7de',
  // '#c2ffb6',
  // '#99e6d0',
  // '#60daa8',
  // '#acacf4',
  // '#7294f4',
  // '#6c5cd7',
  // '#160b61',
  // '#B3C7FF',
  // '#E5B3FF'
]

interface Props {
  color: string
  colorButtonStyle: ViewStyle
  activeColorButtonStyle: ViewStyle
  contentContainerStyle: ViewStyle
  columnWrapperStyle: ViewStyle
  onChange: (color: string) => void
}
const DefaultColorList = ({
  color,
  colorButtonStyle,
  activeColorButtonStyle,
  contentContainerStyle,
  columnWrapperStyle,
  onChange
}: Props) => {
  const changeColor = useCallback(
    (value: string) => () => {
      onChange(value)
    },
    [onChange]
  )

  const getKeyExtractor = useCallback((item: string, index: number) => {
    return index.toString()
  }, [])

  const getRenderItem: ListRenderItem<string> = useCallback(
    ({item}) => {
      if (item) {
        const isActive = color === item

        return (
          <Pressable style={[colorButtonStyle, {backgroundColor: item}]} onPress={changeColor(item)}>
            {isActive && <View style={activeColorButtonStyle} />}
          </Pressable>
        )
      }

      return <View style={{width: 42, height: 42}} />
    },
    [color, colorButtonStyle, activeColorButtonStyle, changeColor]
  )

  return (
    <BottomSheetFlatList
      showsVerticalScrollIndicator={false}
      keyExtractor={getKeyExtractor}
      data={defaultColorList}
      numColumns={5}
      renderItem={getRenderItem}
      contentContainerStyle={contentContainerStyle}
      columnWrapperStyle={columnWrapperStyle}
    />
  )
}

export default DefaultColorList
