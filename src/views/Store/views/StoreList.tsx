import {useCallback, useMemo} from 'react'
import {StyleSheet, FlatList, View, Text, Image, Pressable, ListRenderItem} from 'react-native'
import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {useGetThemeList} from '@/apis/hooks/useProduct'
import {StoreListScreenProps} from '@/types/navigation'

const aspectRatio = 1.77
const StoreList = ({navigation}: StoreListScreenProps) => {
  const {data: themeList} = useGetThemeList()
  const windowDimensions = useRecoilValue(windowDimensionsState)

  const imageWidth = useMemo(() => {
    const totalPadding = 40
    const totalGap = 20
    return (windowDimensions.width - totalPadding - totalGap) / 3
  }, [windowDimensions.width])

  const moveDetail = useCallback(
    (id: number) => () => {
      navigation.navigate('StoreDetail', {id})
    },
    [navigation]
  )

  const getRenderItem: ListRenderItem<ThemeListItem> = useCallback(
    ({item}) => {
      // TODO 나중에 서버에서 제어하기
      const priceText = item.price === 0 ? '무료' : item.price

      return (
        <Pressable style={itemStyles.container} onPress={moveDetail(item.theme_id)}>
          <Image
            style={{width: imageWidth, height: imageWidth * aspectRatio, borderRadius: 10}}
            source={{uri: item.thumb_url}}
          />
          <View style={itemStyles.textContainer}>
            <Text style={itemStyles.title}>{item.title}</Text>
            <Text style={itemStyles.priceText}>{priceText}</Text>
          </View>
        </Pressable>
      )
    },
    [imageWidth, moveDetail]
  )

  return (
    <View style={styles.container}>
      <View style={appBarStyles.container}>
        <Text style={appBarStyles.title}>상점</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.listColumnWrapper}
        data={themeList}
        renderItem={getRenderItem}
        numColumns={3}
      />
    </View>
  )
}

const appBarStyles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingVertical: 30
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#000000'
  }
})

const itemStyles = StyleSheet.create({
  container: {
    gap: 5
  },
  textContainer: {
    gap: 0,
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
    gap: 10
  }
})

export default StoreList
