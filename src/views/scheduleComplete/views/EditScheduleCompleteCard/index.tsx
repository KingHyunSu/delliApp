import {useState, useMemo, useCallback, useEffect, useRef} from 'react'
import {Platform, StyleSheet, View, Pressable, Image, Text, ActivityIndicator} from 'react-native'
import {Shadow} from 'react-native-shadow-2'
import AppBar from '../../components/AppBar'
import EditMenuBottomSheet, {SelectType} from './components/EditMenuBottomSheet'
import ImageCropModal from './components/ImageCropModal'
import EditNoteModal from './components/EditNoteModal'
import {check, request, PermissionStatus, PERMISSIONS, RESULTS} from 'react-native-permissions'
import {launchCamera, launchImageLibrary, Asset} from 'react-native-image-picker'
import {captureRef} from 'react-native-view-shot'
import ImageResizer from '@bam.tech/react-native-image-resizer'

import CropIcon from '@/assets/icons/crop.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import NoteStackIcon from '@/assets/icons/note_stack.svg'

import {useRecoilState, useRecoilValue} from 'recoil'
import {editScheduleCompleteCacheListState} from '@/store/scheduleComplete'
import {windowDimensionsState} from '@/store/system'
import {scheduleDateState, scheduleListState} from '@/store/schedule'
import {useUploadImage} from '@/apis/hooks/useAws'
import {
  useDeleteScheduleCompleteCard,
  useGetScheduleCompleteCardUploadUrl,
  useUpdateScheduleComplete
} from '@/apis/hooks/useScheduleComplete'
import {EditScheduleCompleteCardScreenProps} from '@/types/navigation'
import {UpdateScheduleCompleteResponse} from '@/apis/types/scheduleComplete'

const EditScheduleCompleteCard = ({navigation, route}: EditScheduleCompleteCardScreenProps) => {
  const {mutateAsync: getScheduleCompleteCardUploadUrlMutateAsync} = useGetScheduleCompleteCardUploadUrl()
  const {mutateAsync: uploadImageMutateAsync} = useUploadImage()
  const {mutateAsync: updateScheduleCompleteMutateAsync} = useUpdateScheduleComplete()
  const {mutateAsync: deleteScheduleCompleteCardMutateAsync} = useDeleteScheduleCompleteCard()

  const captureCardRef = useRef<View>(null)

  const [isShowEditMenuBottomSheet, setIsShowEditMenuBottomSheet] = useState(true)
  const [isShowImageCropModal, setIsShowImageCropModal] = useState(false)
  const [isShowEditNoteModal, setIsShowEditNoteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [memo, setMemo] = useState(route.params.memo)

  const [editScheduleCompleteCacheList, setEditScheduleCompleteCacheList] = useRecoilState(
    editScheduleCompleteCacheListState
  )
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const scheduleDate = useRecoilValue(scheduleDateState)

  const cardWidth = useMemo(() => {
    return windowDimensions.width * 0.77
  }, [windowDimensions.width])

  const cardHeight = useMemo(() => {
    return cardWidth * 1.25
  }, [cardWidth])

  const frontCardContainerStyle = useMemo(() => {
    const left = memo ? 12 : 0

    return {width: cardWidth, height: cardHeight, left}
  }, [memo, cardWidth, cardHeight])

  const dateString = useMemo(() => {
    const year = scheduleDate.getFullYear()
    const month = scheduleDate.getMonth() + 1
    const date = scheduleDate.getDate()

    return `${year}년 ${month}월 ${date}일`
  }, [scheduleDate])

  const targetSchedule = useMemo(() => {
    return scheduleList.find(item => item.schedule_id === route.params.schedule_id)
  }, [scheduleList, route.params])

  const handleCamera = useCallback(async () => {
    let permission = null
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA
    }
    if (!permission) return

    const status = await check(permission)
    console.log('status', status)
  }, [])

  const handlePhoto = useCallback(async () => {
    setIsLoading(true)

    let permission = null
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY
    }
    if (!permission) return

    const status = await check(permission)

    if (status === RESULTS.DENIED) {
      await request(permission)
    }

    // setIsShowEditMenuBottomSheet(false)

    const response = await launchImageLibrary({
      presentationStyle: 'overFullScreen',
      mediaType: 'photo',
      selectionLimit: 1
    })

    if (response.didCancel || response.errorCode) {
      setIsLoading(false)
    } else if (response.assets) {
      const asset = response.assets[0]
      const uri = asset.uri
      if (uri) {
        setTempImageUrl(uri)
        setIsShowImageCropModal(true)
      }
    }
  }, [])

  const deleteImage = useCallback(() => {
    setTempImageUrl(null)
    setImageUrl(null)
  }, [])

  const handleCrop = useCallback((url: string) => {
    setIsLoading(false)
    setImageUrl(url)
  }, [])

  const closeImageCropModal = useCallback(() => {
    setIsLoading(false)
    setIsShowImageCropModal(false)
  }, [])

  const changeScheduleCompleteCard = useCallback(
    async (type: SelectType) => {
      setIsShowEditMenuBottomSheet(false)

      switch (type) {
        case 'camera':
          await handleCamera()
          return
        case 'photo':
          await handlePhoto()
          return
        default:
          return
      }
    },
    [handleCamera, handlePhoto]
  )

  const getNewEditScheduleCompleteCacheList = useCallback(
    (newScheduleComplete: UpdateScheduleCompleteResponse) => {
      return editScheduleCompleteCacheList.map(item => {
        if (route.params.schedule_complete_id === item.schedule_complete_id) {
          return {
            ...route.params,
            main_path: newScheduleComplete.main_path,
            thumb_path: newScheduleComplete.thumb_path,
            memo: newScheduleComplete.memo
          }
        }
        return item
      })
    },
    [route.params, editScheduleCompleteCacheList]
  )

  const getResizedImage = async (uri: string, width: number, height: number) => {
    return await ImageResizer.createResizedImage(uri, width, height, 'JPEG', 1)
  }

  const getNewScheduleList = useCallback(
    (newScheduleComplete: UpdateScheduleCompleteResponse) => {
      return scheduleList.map(item => {
        if (route.params.schedule_id === item.schedule_id) {
          return {
            ...item,
            schedule_complete_id: route.params.schedule_complete_id,
            schedule_complete_path: newScheduleComplete.timetable_path,
            schedule_complete_memo: newScheduleComplete.memo
          } as Schedule
        }
        return item
      })
    },
    [route.params, scheduleList]
  )

  const handleSubmit = useCallback(async () => {
    let imageName = null

    if (imageUrl) {
      const contentType = 'image/jpeg'
      imageName = new Date().getTime() + '_' + route.params.schedule_id.toString() + '.jpeg'

      const captureUri = await captureRef(captureCardRef)

      const {main_url, thumb_url, timetable_url} = await getScheduleCompleteCardUploadUrlMutateAsync({
        name: imageName
      })

      const mainImageWidth = 1000
      const mainImageHeight = mainImageWidth * 1.2
      const thumbImageWidth = 400 // TODO - 400? 300?
      const thumbImageHeight = thumbImageWidth * 1.2
      const timetableImageWidth = 100
      const timetableImageHeight = timetableImageWidth * 1.2

      const mainImage = await getResizedImage(captureUri, mainImageWidth, mainImageHeight)
      const thumbImage = await getResizedImage(captureUri, thumbImageWidth, thumbImageHeight)
      const timetableImage = await getResizedImage(captureUri, timetableImageWidth, timetableImageHeight)

      const mainImageData = await fetch(mainImage.uri)
      const thumbImageData = await fetch(thumbImage.uri)
      const timetableImageData = await fetch(timetableImage.uri)

      const mainImageBlob = await mainImageData.blob()
      const thumbImageBlob = await thumbImageData.blob()
      const timetableImageBlob = await timetableImageData.blob()

      await uploadImageMutateAsync({url: main_url, data: mainImageBlob, contentType})
      await uploadImageMutateAsync({url: thumb_url, data: thumbImageBlob, contentType})
      await uploadImageMutateAsync({url: timetable_url, data: timetableImageBlob, contentType})

      // 이미지 변경시 기존 이미지 제거
      if (route.params.main_path) {
        await deleteScheduleCompleteCardMutateAsync({schedule_complete_id: route.params.schedule_complete_id})
      }
    }

    const response = await updateScheduleCompleteMutateAsync({
      schedule_complete_id: route.params.schedule_complete_id,
      complete_date: route.params.complete_date,
      memo: memo || '',
      file_name: imageName
    })

    const newEditScheduleCompleteCacheList = getNewEditScheduleCompleteCacheList(response)
    const newScheduleList = getNewScheduleList(response)

    setEditScheduleCompleteCacheList(newEditScheduleCompleteCacheList)
    setScheduleList(newScheduleList)

    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: {scheduleUpdated: false}
    })
  }, [
    route.params,
    memo,
    imageUrl,
    getNewEditScheduleCompleteCacheList,
    getNewScheduleList,
    uploadImageMutateAsync,
    deleteScheduleCompleteCardMutateAsync,
    updateScheduleCompleteMutateAsync,
    getScheduleCompleteCardUploadUrlMutateAsync,
    setEditScheduleCompleteCacheList,
    setScheduleList,
    navigation
  ])

  return (
    <View style={styles.container}>
      <AppBar title={targetSchedule?.title || ''} completeCount={route.params.complete_count || 0} />

      <View style={styles.wrapper}>
        <View>
          {/* back card */}
          {memo && (
            <View style={[cardStyles.backCardContainer, {width: cardWidth, height: cardHeight}]}>
              <Shadow startColor="#f0eff586" distance={0}>
                <View style={cardStyles.backCardWrapper} />
              </Shadow>
            </View>
          )}

          {/* front card */}
          <View style={frontCardContainerStyle}>
            <Shadow startColor="#e0e0e0" offset={[7, 7]} distance={15}>
              <Pressable style={cardStyles.frontCardWrapper} onPress={() => setIsShowEditMenuBottomSheet(true)}>
                <View style={cardStyles.imageWrapper}>
                  {isLoading ? (
                    <View style={cardStyles.imageLoading}>
                      <ActivityIndicator size="large" />
                    </View>
                  ) : (
                    <Image
                      source={imageUrl ? {uri: imageUrl} : require('@/assets/images/empty.png')}
                      style={cardStyles.image}
                    />
                  )}

                  {imageUrl && (
                    <Shadow containerStyle={cardStyles.deleteButtonWrapper} distance={5}>
                      <Pressable style={cardStyles.deleteButton} onPress={deleteImage}>
                        <DeleteIcon fill="#424242" />
                      </Pressable>
                    </Shadow>
                  )}

                  {imageUrl && (
                    <Shadow containerStyle={cardStyles.cropButtonWrapper} distance={5}>
                      <Pressable style={cardStyles.cropButton} onPress={() => setIsShowImageCropModal(true)}>
                        <CropIcon fill="#424242" />
                      </Pressable>
                    </Shadow>
                  )}
                </View>

                {/* TODO - 손글씨 폰트로 변경하기 */}
                <View style={cardStyles.footer}>
                  <Text style={cardStyles.date}>{dateString}</Text>
                </View>
              </Pressable>
            </Shadow>
          </View>
        </View>
      </View>

      {/* capture card */}
      <View ref={captureCardRef} style={[cardStyles.captureContainer, {width: cardWidth, height: cardHeight}]}>
        <View style={cardStyles.frontCardWrapper}>
          <View style={cardStyles.imageWrapper}>
            <Image
              source={imageUrl ? {uri: imageUrl} : require('@/assets/images/empty.png')}
              style={cardStyles.image}
            />
          </View>

          <View style={cardStyles.footer}>
            <Text style={cardStyles.date}>{dateString}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        {!route.params.memo && (
          <View style={styles.memoInfoWrapper}>
            <View style={styles.memoInfoTail} />
            <Text style={styles.memoInfoText}>기록 남기기</Text>
          </View>
        )}

        <Shadow startColor="#f0eff5" distance={5}>
          <Pressable style={styles.noteButton} onPress={() => setIsShowEditNoteModal(true)}>
            <NoteStackIcon fill="#777" />
          </Pressable>
        </Shadow>
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>만들기</Text>
        </Pressable>
      </View>

      <EditMenuBottomSheet
        visible={isShowEditMenuBottomSheet}
        onSelect={changeScheduleCompleteCard}
        onClose={() => setIsShowEditMenuBottomSheet(false)}
      />
      <ImageCropModal
        visible={isShowImageCropModal}
        sourceUrl={tempImageUrl!}
        onCrop={handleCrop}
        onClose={closeImageCropModal}
      />
      <EditNoteModal
        visible={isShowEditNoteModal}
        value={route.params.memo || ''}
        onChange={setMemo}
        onClose={() => setIsShowEditNoteModal(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0'
    // backgroundColor: '#000000b2'
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    paddingRight: 16,
    paddingTop: 25,
    paddingBottom: 20
  },
  memoInfoWrapper: {
    position: 'absolute',
    top: -13,
    left: 15,
    backgroundColor: '#555',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10
  },
  memoInfoTail: {
    position: 'absolute',
    left: 22,
    bottom: -6,
    borderTopWidth: 10,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 0,
    borderTopColor: '#555',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  memoInfoText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#ffffff'
  },
  noteButton: {
    width: 52,
    height: 52,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100
  },
  submitButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#ffffff'
  }
})

const cardStyles = StyleSheet.create({
  frontCardWrapper: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    paddingTop: 15,
    paddingHorizontal: 15
  },
  backCardContainer: {
    position: 'absolute',
    top: -20,
    left: -8,
    backgroundColor: '#ffffff',
    transform: [{rotate: '-2deg'}]
  },
  backCardWrapper: {
    width: '100%',
    height: '100%'
  },
  captureContainer: {
    position: 'absolute',
    top: 0,
    left: -1000
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1
  },
  imageLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#f0eff586'
  },
  deleteButtonWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 10
  },
  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  cropButtonWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  cropButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5
  },
  date: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#000000'
  }
})

export default EditScheduleCompleteCard
