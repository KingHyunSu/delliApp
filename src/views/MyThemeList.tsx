import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, View, Text, FlatList, ListRenderItem, Pressable, Image, ActivityIndicator} from 'react-native'
import AppBar from '@/components/AppBar'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'
import DownloadIcon from '@/assets/icons/download.svg'
import RNFetchBlob from 'rn-fetch-blob'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {activeBackgroundState, alertState, windowDimensionsState} from '@/store/system'
import {useQueryClient} from '@tanstack/react-query'
import {
  useGetMyBackgroundList,
  useGetDownloadedBackgroundList,
  useGetActiveBackground,
  useGetBackgroundDetailMutation,
  useSetDownloadBackground
} from '@/apis/hooks/useProduct'
import {useUpdateActiveBackgroundId} from '@/apis/hooks/useUser'
import {MyThemeListProps} from '@/types/navigation'

const MyThemeList = ({navigation}: MyThemeListProps) => {
  const queryClient = useQueryClient()

  const {data: downloadBackgroundList} = useGetDownloadedBackgroundList()
  const {mutateAsync: getMyBackgroundListMutateAsync} = useGetMyBackgroundList()
  const {mutateAsync: updateActiveBackgroundIdMutateAsync} = useUpdateActiveBackgroundId()
  const {mutateAsync: getActiveBackgroundMutateAsync} = useGetActiveBackground()
  const {mutateAsync: getBackgroundDetailMutationAsync} = useGetBackgroundDetailMutation()
  const {mutateAsync: setDownloadBackgroundMutateAsync} = useSetDownloadBackground()

  const [myBackgroundList, setMyBackgroundList] = useState<MyBackgroundItem[]>([])
  const [isDownLoading, setIsDownLoading] = useState(false)

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const [activeBackground, setActiveBackground] = useRecoilState(activeBackgroundState)
  const alert = useSetRecoilState(alertState)

  const imageWidth = useMemo(() => {
    const totalPadding = 40
    const totalGap = 20
    return (windowDimensions.width - totalPadding - totalGap) / 3
  }, [windowDimensions.width])

  const moveHome = useCallback(() => {
    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: {scheduleUpdated: false}
    })
  }, [navigation])

  const handleDownload = useCallback(
    async (detail: ProductBackgroundDetail) => {
      try {
        await RNFetchBlob.config({
          fileCache: true,
          path: `${RNFetchBlob.fs.dirs.DocumentDir}/${detail.file_name}`
        }).fetch('GET', detail.main_url)

        await setDownloadBackgroundMutateAsync({
          background_id: detail.product_background_id,
          file_name: detail.file_name,
          display_mode: detail.display_mode,
          background_color: detail.background_color,
          sub_color: detail.sub_color,
          accent_color: detail.accent_color
        })
      } catch (e) {
        throw e
      }
    },
    [setDownloadBackgroundMutateAsync]
  )

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const downloadTheme = useCallback(
    (id: number) => async () => {
      try {
        setIsDownLoading(true)

        const backgroundDetail = await getBackgroundDetailMutationAsync(id)

        await Promise.all([handleDownload(backgroundDetail), delay(1500)])

        await queryClient.invalidateQueries({queryKey: ['downloadBackgroundList']})
      } catch (e) {
        console.error('Download error:', e)
      } finally {
        setIsDownLoading(false)
      }
    },
    [setIsDownLoading, handleDownload, getBackgroundDetailMutationAsync, queryClient]
  )

  const changeActiveTheme = useCallback(
    (id: number) => () => {
      if (id === activeBackground.background_id) {
        return
      }

      alert({
        type: 'primary',
        title: '테마를 변경할까요?',
        confirmButtonText: '변경하기',
        confirmFn: async () => {
          await updateActiveBackgroundIdMutateAsync(id)
          const _activeBackground = await getActiveBackgroundMutateAsync(id)

          setActiveBackground(_activeBackground)
        }
      })
    },
    [
      activeBackground.background_id,
      updateActiveBackgroundIdMutateAsync,
      getActiveBackgroundMutateAsync,
      alert,
      setActiveBackground
    ]
  )

  useEffect(() => {
    const init = async () => {
      const _myBackgroundList = await getMyBackgroundListMutateAsync()
      setMyBackgroundList(_myBackgroundList)
    }

    init()
  }, [getMyBackgroundListMutateAsync, setMyBackgroundList])

  const downloadIcon = useMemo(() => {
    if (isDownLoading) {
      return <ActivityIndicator color="#e8eaed" />
    }

    return <DownloadIcon stroke="#f5f6f8" />
  }, [isDownLoading])

  const getRenderItem: ListRenderItem<MyBackgroundItem> = useCallback(
    ({item}) => {
      const aspectRatio = 1.77

      const isActive = activeBackground.background_id === item.product_background_id
      const isDownloaded = downloadBackgroundList.some(sItem => sItem.background_id === item.product_background_id)

      let handlePress = changeActiveTheme(item.product_background_id)

      if (!isDownloaded) {
        handlePress = downloadTheme(item.product_background_id)
      }
      return (
        <Pressable style={itemStyles.container} onPress={handlePress}>
          <Image
            style={{width: imageWidth, height: imageWidth * aspectRatio, borderRadius: 10}}
            source={{uri: item.thumb_url}}
          />

          {!isDownloaded && (
            <View style={[itemStyles.overlap, {width: imageWidth, height: imageWidth * aspectRatio}]}>
              {downloadIcon}
            </View>
          )}

          {isActive && (
            <View style={itemStyles.activeLabel}>
              <Text style={itemStyles.activeLabelText}>적용중</Text>
            </View>
          )}

          <View style={itemStyles.textContainer}>
            <Text style={itemStyles.title}>{item.title}</Text>
          </View>
        </Pressable>
      )
    },
    [downloadBackgroundList, downloadIcon, activeBackground, downloadTheme, imageWidth, changeActiveTheme]
  )

  return (
    <View style={styles.container}>
      <AppBar color="#f5f6f8">
        <Pressable style={styles.backButton} onPress={moveHome}>
          <ArrowLeftIcon width={28} height={28} stroke="#424242" strokeWidth={3} />
        </Pressable>
      </AppBar>

      <Text style={styles.label}>내 테마</Text>

      <FlatList
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.listColumnWrapper}
        data={myBackgroundList}
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
  activeLabel: {
    position: 'absolute',
    right: 10,
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#1E90FF',
    borderRadius: 20
  },
  activeLabelText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: '#ffffff'
  },

  overlap: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000030',
    borderRadius: 10
  },
  textContainer: {
    paddingLeft: 5
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#424242'
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8'
  },
  backButton: {
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#000000',
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 30
  },
  listContainer: {
    paddingHorizontal: 16
  },
  listColumnWrapper: {
    gap: 10
  }
})

export default MyThemeList
