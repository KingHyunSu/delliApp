import {useCallback} from 'react'
import {ListRenderItem, ViewStyle, StyleSheet, View, TouchableOpacity} from 'react-native'
import {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import CheckIcon from '@/assets/icons/check.svg'

interface Props {
  color: string
  myColorList: Color[]
  isActiveDeleteMyColor: boolean
  deleteMyColorList: number[]
  colorButtonStyle: ViewStyle
  activeColorButtonStyle: ViewStyle
  contentContainerStyle: ViewStyle
  columnWrapperStyle: ViewStyle
  onItemLongPress: (item: Color) => void
  onItemPress: (item: Color) => void
}

const itemSize = 42
const MyColorList = ({
  color,
  myColorList,
  isActiveDeleteMyColor,
  deleteMyColorList,
  colorButtonStyle,
  activeColorButtonStyle,
  contentContainerStyle,
  columnWrapperStyle,
  onItemLongPress,
  onItemPress
}: Props) => {
  const getKeyExtractor = useCallback((item: Color, index: number) => {
    return index.toString()
  }, [])

  const getRenderItem: ListRenderItem<Color> = useCallback(
    ({item}) => {
      if (item.schedule_color_id !== -1) {
        const isActive = color === item.color
        const isDelete = deleteMyColorList.some(deleteColorId => item.schedule_color_id === deleteColorId)

        return (
          <TouchableOpacity
            style={[colorButtonStyle, {backgroundColor: item.color}]}
            onPress={() => onItemPress(item)}
            onLongPress={() => onItemLongPress(item)}>
            {!isActiveDeleteMyColor && isActive && <View style={activeColorButtonStyle} />}

            {isActiveDeleteMyColor && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 50,
                  backgroundColor: '#00000050',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                {isDelete && <CheckIcon stroke="#ffffff" strokeWidth={3} width="70%" height="70%" />}
              </View>
            )}
          </TouchableOpacity>
        )
      }

      return <View style={{width: itemSize, height: itemSize}} />
    },
    [
      color,
      isActiveDeleteMyColor,
      deleteMyColorList,
      onItemPress,
      onItemLongPress,
      colorButtonStyle,
      activeColorButtonStyle
    ]
  )

  return (
    <View style={styles.container}>
      <BottomSheetFlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={getKeyExtractor}
        data={myColorList}
        numColumns={5}
        renderItem={getRenderItem}
        contentContainerStyle={contentContainerStyle}
        columnWrapperStyle={columnWrapperStyle}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default MyColorList
