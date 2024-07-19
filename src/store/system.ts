import {atom, selector} from 'recoil'
import {Platform, StatusBar} from 'react-native'
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

    const timetableSize = get(timetableSizeState)
    const marginTop = 0
    const margin = 64

    // return timetableSize / 2 + margin / 2 + marginTop
    return height * 0.3
  }
})

export const timetableSizeState = selector({
  key: 'timetableSizeState',
  get: ({get}) => {
    const {width} = get(windowDimensionsState)

    if (width === 0) {
      return 0
    }

    const margin = 64
    const size = width - margin

    // const marginTop = 40
    // if (size / 2 + 32 + marginTop > size) {
    // }
    return size
  }
})

export const scheduleListSnapPointState = selector({
  key: 'scheduleListSnapPointState',
  get: ({get}) => {
    const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight || 0
    const {height} = get(windowDimensionsState)

    console.log('statusBarHeight', statusBarHeight)
    if (height === 0) {
      return []
    }

    const homeHeaderHeight = get(homeHeaderHeightState)
    const timetablePositionY = get(timetablePositionYState)
    const timetableSize = get(timetableSizeState)

    const marginBottom = 40
    const margin = 64

    // const minSnapPoint =
    //   height - (homeHeaderHeight + marginBottom + margin / 2 + (timetableSize / 2 + timetablePositionY))
    const minSnapPoint = height - (statusBarHeight + homeHeaderHeight + timetablePositionY * 2)
    console.log('minSnapPoint', minSnapPoint)
    const maxSnapPoint = height - (homeHeaderHeight + 20)

    // return ['20%', maxSnapPoint]
    return [minSnapPoint, maxSnapPoint]
  }
})
