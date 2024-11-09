import {useCallback, useEffect, useMemo, useState} from 'react'
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native'
import HomePreview1 from './components/HomePreview1'
import HomePreview2 from './components/HomePreview2'
import DownloadProgress from './components/DownloadProgress'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'

import RNFetchBlob from 'rn-fetch-blob'
import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {useGetThemeDetail} from '@/apis/hooks/useProduct'
import {StoreDetailScreenProps} from '@/types/navigation'

const StoreDetail = ({navigation, route}: StoreDetailScreenProps) => {
  const {data: detail} = useGetThemeDetail(route.params.id)

  const [progress, setProgress] = useState<number | null>(null)

  const windowDimensions = useRecoilValue(windowDimensionsState)

  const itemWidth = useMemo(() => {
    return windowDimensions.width / 2.5
  }, [windowDimensions.width])

  const itemHeight = useMemo(() => {
    const aspectRatio = 1.77
    return itemWidth * aspectRatio
  }, [itemWidth])

  const getImageExtensionFromUrl = (url: string) => {
    return url.split('.').pop()
  }

  const handleDownload = useCallback(() => {
    if (!detail) {
      // todo error alert 추가하기
      return null
    }

    let _progress = 0
    const minDuration = 2000 // 최소 1초 지속 시간
    const startTime = Date.now()

    RNFetchBlob.config({
      fileCache: true,
      path: RNFetchBlob.fs.dirs.DocumentDir + '/' + `${detail.theme_id}.${getImageExtensionFromUrl(detail.main_url)}`
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
              clearInterval(interval)
              setProgress(null) // 다운로드 완료 후 진행률 숨김
            } else {
              setProgress(simulatedProgress)
            }
          }, 50) // 1초 동안 100%까지 증가
        } else {
          // 다운로드 시간이 충분히 길 경우 바로 100%로 설정
          setProgress(100)
          setTimeout(() => setProgress(null), 500) // 잠시 후 진행률 숨김
        }
      })
      .catch(e => {
        console.error('error', e)
        setProgress(null)
      })
  }, [detail, setProgress])

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

          {progress === null ? (
            <Pressable style={styles.button} onPress={handleDownload}>
              <Text style={styles.buttonText}>받기</Text>
            </Pressable>
          ) : (
            <DownloadProgress progress={progress} />
          )}
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

export default StoreDetail
