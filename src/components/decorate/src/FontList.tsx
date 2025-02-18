import {useCallback} from 'react'
import {ListRenderItem, StyleSheet, FlatList, Pressable, Text} from 'react-native'

const data: FontType[] = ['Pretendard-Regular', 'Pretendard-Medium', 'Pretendard-SemiBold', 'Pretendard-Bold']

interface Props {
  value: FontType | null
  onChange: (value: FontType) => void
}
const FontList = ({value, onChange}: Props) => {
  const getRenderItem: ListRenderItem<FontType> = useCallback(
    ({item}) => {
      const backgroundColor = value === item ? '#555555' : '#333333'

      return (
        <Pressable style={[styles.item, {backgroundColor}]} onPress={() => onChange(item)}>
          <Text style={[styles.itemText, {fontFamily: item}]}>{item}</Text>
        </Pressable>
      )
    },
    [value, onChange]
  )

  return (
    <FlatList
      data={data}
      renderItem={getRenderItem}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  item: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  itemText: {
    fontSize: 18,
    color: '#ffffff'
  }
})

export default FontList
