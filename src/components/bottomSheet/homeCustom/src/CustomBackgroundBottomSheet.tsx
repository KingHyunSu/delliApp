import {useRef, useMemo, useEffect, useCallback, useState} from 'react'
import {ListRenderItem, StyleSheet, ActivityIndicator, View, Text, Pressable, Image} from 'react-native'
import {BottomSheetBackdropProps, BottomSheetModal, BottomSheetFlatList} from '@gorhom/bottom-sheet'
import CustomBackdrop from './CustomBackdrop'

import {alertState, safeAreaInsetsState, windowDimensionsState} from '@/store/system'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import {useQueryClient} from '@tanstack/react-query'
import {
  useGetBackgroundDetailMutation,
  useGetDownloadedBackgroundList,
  useGetMyBackgroundList,
  useSetDownloadBackground
} from '@/apis/hooks/useProduct'
import RNFetchBlob from 'rn-fetch-blob'
import DownloadIcon from '@/assets/icons/download.svg'

interface Props {
  visible: boolean
  value: DownloadedBackgroundItem | null
  onChange: (value: DownloadedBackgroundItem) => void
  onDismiss: () => void
}
const CustomBackgroundBottomSheet = ({visible, value, onChange, onDismiss}: Props) => {
  const queryClient = useQueryClient()

  const {data: downloadBackgroundList} = useGetDownloadedBackgroundList()
  const {mutateAsync: getMyBackgroundListMutateAsync} = useGetMyBackgroundList()
  const {mutateAsync: getBackgroundDetailMutationAsync} = useGetBackgroundDetailMutation()
  const {mutateAsync: setDownloadBackgroundMutateAsync} = useSetDownloadBackground()

  const customBackgroundBottomSheetRef = useRef<BottomSheetModal>(null)

  const [myBackgroundList, setMyBackgroundList] = useState<MyBackgroundItem[]>([])
  const [isDownLoading, setIsDownLoading] = useState(false)

  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const alert = useSetRecoilState(alertState)

  const imageWidth = useMemo(() => {
    const totalPadding = 40
    const totalGap = 60
    return (windowDimensions.width - totalPadding - totalGap) / 4
  }, [windowDimensions.width])

  const bottomInset = useMemo(() => {
    return 72 + 1 + safeAreaInsets.bottom
  }, [safeAreaInsets.bottom])

  const doDownloadBackground = useCallback(
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

  const downloadBackground = useCallback(
    (id: number) => async () => {
      setIsDownLoading(true)

      const backgroundDetail = await getBackgroundDetailMutationAsync(id)

      await Promise.all([doDownloadBackground(backgroundDetail), delay(1500)])

      await queryClient.invalidateQueries({queryKey: ['downloadBackgroundList']})
    },
    [setIsDownLoading, doDownloadBackground, getBackgroundDetailMutationAsync, queryClient]
  )

  const changeBackground = useCallback(
    (item: MyBackgroundItem) => async () => {
      if (item.product_background_id === value?.background_id) {
        return
      }

      const target = downloadBackgroundList.find(sItem => sItem.background_id === item.product_background_id)

      if (target) {
        onChange(target)
      }
    },
    [value, downloadBackgroundList, onChange]
  )

  useEffect(() => {
    if (visible) {
      customBackgroundBottomSheetRef.current?.present()
    } else {
      customBackgroundBottomSheetRef.current?.dismiss()
    }
  }, [visible])

  useEffect(() => {
    const init = async () => {
      const _myBackgroundList = await getMyBackgroundListMutateAsync()
      setMyBackgroundList(_myBackgroundList)
      // setMyBackgroundList([
      //   ..._myBackgroundList,
      //   ..._myBackgroundList,
      //   ..._myBackgroundList,
      //   ..._myBackgroundList,
      //   ..._myBackgroundList
      // ])
    }

    init()
  }, [getMyBackgroundListMutateAsync, setMyBackgroundList])

  // components
  const getBottomSheetBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => {
      return <CustomBackdrop props={props} onClose={onDismiss} />
    },
    [onDismiss]
  )

  const downloadIcon = useMemo(() => {
    if (isDownLoading) {
      return <ActivityIndicator color="#e8eaed" />
    }

    return <DownloadIcon stroke="#f5f6f8" />
  }, [isDownLoading])

  const getRenderItem: ListRenderItem<MyBackgroundItem> = useCallback(
    ({item}) => {
      const aspectRatio = 1.77

      const isActive = value?.background_id === item.product_background_id
      const isDownloaded = downloadBackgroundList.some(sItem => sItem.background_id === item.product_background_id)

      let handlePress = changeBackground(item)

      if (!isDownloaded) {
        handlePress = downloadBackground(item.product_background_id)
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
        </Pressable>
      )
    },
    [downloadBackgroundList, value, downloadIcon, downloadBackground, imageWidth, changeBackground]
  )

  return (
    <BottomSheetModal
      name="CustomBackground"
      ref={customBackgroundBottomSheetRef}
      snapPoints={['50%', '90%']}
      bottomInset={bottomInset}
      backdropComponent={getBottomSheetBackdrop}
      onDismiss={onDismiss}>
      <View style={styles.container}>
        <BottomSheetFlatList
          data={myBackgroundList}
          renderItem={getRenderItem}
          numColumns={4}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.listColumnWrapper}
        />
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 30,
    gap: 30
  },
  listColumnWrapper: {
    gap: 20
  }
})

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
  }
})

export default CustomBackgroundBottomSheet
