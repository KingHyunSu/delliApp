import {useMemo} from 'react'
import {StyleSheet, ScrollView, View, Text, Pressable, Image} from 'react-native'
import HomePreview1 from './components/HomePreview1'
import HomePreview2 from './components/HomePreview2'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'
import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {useGetThemeDetail} from '@/apis/hooks/useProduct'
import {StoreDetailScreenProps} from '@/types/navigation'

const StoreDetail = ({navigation, route}: StoreDetailScreenProps) => {
  const {data: detail} = useGetThemeDetail(route.params.id)

  const windowDimensions = useRecoilValue(windowDimensionsState)

  const itemWidth = useMemo(() => {
    return windowDimensions.width / 2.5
  }, [windowDimensions.width])

  const itemHeight = useMemo(() => {
    const aspectRatio = 1.77
    return itemWidth * aspectRatio
  }, [itemWidth])

  return (
    <View style={styles.container}>
      <View style={appBarStyles.container}>
        <Pressable onPress={navigation.goBack}>
          <ArrowLeftIcon width={28} height={28} stroke="#000000" />
        </Pressable>
      </View>

      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{detail ? detail.title : ''}</Text>
            <Text style={styles.priceText}>무료</Text>
          </View>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>받기</Text>
          </Pressable>
        </View>

        {detail && (
          <ScrollView
            contentContainerStyle={styles.listContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <Image style={{width: itemWidth, height: itemHeight, borderRadius: 10}} source={{uri: detail.thumb_url}} />

            <HomePreview1 data={detail} width={itemWidth} height={itemHeight} />
            <HomePreview2 data={detail} width={itemWidth} height={itemHeight} />
          </ScrollView>
        )}
      </View>
    </View>
  )
}

const appBarStyles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingVertical: 30
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8'
  },
  wrapper: {
    gap: 30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  textContainer: {
    gap: 5
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#000000'
  },
  priceText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#424242'
  },
  button: {
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#ffffff'
  },
  listContainer: {
    gap: 10,
    paddingHorizontal: 20
  }
})

export default StoreDetail
