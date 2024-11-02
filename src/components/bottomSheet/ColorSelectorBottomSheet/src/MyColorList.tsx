import {useCallback, useMemo, useState} from 'react'
import {ListRenderItem, ViewStyle, StyleSheet, Pressable, View, TouchableOpacity, Text} from 'react-native'
import {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {Shadow} from 'react-native-shadow-2'
import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {useQueryClient} from '@tanstack/react-query'
import {useDeleteColor} from '@/apis/hooks/useColor'

interface Props {
  activeDeletedItem: Color | null
  color: string
  myColorList: Color[]
  colorButtonStyle: ViewStyle
  activeColorButtonStyle: ViewStyle
  contentContainerStyle: ViewStyle
  columnWrapperStyle: ViewStyle
  closeMenu: () => void
  onItemLongPress: (item: Color) => void
  onChange: (color: string) => void
}

const itemSize = 42
const MyColorList = ({
  activeDeletedItem,
  color,
  myColorList,
  colorButtonStyle,
  activeColorButtonStyle,
  contentContainerStyle,
  columnWrapperStyle,
  closeMenu,
  onItemLongPress,
  onChange
}: Props) => {
  const queryClient = useQueryClient()

  const {mutateAsync: deleteColorMutateAsync} = useDeleteColor()

  const [deleteButtonX, setDeleteButtonX] = useState<number>(-1)
  const [deleteButtonY, setDeleteButtonY] = useState<number>(-1)

  const windowDimensions = useRecoilValue(windowDimensionsState)

  const columnGap = useMemo(() => {
    return (windowDimensions.width - 60 - itemSize * 5) / 4
  }, [windowDimensions.width])

  const handleLongPress = useCallback(
    (item: Color, index: number) => () => {
      onItemLongPress(item)

      const columnIndex = index % 5
      const rowIndex = Math.trunc(index / 5)

      const menuHeight = 42
      const scrollPaddingTop = 20

      if (columnIndex === 0) {
        setDeleteButtonX(columnIndex * (itemSize + columnGap) - 20)
      } else if (columnIndex === 4) {
        setDeleteButtonX(columnIndex * (itemSize + columnGap) - 50)
      } else {
        setDeleteButtonX(columnIndex * (itemSize + columnGap) - 35)
      }
      setDeleteButtonY(rowIndex * (itemSize + 15) - (menuHeight - scrollPaddingTop) - 5)
    },
    [columnGap]
  )

  const changeColor = useCallback(
    (value: string) => () => {
      onChange(value)
    },
    [onChange]
  )

  const handleDelete = useCallback(async () => {
    if (!activeDeletedItem) {
      return
    }

    await deleteColorMutateAsync({color_id: activeDeletedItem.color_id})

    if (color === activeDeletedItem.color) {
      onChange('#ffffff')
    }
    queryClient.invalidateQueries({queryKey: ['colorList']})
    closeMenu()
  }, [activeDeletedItem, color, onChange, deleteColorMutateAsync, queryClient, closeMenu])

  const getKeyExtractor = useCallback((item: Color, index: number) => {
    return index.toString()
  }, [])

  const getRenderItem: ListRenderItem<Color> = useCallback(
    ({item, index}) => {
      if (item.color_id !== -1) {
        const isActive = color === item.color

        return (
          <TouchableOpacity
            style={[colorButtonStyle, {backgroundColor: item.color}]}
            onLongPress={handleLongPress(item, index)}
            onPressIn={changeColor(item.color)}>
            {isActive && <View style={activeColorButtonStyle} />}
          </TouchableOpacity>
        )
      }

      return <View style={{width: itemSize, height: itemSize}} />
    },
    [color, colorButtonStyle, activeColorButtonStyle, handleLongPress, changeColor]
  )

  return (
    <View style={styles.container}>
      {activeDeletedItem && (
        <Shadow containerStyle={[styles.menuContainer, {top: deleteButtonY, left: deleteButtonX}]}>
          <Pressable style={styles.menuButton} onPress={handleDelete}>
            <Text>삭제하기</Text>
          </Pressable>
        </Shadow>
      )}

      <BottomSheetFlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={getKeyExtractor}
        data={myColorList}
        numColumns={5}
        renderItem={getRenderItem}
        contentContainerStyle={contentContainerStyle}
        columnWrapperStyle={columnWrapperStyle}
      />
      {activeDeletedItem && <Pressable style={styles.menuOverlay} onPress={closeMenu} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  menuContainer: {
    position: 'absolute',
    zIndex: 999
  },
  menuButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  }
})

export default MyColorList
