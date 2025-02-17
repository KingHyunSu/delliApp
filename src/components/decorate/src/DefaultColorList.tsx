import {useCallback} from 'react'
import {ListRenderItem, ViewStyle, StyleSheet, FlatList, Pressable, View} from 'react-native'

const defaultColorList = [
  // other
  '#ffffff',
  '#D9D9D9',
  '#B3B3B3',
  '#8C8C8C',
  '#000000',

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
  '#5C5C5C'

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
  value: string | null
  contentContainerStyle?: ViewStyle
  onChange: (color: string) => void
}
const DefaultColorList = ({value, contentContainerStyle, onChange}: Props) => {
  const changeColor = useCallback(
    (color: string) => () => {
      onChange(color)
    },
    [onChange]
  )

  const getKeyExtractor = useCallback((item: string, index: number) => {
    return index.toString()
  }, [])

  const getRenderItem: ListRenderItem<string> = useCallback(
    ({item}) => {
      if (item) {
        const isActive = value === item

        return (
          <Pressable style={styles.itemWrapper} onPress={changeColor(item)}>
            <View
              style={[styles.itemContents, {backgroundColor: item, borderColor: isActive ? '#ffffff' : '#555555'}]}
            />
          </Pressable>
        )
      }

      return <View style={{width: 42, height: 42}} />
    },
    [value, changeColor]
  )

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      keyExtractor={getKeyExtractor}
      data={defaultColorList}
      numColumns={5}
      renderItem={getRenderItem}
      contentContainerStyle={contentContainerStyle}
    />
  )
}

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 0.2, // 1 / numColumns
    minHeight: 52,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemContents: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 3
  }
})

export default DefaultColorList
