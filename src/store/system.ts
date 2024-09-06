import {atom, selector} from 'recoil'
import {Platform} from 'react-native'

const editScheduleListMinSnapPoint = 150
const bottomTabHeight = 48

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

type Toast = {visible: boolean; message: string}
export const toastState = atom<Toast>({
  key: 'toastState',
  default: {
    visible: false,
    message: ''
  }
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

export const homeHeaderHeightState = atom({
  key: 'homeHeaderHeightState',
  default: 0
})

export const timetableWrapperHeightState = selector({
  key: 'timetableWrapperHeightState',
  get: ({get}) => {
    const {height} = get(windowDimensionsState)
    const homeHeaderHeight = get(homeHeaderHeightState)
    const safeAreaInsets = get(safeAreaInsetsState)

    if (!homeHeaderHeight) {
      return null
    }

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

export const timetableCenterPositionState = selector({
  key: 'timetableCenterPositionState',
  get: ({get}) => {
    const {width} = get(windowDimensionsState)
    const homeHeaderHeight = get(homeHeaderHeightState)
    const timetableWrapperHeight = get(timetableWrapperHeightState)

    if (!homeHeaderHeight || !timetableWrapperHeight) {
      return 0
    }

    if (width > timetableWrapperHeight) {
      return timetableWrapperHeight / 2 - 10
    }

    return width / 2
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
    const homeHeaderHeight = get(homeHeaderHeightState) // include status bar height

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
    const timetableWrapperHeight = get(timetableWrapperHeightState)

    if (height === 0 || !timetableWrapperHeight) {
      return []
    }

    const appBarHeight = 48
    let topSafeAreaHeight = 0
    let bottomSafeAreaHeight = 0

    if (Platform.OS === 'ios') {
      topSafeAreaHeight = safeAreaInsets.top
      bottomSafeAreaHeight = safeAreaInsets.bottom
    }

    const totalSafeAreaHeight = topSafeAreaHeight + bottomSafeAreaHeight

    const minSnapPoint = height - (totalSafeAreaHeight + appBarHeight + timetableWrapperHeight)
    const maxSnapPoint = height - (totalSafeAreaHeight + appBarHeight)

    return [minSnapPoint, maxSnapPoint]
  }
})

export const editScheduleListStatusState = atom({
  key: 'editScheduleListStatusState',
  default: 0
})
