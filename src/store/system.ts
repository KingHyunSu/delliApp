import {Platform} from 'react-native'
import {atom, selector} from 'recoil'

const bottomTabHeight = 56
const editScheduleListMinSnapPoint = 50
export const homeHeaderHeight = 84

export const displayModeState = atom<DisplayMode>({
  key: 'displayModeState',
  default: 1
})

export const activeThemeState = selector<ActiveTheme>({
  key: 'activeThemeState',
  get: ({get}) => {
    const displayMode = get(displayModeState)

    if (displayMode === 2) {
      return {
        color1: '#202023',
        color2: '#484851',
        color3: '#eeeeee',
        color4: '',
        color5: '#27272C',
        color6: '#35353B',
        color7: '#babfc5',
        color8: '#424242',
        color9: '#35353B'
      }
    }

    return {
      color1: '#ffffff',
      color2: '#f5f6f8',
      color3: '#424242',
      color4: '',
      color5: '#ffffff',
      color6: '#f9f9f9',
      color7: '#424242',
      color8: '#babfc5',
      color9: '#ffffff'
    }
  }
})

export const activeBackgroundState = atom<ActiveBackground>({
  key: 'activeBackgroundState',
  default: {
    background_id: 1,
    file_name: 'beige.png',
    display_mode: 0,
    background_color: '#ffffff',
    sub_color: '#424242',
    accent_color: '#424242'
  }
})

export const keyboardAppearanceState = selector({
  key: 'keyboardAppearanceState',
  get: ({get}) => {
    const displayMode = get(displayModeState)

    return displayMode === 1 ? 'light' : 'dark'
  }
})

export const loginState = atom({
  key: 'loginState',
  default: false
})

export const isLunchState = atom({
  key: 'isLunchState',
  default: false
})

export const isEditState = atom({
  key: 'isEdit',
  default: false
})

export const isLoadingState = atom({
  key: 'isLoading',
  default: false
})

export const statusBarColorState = atom({
  key: 'statusBarColorState',
  default: '#ffffff'
})

export const statusBarTextStyleState = atom<'dark-content' | 'light-content'>({
  key: 'statusBarTextColorStyleState',
  default: 'dark-content'
})

export const bottomSafeAreaColorState = atom({
  key: 'bottomSafeAreaColorState',
  default: '#ffffff'
})

type Toast = {visible: boolean; message: string}
export const toastState = atom<Toast>({
  key: 'toastState',
  default: {
    visible: false,
    message: ''
  }
})

type Alert = {
  type?: 'primary' | 'danger'
  title?: string
  desc?: string
  cancelButtonText?: string
  confirmButtonText?: string
  cancelFn?: () => void
  confirmFn?: () => void
}
export const alertState = atom<Alert | null>({
  key: 'alertState',
  default: null
})

export const windowDimensionsState = atom({
  key: 'windowDimensionsState',
  default: {
    width: 0,
    height: 0
  }
})

export const safeAreaInsetsState = atom({
  key: 'safeAreaInsetsState',
  default: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
})

// const editScheduleListMinSnapPointState = selector({
//   key: 'editScheduleListMinSnapPointState',
//   get: ({get}) => {
//     const {width, height} = get(windowDimensionsState)
//     const aspectRatio = height / width
//
//     if (aspectRatio < 1.9) {
//       return 90
//     }
//
//     return 150
//   }
// })

export const timetableContainerHeightState = selector({
  key: 'timetableContainerHeightState',
  get: ({get}) => {
    const {height} = get(windowDimensionsState)
    const safeAreaInsets = get(safeAreaInsetsState)

    let topSafeAreaHeight = 0
    let bottomSafeAreaHeight = 0

    if (Platform.OS === 'ios') {
      topSafeAreaHeight = safeAreaInsets.top
      bottomSafeAreaHeight = safeAreaInsets.bottom
    }

    const totalSafeAreaHeight = topSafeAreaHeight + bottomSafeAreaHeight

    return height - bottomTabHeight - (homeHeaderHeight + editScheduleListMinSnapPoint + totalSafeAreaHeight)
  }
})

export const timetableWrapperSizeState = selector({
  key: 'timetableSizeState',
  get: ({get}) => {
    const {width} = get(windowDimensionsState)
    const timetableContainerHeight = get(timetableContainerHeightState)

    if (width > timetableContainerHeight) {
      return timetableContainerHeight / 2 - 10
    }

    return width / 2
  }
})

export const editTimetableTranslateYState = selector({
  key: 'editTimetableTranslateYState',
  get: ({get}) => {
    const timetableContainerHeight = get(timetableContainerHeightState)
    const timetableWrapperSize = get(timetableWrapperSizeState)

    return (timetableContainerHeight - timetableWrapperSize * 2) / 2 + 36 - 50
  }
})

export const scheduleListSnapPointState = selector({
  key: 'scheduleListSnapPointState',
  get: ({get}) => {
    const {height} = get(windowDimensionsState)

    if (height === 0) {
      return []
    }

    const marginTop = 10
    let topSafeAreaHeight = 0
    let bottomSafeAreaHeight = 0

    const safeAreaInsets = get(safeAreaInsetsState)

    if (Platform.OS === 'ios') {
      topSafeAreaHeight = safeAreaInsets.top
      bottomSafeAreaHeight = safeAreaInsets.bottom
    }

    const totalSafeAreaHeight = topSafeAreaHeight + bottomSafeAreaHeight

    const maxSnapPoint = height - (bottomTabHeight + totalSafeAreaHeight + homeHeaderHeight + marginTop)

    return [editScheduleListMinSnapPoint, maxSnapPoint]
  }
})

export const editScheduleListSnapPointState = selector({
  key: 'editScheduleListSnapPointState',
  get: ({get}) => {
    const {height} = get(windowDimensionsState)
    const safeAreaInsets = get(safeAreaInsetsState)
    const timetableWrapperSize = get(timetableWrapperSizeState)

    const appBarHeight = 48
    let topSafeAreaHeight = 0
    let bottomSafeAreaHeight = 0

    if (Platform.OS === 'ios') {
      topSafeAreaHeight = safeAreaInsets.top
      bottomSafeAreaHeight = safeAreaInsets.bottom
    }

    const totalSafeAreaHeight = topSafeAreaHeight + bottomSafeAreaHeight
    const minSnapPoint = height - (totalSafeAreaHeight + appBarHeight + timetableWrapperSize * 2 + 100)
    const maxSnapPoint = height - (totalSafeAreaHeight + appBarHeight) - 10

    return [minSnapPoint, maxSnapPoint]
  }
})

export const editScheduleListStatusState = atom({
  key: 'editScheduleListStatusState',
  default: 0
})
