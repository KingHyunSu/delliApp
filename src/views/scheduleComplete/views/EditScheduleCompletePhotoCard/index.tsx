import {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, View, Pressable, Text, Image} from 'react-native'
import EditPhotoMenuBottomSheet from '@/components/bottomSheet/EditPhotoMenuBottomSheet'
import PhotoCardText from './components/PhotoCardText'
import EditPhotoCardTextModal from './components/EditPhotoCardTextModal'
import CameraFillIcon from '@/assets/icons/camera_fill.svg'
import TextIcon from '@/assets/icons/text.svg'
import DrawIcon from '@/assets/icons/draw.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit3.svg'

import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated'
import {trigger} from 'react-native-haptic-feedback'
import {captureRef} from 'react-native-view-shot'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {EditScheduleCompletePhotoCardScreenProps} from '@/types/navigation'
import {editScheduleCompleteCardFormState, editScheduleCompletePhotoCardFormState} from '@/store/scheduleComplete'

const gestureSafeArea = 50

const EditScheduleCompletePhotoCard = ({navigation}: EditScheduleCompletePhotoCardScreenProps) => {
  const captureCardRef = useRef<View>(null)

  const [isShowEditPhotoMenuBottomSheet, setIsShowEditPhotoMenuBottomSheet] = useState(false)
  const [isShowEditPhotoCardTextModal, setIsShowEditPhotoCardTextModal] = useState(false)
  const [activeEditPhotoCardText, setActiveEditPhotoCardText] = useState<ScheduleCompletePhotoCardText | null>(null)
  const [initialPhotoCardTextPosition, setInitialPhotoCardTextPosition] = useState<{x: number; y: number}>({x: 0, y: 0})

  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [photoCardTextList, setPhotoCardTextList] = useState<ScheduleCompletePhotoCardText[]>([])

  const [editScheduleCompletePhotoCardForm, setEditScheduleCompletePhotoCardForm] = useRecoilState(
    editScheduleCompletePhotoCardFormState
  )
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const setEditScheduleCompleteCardForm = useSetRecoilState(editScheduleCompleteCardFormState)

  const controlBarTranslateY = useSharedValue(0)
  const controlBarOpacity = useSharedValue(0)

  const controlBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: controlBarTranslateY.value}],
    opacity: controlBarOpacity.value
  }))

  const cardWidth = useMemo(() => {
    return windowDimensions.width * 0.77
  }, [windowDimensions.width])

  const cardHeight = useMemo(() => {
    return cardWidth * 1.25
  }, [cardWidth])

  const pressBackground = useCallback(() => {
    setActiveEditPhotoCardText(null)
  }, [])

  const showEditPhotoCardTextModal = useCallback(() => {
    setActiveEditPhotoCardText(null)
    setIsShowEditPhotoCardTextModal(true)
  }, [])

  const changePhoto = useCallback(async (url: string) => {
    setOriginalImageUrl(url)
    setIsShowEditPhotoMenuBottomSheet(false)
  }, [])

  const changePhotoCardText = useCallback(
    (value: string) => {
      let newPhotoCardTextList = [...photoCardTextList]

      if (activeEditPhotoCardText === null) {
        const newPhotoCardText = {
          index: newPhotoCardTextList.length + 1,
          text: value,
          x: initialPhotoCardTextPosition.x,
          y: initialPhotoCardTextPosition.y,
          rotate: 0
        }

        setActiveEditPhotoCardText(newPhotoCardText)
        newPhotoCardTextList.push(newPhotoCardText)
      } else {
        newPhotoCardTextList = photoCardTextList.map(item => {
          return item.index === activeEditPhotoCardText.index ? {...item, text: value} : item
        })
      }

      setPhotoCardTextList(newPhotoCardTextList)
    },
    [photoCardTextList, activeEditPhotoCardText, initialPhotoCardTextPosition]
  )

  const changePhotoCardTextTransform = useCallback(
    (value: {x: number; y: number; rotate: number}) => {
      if (!activeEditPhotoCardText) return

      const newPhotoCardTextList = photoCardTextList.map(item => {
        return item.index === activeEditPhotoCardText.index
          ? {...item, x: value.x, y: value.y, rotate: value.rotate}
          : item
      })

      setPhotoCardTextList(newPhotoCardTextList)
    },
    [activeEditPhotoCardText, photoCardTextList]
  )

  const pressPhotoCardText = useCallback((value: ScheduleCompletePhotoCardText) => {
    trigger('soft', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    })

    setActiveEditPhotoCardText(value)
  }, [])

  const deletePhotoCardText = useCallback(() => {
    const newPhotoCardTextList = photoCardTextList.filter(item => {
      return activeEditPhotoCardText?.index !== item.index
    })

    setPhotoCardTextList(newPhotoCardTextList)
  }, [activeEditPhotoCardText, photoCardTextList])

  const handleSubmit = useCallback(async () => {
    setActiveEditPhotoCardText(null)
    setEditScheduleCompletePhotoCardForm({
      originalImageUrl,
      photoCardTextList
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const captureUri = await captureRef(captureCardRef)

    setEditScheduleCompleteCardForm(prevState => ({
      ...prevState,
      imageUrl: captureUri
    }))

    navigation.goBack()
  }, [
    originalImageUrl,
    photoCardTextList,
    setEditScheduleCompletePhotoCardForm,
    setEditScheduleCompleteCardForm,
    navigation
  ])

  useEffect(() => {
    setInitialPhotoCardTextPosition({
      x: 15 - gestureSafeArea,
      y: 15 + cardWidth - gestureSafeArea
    })
  }, [cardWidth])

  useEffect(() => {
    if (activeEditPhotoCardText === null) {
      controlBarTranslateY.value = withTiming(0, {duration: 200})
      controlBarOpacity.value = withTiming(0, {duration: 200})
    } else {
      controlBarTranslateY.value = withTiming(-72, {duration: 200})
      controlBarOpacity.value = withTiming(1, {duration: 400})
    }
  }, [activeEditPhotoCardText])

  useEffect(() => {
    setOriginalImageUrl(editScheduleCompletePhotoCardForm.originalImageUrl)
    setPhotoCardTextList(editScheduleCompletePhotoCardForm.photoCardTextList)
  }, [editScheduleCompletePhotoCardForm])

  return (
    <Pressable style={styles.container} onPress={pressBackground}>
      {/* app bar */}
      <View style={appBarStyles.container}>
        <View style={appBarStyles.wrapper}>
          <Pressable style={[appBarStyles.button, {paddingLeft: 16}]} onPress={navigation.goBack}>
            {!isShowEditPhotoCardTextModal && <Text style={appBarStyles.buttonText}>취소</Text>}
          </Pressable>

          <View style={appBarStyles.titleWrapper}>
            <Text numberOfLines={1} style={appBarStyles.title}>
              포토 카드 제작
            </Text>
          </View>

          <Pressable style={[appBarStyles.button, {paddingRight: 16, alignItems: 'flex-end'}]} onPress={handleSubmit}>
            {!isShowEditPhotoCardTextModal && <Text style={appBarStyles.buttonText}>만들기</Text>}
          </Pressable>
        </View>
      </View>

      <View style={styles.wrapper}>
        <View ref={captureCardRef} style={[styles.cardContainer, {width: cardWidth, height: cardHeight}]}>
          <View style={styles.imageWrapper}>
            <Image
              source={originalImageUrl ? {uri: originalImageUrl} : require('@/assets/images/empty.png')}
              style={styles.image}
            />
          </View>

          {/* photo card text list */}
          {photoCardTextList.map(item => {
            return (
              <PhotoCardText
                key={item.index}
                value={item}
                enabled={activeEditPhotoCardText?.index === item.index}
                gestureSafeArea={gestureSafeArea}
                onChangeTransform={changePhotoCardTextTransform}
                onPress={() => pressPhotoCardText(item)}
              />
            )
          })}
        </View>

        {/*  photo card text control bar */}
        <Animated.View style={[controlBarAnimatedStyle, controlBarStyles.container]}>
          <Pressable style={controlBarStyles.button} onPress={deletePhotoCardText}>
            <DeleteIcon fill="#FD4672" />
          </Pressable>

          <Pressable style={controlBarStyles.button} onPress={() => setIsShowEditPhotoCardTextModal(true)}>
            <EditIcon stroke="#ffffff" width={22} height={22} />
          </Pressable>
        </Animated.View>
      </View>

      {/* footer */}
      <View style={footerStyles.container}>
        <View style={footerStyles.wrapper}>
          <Pressable style={footerStyles.button} onPress={() => setIsShowEditPhotoMenuBottomSheet(true)}>
            <View style={footerStyles.cameraIconWrapper}>
              <CameraFillIcon fill="#000" width={20} height={20} />
            </View>
          </Pressable>

          <Pressable style={footerStyles.button} onPress={showEditPhotoCardTextModal}>
            <TextIcon width={28} height={28} />
          </Pressable>

          <Pressable style={footerStyles.button}>
            <DrawIcon width={28} height={28} />
          </Pressable>
        </View>
      </View>

      <EditPhotoMenuBottomSheet
        visible={isShowEditPhotoMenuBottomSheet}
        crop
        onChange={changePhoto}
        onClose={() => setIsShowEditPhotoMenuBottomSheet(false)}
      />
      <EditPhotoCardTextModal
        visible={isShowEditPhotoCardTextModal}
        value={activeEditPhotoCardText?.text || null}
        onChange={changePhotoCardText}
        onClose={() => setIsShowEditPhotoCardTextModal(false)}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    opacity: 0.85
  },
  container: {
    flex: 1
  },
  wrapper: {
    backgroundColor: '#494949',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    paddingTop: 15,
    paddingHorizontal: 15
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#f0eff586'
  }
})

const appBarStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000000'
  },
  wrapper: {
    height: 53,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 18,
    color: '#efefef'
  },
  button: {
    height: '100%',
    width: 60,
    justifyContent: 'center'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#ffffff'
  }
})

const controlBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5,
    position: 'absolute',
    bottom: -62,
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    borderRadius: 100
  },
  button: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const footerStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000'
  },
  wrapper: {
    flexDirection: 'row',
    height: 72
  },
  button: {
    width: 72,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 14
  }
})

export default EditScheduleCompletePhotoCard
