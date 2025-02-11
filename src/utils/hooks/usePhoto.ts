import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions'
import {CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {Platform} from 'react-native'

export const useCamera = (options: CameraOptions) => {
  return async () => {
    let permission = null
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA
    }
    if (!permission) return

    const status = await check(permission)

    if (status === RESULTS.DENIED) {
      await request(permission)
    }

    return await launchCamera(options)
  }
}

export const useImageLibrary = (options: ImageLibraryOptions) => {
  return async () => {
    let permission = null
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY
    }
    if (!permission) return

    const status = await check(permission)

    if (status === RESULTS.DENIED) {
      await request(permission)
    }

    return await launchImageLibrary(options)
  }
}
