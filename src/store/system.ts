import {atom, selector} from 'recoil'
import {Platform} from 'react-native'

const bottomTabHeight = 56
export const homeHeaderHeight = 84

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

const editScheduleListMinSnapPointState = selector({
  key: 'editScheduleListMinSnapPointState',
  get: ({get}) => {
    const {width, height} = get(windowDimensionsState)
    const aspectRatio = height / width

    if (aspectRatio < 2) {
      return 90
    }

    return 150
  }
})

export const timetableWrapperHeightState = selector({
  key: 'timetableWrapperHeightState',
  get: ({get}) => {
    const {height} = get(windowDimensionsState)
    const safeAreaInsets = get(safeAreaInsetsState)
    const editScheduleListMinSnapPoint = get(editScheduleListMinSnapPointState)

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
    const timetableWrapperHeight = get(timetableWrapperHeightState)

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
    const editScheduleListMinSnapPoint = get(editScheduleListMinSnapPointState)

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
