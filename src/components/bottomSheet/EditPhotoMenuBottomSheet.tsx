import {useRef, useState, useCallback, useEffect} from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'
import {BottomSheetModal, BottomSheetView, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import CameraIcon from '@/assets/icons/camera.svg'
import ImageIcon from '@/assets/icons/image.svg'

import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'
import {useCamera, useImageLibrary} from '@/utils/hooks/usePhoto'
import ImageCropModal from '@/components/modal/ImageCropModal'
import {ImagePickerResponse} from 'react-native-image-picker'

interface Props {
  visible: boolean
  crop?: boolean
  onChange: (url: string) => void
  onError?: () => void
  onClose: () => void
}
const EditPhotoMenuBottomSheet = ({visible, crop, onChange, onError, onClose}: Props) => {
  const camera = useCamera({
    presentationStyle: 'overFullScreen',
    mediaType: 'photo'
  })
  const imageLibrary = useImageLibrary({
    presentationStyle: 'overFullScreen',
    mediaType: 'photo',
    selectionLimit: 1
  })

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const [isShowImageCropModal, setIsShowImageCropModal] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)

  const activeTheme = useRecoilValue(activeThemeState)

  const handleError = useCallback(() => {
    if (onError) {
      onError()
    }
    setTempImageUrl(null)
  }, [onError])

  const handleSuccess = useCallback(
    (result: ImagePickerResponse) => {
      if (result.didCancel || result.errorCode) {
        handleError()
        return
      }

      if (result.assets) {
        const asset = result.assets[0]
        const uri = asset.uri

        if (!uri) {
          handleError()
          return
        }

        if (crop) {
          setTempImageUrl(uri)
          setIsShowImageCropModal(true)
          return
        }

        onChange(uri)
      }
    },
    [handleError, crop, onChange]
  )

  const handleCamera = useCallback(async () => {
    const result = await camera()

    if (result) {
      handleSuccess(result)
    } else {
      handleError()
    }
  }, [camera, handleSuccess, handleError])

  const handleAlbum = useCallback(async () => {
    const result = await imageLibrary()

    if (result) {
      handleSuccess(result)
    } else {
      handleError()
    }
  }, [imageLibrary, handleSuccess, handleError])

  const handleCrop = useCallback(
    (url: string) => {
      onChange(url)
      setTempImageUrl(null)
    },
    [onChange]
  )

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present()
    } else {
      bottomSheetModalRef.current?.dismiss()
    }
  }, [visible])

  // components
  const getBottomSheetBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const getBottomSheetHandler = useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={1}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  return (
    <BottomSheetModal
      name="photoMenu"
      ref={bottomSheetModalRef}
      index={0}
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      backdropComponent={getBottomSheetBackdrop}
      handleComponent={getBottomSheetHandler}
      onDismiss={onClose}>
      <BottomSheetView style={styles.container}>
        <View>
          <Text style={[styles.title, {color: activeTheme.color3, paddingBottom: 15}]}>사진 등록하기</Text>

          <Pressable style={styles.button} onPress={handleCamera}>
            <CameraIcon width={20} height={20} fill={activeTheme.color3} />
            <Text style={[styles.buttonText, {color: activeTheme.color3}]}>카메라로 촬영하기</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleAlbum}>
            <ImageIcon width={20} height={20} fill={activeTheme.color3} />
            <Text style={[styles.buttonText, {color: activeTheme.color3}]}>앨범에서 선택하기</Text>
          </Pressable>
        </View>
      </BottomSheetView>

      <ImageCropModal
        visible={isShowImageCropModal}
        sourceUrl={tempImageUrl!}
        onCrop={handleCrop}
        onClose={() => setIsShowImageCropModal(false)}
      />
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 20
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    marginBottom: 5
  },
  button: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  buttonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16
  }
})

export default EditPhotoMenuBottomSheet
