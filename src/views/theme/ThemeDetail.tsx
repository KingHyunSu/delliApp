import {useCallback, useMemo, useState} from 'react'
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native'
import SuccessModal from './components/SuccessModal'
import HomePreview1 from './components/HomePreview1'
import HomePreview2 from './components/HomePreview2'
import DownloadProgress from './components/DownloadProgress'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'

import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {useGetBackgroundDetail, useSetDownloadBackground, useSetMyBackground} from '@/apis/hooks/useProduct'
import {ThemeDetailScreenProps} from '@/types/navigation'
import {useQueryClient} from '@tanstack/react-query'
import RNFetchBlob from 'rn-fetch-blob'

const ThemeDetail = ({navigation, route}: ThemeDetailScreenProps) => {
  const queryClient = useQueryClient()

  const {data: detail} = useGetBackgroundDetail(route.params.id)
  const {mutateAsync: setMyBackgroundMutateAsync} = useSetMyBackground()
  const {mutateAsync: setDownloadBackgroundMutateAsync} = useSetDownloadBackground()

  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const windowDimensions = useRecoilValue(windowDimensionsState)

  const isPurchased = useMemo(() => {
    return detail?.purchased
  }, [detail])

  const itemWidth = useMemo(() => {
    return windowDimensions.width / 2.5
  }, [windowDimensions.width])

  const itemHeight = useMemo(() => {
    const aspectRatio = 1.77
    return itemWidth * aspectRatio
  }, [itemWidth])

  const moveMyBackgroundList = useCallback(() => {
    setShowSuccessModal(false)
    navigation.navigate('MyThemeList')
  }, [navigation])

  const handleDownload = useCallback(
    async (value: ProductBackgroundDetail) => {
      try {
        await RNFetchBlob.config({
          fileCache: true,
          path: `${RNFetchBlob.fs.dirs.DocumentDir}/${value.file_name}`
        }).fetch('GET', value.main_url)

        await setDownloadBackgroundMutateAsync({
          background_id: value.product_background_id,
          file_name: value.file_name,
          display_mode: value.display_mode,
          background_color: value.background_color,
          sub_color: value.sub_color,
          accent_color: value.accent_color
        })
      } catch (e) {
        throw e
      }
    },
    [setDownloadBackgroundMutateAsync]
  )

  const handlePurchase = useCallback(async () => {
    if (!detail) {
      return
    }

    try {
      const response = await setMyBackgroundMutateAsync({background_id: detail.product_background_id})

      if (response.result) {
        await handleDownload(detail)
        queryClient.setQueryData(['backgroundDetail', route.params.id], {...detail, purchased: true})

        setShowSuccessModal(true)
      }
    } catch (e) {
      console.error('download error', e)
    }
  }, [detail, route.params.id, queryClient, handleDownload, setMyBackgroundMutateAsync])

  const buttonComponent = useMemo(() => {
    if (!detail) {
      return <></>
    }

    if (!isPurchased && detail.product_background_id !== 1) {
      // if (detail.price_type === 1 && detail.price === 0) {
      return (
        <Pressable style={styles.button} onPress={handlePurchase}>
          <Text style={styles.buttonText}>구매하기</Text>
        </Pressable>
      )
      // }
    }

    return (
      <View style={disabledButtonStyle}>
        <Text style={disabledButtonTextStyle}>구매완료</Text>
      </View>
    )
  }, [detail, isPurchased, handlePurchase])

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

          {buttonComponent}
        </View>

        {detail && (
          <ScrollView
            contentContainerStyle={styles.listContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <Image style={{width: itemWidth, height: itemHeight, borderRadius: 10}} source={{uri: detail.thumb_url}} />

            {/*<HomePreview1 data={detail} width={itemWidth} height={itemHeight} />*/}
            {/*<HomePreview2 data={detail} width={itemWidth} height={itemHeight} />*/}
          </ScrollView>
        )}
      </View>

      <SuccessModal
        visible={showSuccessModal}
        onMove={moveMyBackgroundList}
        onClose={() => setShowSuccessModal(false)}
      />
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
    gap: 40
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
    fontSize: 20,
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
    borderRadius: 10,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#ffffff'
  },
  listContainer: {
    gap: 10,
    paddingHorizontal: 20
  }
})

const disabledButtonStyle = StyleSheet.compose(styles.button, {backgroundColor: '#efefef'})
const disabledButtonTextStyle = StyleSheet.compose(styles.buttonText, {color: '#6B727E'})

export default ThemeDetail
