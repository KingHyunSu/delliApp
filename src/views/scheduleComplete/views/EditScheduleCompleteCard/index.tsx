import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'
import AppBar from '../../components/AppBar'
import EditScheduleCompleteCardMenuBottomSheet from './components/EditScheduleCompleteCardMenuBottomSheet'
import ScheduleCompleteCard from '@/components/ScheduleCompleteCard'
import ScheduleCompleteRecordModal from '@/components/modal/ScheduleCompleteRecordModal'
import {useAlert} from '@/components/Alert'

import {getResizedImage, getUriToBlob} from '@/utils/helper'
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil'
import {
  editScheduleCompleteCacheListState,
  editScheduleCompleteCardFormState,
  editScheduleCompletePhotoCardFormState
} from '@/store/scheduleComplete'
import {activeThemeState, displayModeState} from '@/store/system'
import {scheduleListState} from '@/store/schedule'
import {useUploadImage} from '@/apis/hooks/useAws'
import {
  useDeleteScheduleCompleteCard,
  useGetScheduleCompletePhotoCardUploadUrl,
  useUpdateScheduleCompleteCard
} from '@/apis/hooks/useScheduleComplete'
import {EditScheduleCompleteCardScreenProps} from '@/types/navigation'
import {UpdateScheduleCompleteCardResponse} from '@/apis/types/scheduleComplete'

const EditScheduleCompleteCard = ({navigation, route}: EditScheduleCompleteCardScreenProps) => {
  const alert = useAlert()
  const {mutateAsync: getScheduleCompletePhotoCardUploadUrlMutateAsync} = useGetScheduleCompletePhotoCardUploadUrl()
  const {mutateAsync: uploadImageMutateAsync} = useUploadImage()
  const {mutateAsync: updateScheduleCompleteCardMutateAsync} = useUpdateScheduleCompleteCard()
  const {mutateAsync: deleteScheduleCompleteCardMutateAsync} = useDeleteScheduleCompleteCard()

  const [isShowEditScheduleCompleteCardMenu, setIsShowEditScheduleCompleteCardMenu] = useState(false)
  const [isShowEditNoteModal, setIsShowEditNoteModal] = useState(false)
  const [_imageUrl, _setImageUrl] = useState<string | null>(null)
  const [_record, _setRecord] = useState(route.params.record)

  const [editScheduleCompleteCardForm, setEditScheduleCompleteCardForm] = useRecoilState(
    editScheduleCompleteCardFormState
  )
  const [editScheduleCompleteCacheList, setEditScheduleCompleteCacheList] = useRecoilState(
    editScheduleCompleteCacheListState
  )
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)

  const activeTheme = useRecoilValue(activeThemeState)
  const displayMode = useRecoilValue(displayModeState)
  const resetEditScheduleCompleteCardForm = useResetRecoilState(editScheduleCompleteCardFormState)
  const resetEditScheduleCompletePhotoCardForm = useResetRecoilState(editScheduleCompletePhotoCardFormState)

  const containerStyle = useMemo(() => {
    const backgroundColor = displayMode === 1 ? '#e0e0e0' : '#494949'
    return [styles.container, {backgroundColor}]
  }, [displayMode])

  const targetSchedule = useMemo(() => {
    return scheduleList.find(item => item.schedule_id === route.params.schedule_id)
  }, [scheduleList, route.params])

  const changeScheduleCompleteRecord = useCallback(
    (value: string) => {
      setEditScheduleCompleteCardForm(prevState => ({
        ...prevState,
        record: value
      }))
    },
    [setEditScheduleCompleteCardForm]
  )

  const pressCard = useCallback(() => {
    if (_imageUrl && _record) {
      setIsShowEditScheduleCompleteCardMenu(true)
    } else if (_imageUrl) {
      navigation.navigate('EditScheduleCompletePhotoCard')
    } else if (_record) {
      setIsShowEditNoteModal(true)
    }
  }, [_imageUrl, _record, navigation])

  const handlePhotoCardSelected = useCallback(() => {
    if (_imageUrl) {
      _setImageUrl(null)
    } else {
      if (editScheduleCompleteCardForm.imageUrl) {
        _setImageUrl(editScheduleCompleteCardForm.imageUrl)
      } else {
        navigation.navigate('EditScheduleCompletePhotoCard')
      }
    }
  }, [_imageUrl, editScheduleCompleteCardForm.imageUrl, navigation])

  const handleRecordCardSelected = useCallback(() => {
    if (_record) {
      _setRecord(null)
    } else {
      if (editScheduleCompleteCardForm.record) {
        _setRecord(editScheduleCompleteCardForm.record)
      } else {
        setIsShowEditNoteModal(true)
      }
    }
  }, [_record, editScheduleCompleteCardForm.record])

  const selectEditScheduleCompleteCardMenu = useCallback(
    (type: 'photo' | 'record') => {
      switch (type) {
        case 'photo':
          navigation.navigate('EditScheduleCompletePhotoCard')
          break
        case 'record':
          setIsShowEditNoteModal(true)
          break
        default:
          break
      }
    },
    [navigation]
  )

  const getNewEditScheduleCompleteCacheList = useCallback(
    (newScheduleComplete: UpdateScheduleCompleteCardResponse) => {
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

  const getNewScheduleList = useCallback(
    (newScheduleComplete: UpdateScheduleCompleteCardResponse) => {
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
    if (!_imageUrl && !_record) {
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

    if (_imageUrl) {
      imageName = new Date().getTime() + '_' + route.params.schedule_id.toString() + '.jpeg'
      const contentType = 'image/jpeg'

      const mainImageWidth = 1000
      const mainImageHeight = mainImageWidth * 1.2
      const thumbImageWidth = 400 // TODO - 400? 300?
      const thumbImageHeight = thumbImageWidth * 1.2
      const timetableImageWidth = 100
      const timetableImageHeight = timetableImageWidth * 1.2

      const mainImage = await getResizedImage(_imageUrl, mainImageWidth, mainImageHeight)
      const thumbImage = await getResizedImage(_imageUrl, thumbImageWidth, thumbImageHeight)
      const timetableImage = await getResizedImage(_imageUrl, timetableImageWidth, timetableImageHeight)

      const mainImageBlob = await getUriToBlob(mainImage.uri)
      const thumbImageBlob = await getUriToBlob(thumbImage.uri)
      const timetableImageBlob = await getUriToBlob(timetableImage.uri)

      const {main_url, thumb_url, timetable_url} = await getScheduleCompletePhotoCardUploadUrlMutateAsync({
        name: imageName
      })

      await uploadImageMutateAsync({url: main_url, data: mainImageBlob, contentType})
      await uploadImageMutateAsync({url: thumb_url, data: thumbImageBlob, contentType})
      await uploadImageMutateAsync({url: timetable_url, data: timetableImageBlob, contentType})

      // 이미지 변경시 기존 이미지 제거
      if (route.params.main_path) {
        await deleteScheduleCompleteCardMutateAsync({schedule_complete_id: route.params.schedule_complete_id})
      }
    }

    const response = await updateScheduleCompleteCardMutateAsync({
      schedule_complete_id: route.params.schedule_complete_id,
      complete_date: route.params.complete_date,
      record: _record || '',
      file_name: imageName
    })

    const newEditScheduleCompleteCacheList = getNewEditScheduleCompleteCacheList(response)
    const newScheduleList = getNewScheduleList(response)

    setEditScheduleCompleteCacheList(newEditScheduleCompleteCacheList)
    setScheduleList(newScheduleList)
    resetEditScheduleCompleteCardForm()
    resetEditScheduleCompletePhotoCardForm()

    navigation.navigate('MainTabs', {
      screen: 'Home'
    })
  }, [
    alert,
    route.params,
    _record,
    _imageUrl,
    getNewEditScheduleCompleteCacheList,
    getNewScheduleList,
    uploadImageMutateAsync,
    deleteScheduleCompleteCardMutateAsync,
    updateScheduleCompleteCardMutateAsync,
    getScheduleCompletePhotoCardUploadUrlMutateAsync,
    setEditScheduleCompleteCacheList,
    setScheduleList,
    resetEditScheduleCompleteCardForm,
    resetEditScheduleCompletePhotoCardForm,
    navigation
  ])

  const handleBack = useCallback(() => {
    resetEditScheduleCompleteCardForm()
    resetEditScheduleCompletePhotoCardForm()
    navigation.goBack()
  }, [resetEditScheduleCompleteCardForm, resetEditScheduleCompletePhotoCardForm, navigation])

  useEffect(() => {
    if (editScheduleCompleteCardForm.imageUrl) {
      _setImageUrl(editScheduleCompleteCardForm.imageUrl)
    }
  }, [editScheduleCompleteCardForm.imageUrl])

  useEffect(() => {
    if (editScheduleCompleteCardForm.record) {
      _setRecord(editScheduleCompleteCardForm.record)
    }
  }, [editScheduleCompleteCardForm.record])

  return (
    <View style={containerStyle}>
      <AppBar
        type="edit"
        title={targetSchedule?.title || ''}
        completeCount={route.params.complete_count || 0}
        onBack={handleBack}
        onSubmit={handleSubmit}
      />

      <View style={styles.wrapper}>
        <Pressable style={styles.cardWrapper} onPress={pressCard}>
          {_imageUrl || _record ? (
            <ScheduleCompleteCard
              size="large"
              imageUrl={_imageUrl}
              record={_record}
              shadowColor="#e0e0e0"
              shadowDistance={15}
              shadowOffset={[7, 7]}
            />
          ) : (
            <Pressable style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>카드가 없어요</Text>
            </Pressable>
          )}
        </Pressable>

        {!_imageUrl && !_record && (
          <View style={footerStyles.infoWrapper}>
            <View style={footerStyles.infoTail} />
            <Text style={footerStyles.InfoText}>추가할 카드를 선택해 주세요</Text>
          </View>
        )}
      </View>

      {/* footer */}
      <View style={[footerStyles.container, {backgroundColor: activeTheme.color5}]}>
        <Pressable style={[footerStyles.button, {borderColor: activeTheme.color2}]} onPress={handlePhotoCardSelected}>
          <View style={[footerStyles.mark, {backgroundColor: _imageUrl ? '#1E90FF' : '#efefef'}]}>
            <View style={footerStyles.innerMark} />
          </View>

          <Text style={[footerStyles.buttonText, {color: activeTheme.color3}]}>포토 카드</Text>
        </Pressable>

        <Pressable style={[footerStyles.button, {borderColor: activeTheme.color2}]} onPress={handleRecordCardSelected}>
          <View style={[footerStyles.mark, {backgroundColor: _record ? '#1E90FF' : '#efefef'}]}>
            <View style={footerStyles.innerMark} />
          </View>

          <Text style={[footerStyles.buttonText, {color: activeTheme.color3}]}>기록 카드</Text>
        </Pressable>
      </View>

      <ScheduleCompleteRecordModal
        visible={isShowEditNoteModal}
        value={_record || ''}
        onChange={changeScheduleCompleteRecord}
        onClose={() => setIsShowEditNoteModal(false)}
      />
      <EditScheduleCompleteCardMenuBottomSheet
        visible={isShowEditScheduleCompleteCardMenu}
        onSelect={selectEditScheduleCompleteCardMenu}
        onClose={() => setIsShowEditScheduleCompleteCardMenu(false)}
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
  },
  cardWrapper: {
    width: '80%',
    aspectRatio: 0.8
  },
  emptyCard: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555555',
    borderStyle: 'dashed'
  },
  emptyCardText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 18,
    color: '#555555'
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
  },
  infoWrapper: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: '#555',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10
  },
  infoTail: {
    position: 'absolute',
    left: 77,
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
  InfoText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#ffffff'
  }
})

export default EditScheduleCompleteCard
