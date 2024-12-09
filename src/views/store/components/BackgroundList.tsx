import {useCallback, useMemo} from 'react'
import {StyleSheet, FlatList, View, Text, Pressable, ListRenderItem, Image} from 'react-native'
import {useGetProductBackgroundList} from '@/apis/hooks/useProduct'
import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'

interface Props {
  moveDetail: (id: number) => void
}
const aspectRatio = 1.7
const StoreBackgroundList = ({moveDetail}: Props) => {
  const {data: productBackgroundList} = useGetProductBackgroundList()

  const windowDimensions = useRecoilValue(windowDimensionsState)

  const imageWidth = useMemo(() => {
    const totalPadding = 40
    const totalGap = 40

    return (windowDimensions.width - totalPadding - totalGap) / 3
  }, [windowDimensions.width])

  const handleMoveDetail = useCallback(
    (id: number) => () => {
      moveDetail(id)
    },
    [moveDetail]
  )

  const getRenderItem: ListRenderItem<ProductBackgroundItem> = useCallback(
    ({item}) => {
      // TODO 나중에 서버에서 제어하기
      const priceText = item.price === 0 ? '무료' : item.price

      return (
        <Pressable style={itemStyles.container} onPress={handleMoveDetail(item.product_background_id)}>
          <Image
            style={{width: imageWidth, height: imageWidth * aspectRatio, borderRadius: 10}}
            source={{uri: item.thumb_url}}
          />

          <View style={itemStyles.textContainer}>
            <Text numberOfLines={1} style={itemStyles.title}>
              {item.title}
            </Text>
            <Text style={itemStyles.priceText}>{priceText}</Text>
          </View>
        </Pressable>
      )
    },
    [imageWidth, handleMoveDetail]
  )

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.listColumnWrapper}
        data={productBackgroundList}
        renderItem={getRenderItem}
        numColumns={3}
      />
    </View>
  )
}

const itemStyles = StyleSheet.create({
  container: {
    gap: 5
  },
  textContainer: {
    gap: 3,
    paddingLeft: 5
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#424242'
  },
  priceText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#424242'
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8'
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 30
  },
  listColumnWrapper: {
    gap: 20
  }
})

export default StoreBackgroundList
