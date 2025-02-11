import {useState, useMemo, useCallback, useRef} from 'react'
import {ViewStyle, Platform, StyleSheet, View, Pressable, Image, Text, ActivityIndicator} from 'react-native'
import {Shadow} from 'react-native-shadow-2'
import AppBar from '../../components/AppBar'
import EditMenuBottomSheet, {SelectType} from './components/EditMenuBottomSheet'
import ImageCropModal from '@/components/modal/ImageCropModal'
import ScheduleCompleteRecordModal from '@/components/modal/ScheduleCompleteRecordModal'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {captureRef} from 'react-native-view-shot'
import ImageResizer from '@bam.tech/react-native-image-resizer'

import CropIcon from '@/assets/icons/crop.svg'
import DeleteIcon from '@/assets/icons/delete.svg'

import {useRecoilState, useRecoilValue} from 'recoil'
import {editScheduleCompleteCacheListState} from '@/store/scheduleComplete'
import {activeThemeState, displayModeState, windowDimensionsState} from '@/store/system'
import {scheduleDateState, scheduleListState} from '@/store/schedule'
import {useUploadImage} from '@/apis/hooks/useAws'
import {
  useDeleteScheduleCompleteCard,
  useGetScheduleCompletePhotoCardUploadUrl,
  useUpdateScheduleComplete
} from '@/apis/hooks/useScheduleComplete'
import {EditScheduleCompleteCardScreenProps} from '@/types/navigation'
import {UpdateScheduleCompleteResponse} from '@/apis/types/scheduleComplete'
import {useAlert} from '@/components/Alert'

const EditScheduleCompleteCard = ({navigation, route}: EditScheduleCompleteCardScreenProps) => {
  const alert = useAlert()
  const {mutateAsync: getScheduleCompletePhotoCardUploadUrlMutateAsync} = useGetScheduleCompletePhotoCardUploadUrl()
  const {mutateAsync: uploadImageMutateAsync} = useUploadImage()
  const {mutateAsync: updateScheduleCompleteMutateAsync} = useUpdateScheduleComplete()
  const {mutateAsync: deleteScheduleCompleteCardMutateAsync} = useDeleteScheduleCompleteCard()

  const captureCardRef = useRef<View>(null)

  const [isShowEditMenuBottomSheet, setIsShowEditMenuBottomSheet] = useState(true)
  const [isShowImageCropModal, setIsShowImageCropModal] = useState(false)
  const [isShowEditNoteModal, setIsShowEditNoteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activePhotoCard, setActivePhotoCard] = useState(true)
  const [activeRecordCard, setActiveRecordCard] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [record, setRecord] = useState(route.params.record)

  const [editScheduleCompleteCacheList, setEditScheduleCompleteCacheList] = useRecoilState(
    editScheduleCompleteCacheListState
  )
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const activeTheme = useRecoilValue(activeThemeState)
  const displayMode = useRecoilValue(displayModeState)

  const cardWidth = useMemo(() => {
    return windowDimensions.width * 0.77
  }, [windowDimensions.width])

  const cardHeight = useMemo(() => {
    return cardWidth * 1.25
  }, [cardWidth])

  const containerStyle = useMemo(() => {
    const backgroundColor = displayMode === 1 ? '#e0e0e0' : '#494949'
    return [styles.container, {backgroundColor}]
  }, [displayMode])

  const backCardContainerStyle = useMemo(() => {
    const overlapStyle: ViewStyle | null =
      activePhotoCard && activeRecordCard
        ? {
            position: 'absolute',
            top: -20,
            left: -8,
            transform: [{rotate: '-2deg'}]
          }
        : {}

    return [cardStyles.backCardContainer, {...overlapStyle, width: cardWidth, height: cardHeight}]
  }, [activePhotoCard, activeRecordCard, cardWidth, cardHeight])

  const frontCardContainerStyle = useMemo(() => {
    const left = activePhotoCard && activeRecordCard ? 12 : 0

    return {width: cardWidth, height: cardHeight, left}
  }, [activePhotoCard, activeRecordCard, cardWidth, cardHeight])

  const dateString = useMemo(() => {
    const year = scheduleDate.getFullYear()
    const month = scheduleDate.getMonth() + 1
    const date = scheduleDate.getDate()

    return `${year}년 ${month}월 ${date}일`
  }, [scheduleDate])

  const targetSchedule = useMemo(() => {
    return scheduleList.find(item => item.schedule_id === route.params.schedule_id)
  }, [scheduleList, route.params])

  const showEditRecordCardModal = useCallback(() => {
    if (activePhotoCard) {
      return
    }

    setIsShowEditNoteModal(true)
  }, [activePhotoCard, setIsShowEditNoteModal])

  const handleCamera = useCallback(async () => {
    setIsLoading(true)

    let permission = null
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA
    }
    if (!permission) return

    const status = await check(permission)

    if (status === RESULTS.DENIED) {
      await request(permission)
    }

    const response = await launchCamera({
      presentationStyle: 'overFullScreen',
      mediaType: 'photo'
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
          break
        case 'photo':
          await handlePhoto()
          break
        case 'record':
          setIsShowEditNoteModal(true)
          break
        default:
          break
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
            record: newScheduleComplete.record,
            total: item.total + 1
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
            schedule_complete_record: newScheduleComplete.record,
            schedule_complete_card_path: newScheduleComplete.timetable_path
          } as Schedule
        }
        return item
      })
    },
    [route.params, scheduleList]
  )

  const handleSubmit = useCallback(async () => {
    if (!activePhotoCard && !activeRecordCard) {
      alert.show({
        title: '포토 카드 또는 기록 카드 중\n하나를 추가해 주세요',
        buttons: [
          {
            text: '확인',
            onPress: () => {
              return
            }
          }
        ]
      })
      return
    }

    let imageName = null

    if (imageUrl) {
      const contentType = 'image/jpeg'
      imageName = new Date().getTime() + '_' + route.params.schedule_id.toString() + '.jpeg'

      const captureUri = await captureRef(captureCardRef)

      const {main_url, thumb_url, timetable_url} = await getScheduleCompletePhotoCardUploadUrlMutateAsync({
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
      record: record || '',
      file_name: imageName
    })

    const newEditScheduleCompleteCacheList = getNewEditScheduleCompleteCacheList(response)
    const newScheduleList = getNewScheduleList(response)

    setEditScheduleCompleteCacheList(newEditScheduleCompleteCacheList)
    setScheduleList(newScheduleList)

    navigation.navigate('MainTabs', {
      screen: 'Home'
    })
  }, [
    alert,
    activePhotoCard,
    activeRecordCard,
    route.params,
    record,
    imageUrl,
    getNewEditScheduleCompleteCacheList,
    getNewScheduleList,
    uploadImageMutateAsync,
    deleteScheduleCompleteCardMutateAsync,
    updateScheduleCompleteMutateAsync,
    getScheduleCompletePhotoCardUploadUrlMutateAsync,
    setEditScheduleCompleteCacheList,
    setScheduleList,
    navigation
  ])

  return (
    <View style={containerStyle}>
      <AppBar
        type="edit"
        title={targetSchedule?.title || ''}
        completeCount={route.params.complete_count || 0}
        onSubmit={handleSubmit}
      />

      <View style={styles.wrapper}>
        <View>
          {/* back card */}
          {activeRecordCard && (
            <Pressable style={backCardContainerStyle} onPress={showEditRecordCardModal}>
              {record ? (
                <Text style={cardStyles.recordText}>{record}</Text>
              ) : (
                <View style={cardStyles.editRecordWrapper}>
                  <Text style={cardStyles.editRecordText}>기록 카드 작성하기</Text>
                </View>
              )}
            </Pressable>
          )}

          {/* front card */}
          {activePhotoCard && (
            <View style={frontCardContainerStyle}>
              <Shadow
                style={cardStyles.shadow}
                containerStyle={cardStyles.shadowContainer}
                startColor="#f5f5f5"
                distance={10}
                sides={{start: true, end: false, top: true, bottom: false}}
                corners={{topStart: true, topEnd: false, bottomStart: false, bottomEnd: false}}
                disabled={activePhotoCard && !activeRecordCard}
              />

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
            </View>
          )}

          {/* empty */}
          {!activeRecordCard && !activePhotoCard && (
            <View style={[cardStyles.emptyCardContainer, {width: cardWidth, height: cardHeight}]}>
              <Text style={cardStyles.emptyCardText}>카드를 추가해 주세요</Text>
            </View>
          )}
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

      {/* footer */}
      <View style={[footerStyles.container, {backgroundColor: activeTheme.color5}]}>
        <Pressable
          style={[footerStyles.button, {borderColor: activeTheme.color2}]}
          onPress={() => setActivePhotoCard(!activePhotoCard)}>
          <View style={[footerStyles.mark, {backgroundColor: activePhotoCard ? '#1E90FF' : '#efefef'}]}>
            <View style={footerStyles.innerMark} />
          </View>

          <Text style={[footerStyles.buttonText, {color: activeTheme.color3}]}>포토 카드</Text>
        </Pressable>

        <Pressable
          style={[footerStyles.button, {borderColor: activeTheme.color2}]}
          onPress={() => setActiveRecordCard(!activeRecordCard)}>
          <View style={[footerStyles.mark, {backgroundColor: activeRecordCard ? '#1E90FF' : '#efefef'}]}>
            <View style={footerStyles.innerMark} />
          </View>

          <Text style={[footerStyles.buttonText, {color: activeTheme.color3}]}>기록 카드</Text>
        </Pressable>
      </View>

      <EditMenuBottomSheet
        visible={isShowEditMenuBottomSheet}
        activePhotoCard={activePhotoCard}
        activeRecordCard={activeRecordCard}
        onSelect={changeScheduleCompleteCard}
        onClose={() => setIsShowEditMenuBottomSheet(false)}
      />
      <ImageCropModal
        visible={isShowImageCropModal}
        sourceUrl={tempImageUrl!}
        onCrop={handleCrop}
        onClose={closeImageCropModal}
      />
      <ScheduleCompleteRecordModal
        visible={isShowEditNoteModal}
        value={route.params.record || ''}
        onChange={setRecord}
        onClose={() => setIsShowEditNoteModal(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
    backgroundColor: '#ffffff',
    padding: 15
  },
  emptyCardContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyCardText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#555555'
  },
  shadow: {
    width: '100%',
    height: '100%'
  },
  shadowContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    width: '91%',
    height: '96%'
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
  },
  recordText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#424242'
  },
  editRecordWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editRecordText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#777777'
  }
})

const footerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    paddingRight: 16,
    paddingTop: 25,
    paddingBottom: 20
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: '#efefef',
    borderRadius: 10,
    paddingLeft: 15
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14
  },
  mark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerMark: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#ffffff'
  }
})

export default EditScheduleCompleteCard
