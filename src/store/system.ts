import {atom, selector} from 'recoil'
import {Platform} from 'react-native'
import {getStatusBarHeight} from 'react-native-status-bar-height'

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

export const timetablePositionXState = selector({
  key: 'timetablePositionXState',
  get: ({get}) => {
    const {width} = get(windowDimensionsState)

    return width / 2
  }
})

export const timetablePositionYState = selector({
  key: 'timetablePositionYState',
  get: ({get}) => {
    const {height} = get(windowDimensionsState)

    return height * 0.28
  }
})

export const timetableSizeState = selector({
  key: 'timetableSizeState',
  get: ({get}) => {
    const {width, height} = get(windowDimensionsState)
    const timetablePositionY = get(timetablePositionYState)

    if (width === 0) {
      return 0
    }

    // const margin = 72
    const margin = 64
    const size = width - margin
    const halfSize = size / 2

    if (timetablePositionY < halfSize) {
      return height * 0.4
    }

    return size
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
    const timetablePositionY = get(timetablePositionYState)

    if (Platform.OS === 'ios') {
      topSafeAreaHeight = safeAreaInsets.top
      bottomSafeAreaHeight = safeAreaInsets.bottom
    }

    const totalSafeAreaHeight = topSafeAreaHeight + bottomSafeAreaHeight

    const minSnapPoint = height - totalSafeAreaHeight - (homeHeaderHeight + timetablePositionY * 2)
    const maxSnapPoint = height - totalSafeAreaHeight - homeHeaderHeight - marginTop

    return [minSnapPoint, maxSnapPoint]
  }
})

export const editScheduleListSnapPointState = selector({
  key: 'editScheduleListSnapPointState',
  get: ({get}) => {
    const {height} = get(windowDimensionsState)

    if (height === 0) {
      return []
    }

    const appBarHeight = 48
    let topSafeAreaHeight = 0
    let bottomSafeAreaHeight = 0

    const safeAreaInsets = get(safeAreaInsetsState)
    const timetablePositionY = get(timetablePositionYState)

    if (Platform.OS === 'ios') {
      topSafeAreaHeight = safeAreaInsets.top
      bottomSafeAreaHeight = safeAreaInsets.bottom
    }

    const totalSafeAreaHeight = topSafeAreaHeight + bottomSafeAreaHeight

    const minSnapPoint = height - totalSafeAreaHeight - (appBarHeight + timetablePositionY * 2)
    const maxSnapPoint = height - totalSafeAreaHeight - appBarHeight

    return [minSnapPoint, maxSnapPoint]
  }
})
