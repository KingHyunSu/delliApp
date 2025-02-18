import {check, request, openSettings, PERMISSIONS, RESULTS} from 'react-native-permissions'
import {CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {Platform, Alert} from 'react-native'

export const useCamera = (options: CameraOptions) => {
  return async () => {
    let permission = null
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA
    } else if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.CAMERA
    }

    if (!permission) return

    const status = await check(permission)

    if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
      const result = await request(permission)

      if (result === RESULTS.BLOCKED) {
        let message = ''

        if (Platform.OS === 'ios') {
          message = '"카메라" 권한을 허용해 주세요'
        } else if (Platform.OS === 'android') {
          message = '"권한"에서 "카메라" 액세스 권한을 허용해 주세요'
        }

        Alert.alert('필수 권한 설정하기', message, [
          {
            text: '닫기',
            onPress: () => {
              return
            }
          },
          {
            text: '설정하기',
            onPress: async () => {
              await openSettings()
            }
          }
        ])
      }
    } else {
      return await launchCamera(options)
    }
  }
}

export const useImageLibrary = (options: ImageLibraryOptions) => {
  return async () => {
    let permission = null
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY
    } else if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
    }

    if (!permission) return

    const status = await check(permission)

    if (status === RESULTS.DENIED) {
      await request(permission)
    }

    return await launchImageLibrary(options)
  }
}
