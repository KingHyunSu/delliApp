import {useCallback, useMemo, useState} from 'react'
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import HomePreview1 from './components/HomePreview1'
import HomePreview2 from './components/HomePreview2'
import DownloadProgress from './components/DownloadProgress'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'

import {useRecoilState, useRecoilValue} from 'recoil'
import {activeThemeState, windowDimensionsState} from '@/store/system'
import {
  useGetActiveTheme,
  useGetDownloadThemeList,
  useGetThemeDetail,
  useSetMyTheme,
  useSetTheme
} from '@/apis/hooks/useProduct'
import {useUpdateTheme} from '@/apis/hooks/useUser'
import {ThemeDetailScreenProps} from '@/types/navigation'
import {useQueryClient} from '@tanstack/react-query'

const ThemeDetail = ({navigation, route}: ThemeDetailScreenProps) => {
  const queryClient = useQueryClient()

  const {data: downloadThemeList} = useGetDownloadThemeList()
  const {mutate: setThemeMutate} = useSetTheme()
  const {mutateAsync: setMyThemeMutateAsync} = useSetMyTheme()
  const {mutateAsync: updateThemeMutateAsync} = useUpdateTheme()
  const {mutateAsync: getActiveThemeMutateAsync} = useGetActiveTheme()

  const {data: detail} = useGetThemeDetail(route.params.id)

  const [progress, setProgress] = useState<number | null>(null)

  const [activeTheme, setActiveTheme] = useRecoilState(activeThemeState)
  const windowDimensions = useRecoilValue(windowDimensionsState)

  const isPurchased = useMemo(() => {
    return detail?.purchased
  }, [detail])

  const isUsed = useMemo(() => {
    return activeTheme.theme_id === detail?.theme_id
  }, [activeTheme.theme_id, detail])

  const isDownloaded = useMemo(() => {
    if (!downloadThemeList || downloadThemeList.length === 0) {
      return false
    }

    return downloadThemeList.some(item => item.theme_id === detail?.theme_id)
  }, [downloadThemeList, detail])

  const itemWidth = useMemo(() => {
    return windowDimensions.width / 2.5
  }, [windowDimensions.width])

  const itemHeight = useMemo(() => {
    const aspectRatio = 1.77
    return itemWidth * aspectRatio
  }, [itemWidth])

  const handleDownload = useCallback(() => {
    if (!detail) {
      // todo error alert 추가하기
      return null
    }

    let _progress = 0
    const minDuration = 2000 // 최소 1초 지속 시간
    const startTime = Date.now()

    setThemeMutate({
      theme_id: detail.theme_id,
      file_name: detail.file_name,
      color1: detail.color1,
      color2: detail.color2,
      color3: detail.color3,
      color4: detail.color4,
      color5: detail.color5,
      color6: detail.color6,
      color7: detail.color7,
      color8: detail.color8,
      display_mode: detail.display_mode
    })

    RNFetchBlob.config({
      fileCache: true,
      path: `${RNFetchBlob.fs.dirs.DocumentDir}/${detail.file_name}`
    })
      .fetch('GET', detail.main_url)
      .progress({count: 10}, (received, total) => {
        const progressValue = (received / total) * 100

        setProgress(progressValue)
        _progress = progressValue
      })
      .then(res => {
        const elapsedTime = Date.now() - startTime

        if (elapsedTime < minDuration) {
          // 다운로드가 너무 빨리 끝났을 경우, 1초 동안 점진적 진행률 증가
          let simulatedProgress = _progress > 70 ? 0 : _progress // 현재 진행률부터 시작

          const interval = setInterval(() => {
            simulatedProgress += 5

            if (simulatedProgress >= 100) {
              queryClient.invalidateQueries({queryKey: ['downloadThemeList']})
              setProgress(null) // 다운로드 완료 후 진행률 숨김
              clearInterval(interval)
            } else {
              setProgress(simulatedProgress)
            }
          }, 50) // 1초 동안 100%까지 증가
        } else {
          // 다운로드 시간이 충분히 길 경우 바로 100%로 설정
          setProgress(100)

          setTimeout(() => {
            queryClient.invalidateQueries({queryKey: ['downloadThemeList']})
            setProgress(null)
          }, 500) // 잠시 후 진행률 숨김
        }
      })
      .catch(e => {
        console.error('error', e)
        setProgress(null)
      })
  }, [detail, setProgress])

  const handleSetMyTheme = useCallback(async () => {
    if (detail?.theme_id) {
      const response = await setMyThemeMutateAsync({theme_id: detail.theme_id})

      if (response.result) {
        queryClient.setQueryData(['themeDetail', route.params.id], {...detail, purchased: true})
        handleDownload()
      }
    }
  }, [detail?.theme_id, handleDownload, setMyThemeMutateAsync])

  const handleApply = useCallback(async () => {
    if (!detail) {
      return
    }

    await updateThemeMutateAsync(detail.theme_id)
    const themeDetail = await getActiveThemeMutateAsync(detail.theme_id)

    setActiveTheme(themeDetail)
    navigation.navigate('MainTabs', {screen: 'Home'})
  }, [detail, updateThemeMutateAsync, getActiveThemeMutateAsync, navigation, setActiveTheme])

  const buttonComponent = useMemo(() => {
    if (!detail) {
      return <></>
    }

    if (!isPurchased && detail.theme_id !== 1) {
      if (detail.price_type === 1 && detail.price === 0) {
        return (
          <Pressable style={styles.button} onPress={handleSetMyTheme}>
            <Text style={styles.buttonText}>받기</Text>
          </Pressable>
        )
      }

      return (
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>구입</Text>
        </Pressable>
      )
    }

    if (isUsed) {
      return (
        <View style={disabledButtonStyle}>
          <Text style={disabledButtonTextStyle}>적용중</Text>
        </View>
      )
    }

    if (isDownloaded) {
      return (
        <Pressable style={styles.button} onPress={handleApply}>
          <Text style={styles.buttonText}>적용</Text>
        </Pressable>
      )
    }

    if (progress) {
      return <DownloadProgress progress={progress} />
    } else {
      return (
        <Pressable style={styles.button} onPress={handleDownload}>
          <Text style={styles.buttonText}>받기</Text>
        </Pressable>
      )
    }
  }, [isUsed, isDownloaded, progress, handleDownload])

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
