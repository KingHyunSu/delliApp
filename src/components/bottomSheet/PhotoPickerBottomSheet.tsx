import {useRef, useCallback, useEffect} from 'react'
import {Platform, StyleSheet, View, Pressable, Text} from 'react-native'
import {BottomSheetModal, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import CameraIcon from '@/assets/icons/camera.svg'
import ImageIcon from '@/assets/icons/image.svg'

import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'
import {check, request, PermissionStatus, PERMISSIONS, RESULTS} from 'react-native-permissions'
import {launchCamera, launchImageLibrary, Asset} from 'react-native-image-picker'
import ViewShot from 'react-native-view-shot'

interface Props {
  visible: boolean
  onChange: (image: Asset) => void
  onClose: () => void
}
const PhotoPickerBottomSheet = ({visible, onChange, onClose}: Props) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const activeTheme = useRecoilValue(activeThemeState)

  const getCameraPermission = useCallback(() => {
    switch (Platform.OS) {
      case 'ios':
        return PERMISSIONS.IOS.CAMERA
      case 'android':
        return PERMISSIONS.ANDROID.CAMERA
      default:
        return null
    }
  }, [])

  const getPhotoPermission = useCallback(() => {
    switch (Platform.OS) {
      case 'ios':
        return PERMISSIONS.IOS.PHOTO_LIBRARY
      default:
        return null
    }
  }, [])

  const handleCamera = useCallback(async () => {
    const permission = getCameraPermission()
    if (!permission) return

    const status = await check(permission)

    if (status === RESULTS.UNAVAILABLE) {
      const result = await request(permission)
    }
  }, [])

  const handlePhoto = useCallback(async () => {
    const permission = getPhotoPermission()
    if (!permission) return

    const status = await check(permission)

    if (status === RESULTS.DENIED) {
      await request(permission)
    }

    const item = await launchImageLibrary({
      presentationStyle: 'fullScreen',
      mediaType: 'photo',
      selectionLimit: 1
    })

    if (item.assets) {
      onChange(item.assets[0])
    }
  }, [getPhotoPermission, onChange])

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
      snapPoints={[250]}
      enableDynamicSizing={false}
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      backdropComponent={getBottomSheetBackdrop}
      handleComponent={getBottomSheetHandler}
      onDismiss={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, {color: activeTheme.color3}]}>사진 등록하기</Text>

        <Pressable style={styles.button} onPress={handleCamera}>
          <CameraIcon width={20} height={20} fill={activeTheme.color3} />
          <Text style={[styles.buttonText, {color: activeTheme.color3}]}>카메라로 촬영하기</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handlePhoto}>
          <ImageIcon width={20} height={20} fill={activeTheme.color3} />
          <Text style={[styles.buttonText, {color: activeTheme.color3}]}>앨범에서 선택하기</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    marginBottom: 20
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

export default PhotoPickerBottomSheet
