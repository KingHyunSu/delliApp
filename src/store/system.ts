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

    return height * 0.3
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
    const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0
    const {height} = get(windowDimensionsState)

    if (height === 0) {
      return []
    }

    const homeHeaderHeight = get(homeHeaderHeightState)
    const timetablePositionY = get(timetablePositionYState)

    const minSnapPoint = height - (statusBarHeight + homeHeaderHeight + timetablePositionY * 2)
    const maxSnapPoint = height - (statusBarHeight + homeHeaderHeight + 20)

    return [minSnapPoint, maxSnapPoint]
  }
})
