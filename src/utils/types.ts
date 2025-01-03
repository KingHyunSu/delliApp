export const LOGIN_TYPE = {
  GUEST: 0,
  KAKAO: 1,
  APPLE: 2,
  GOOGLE: 3
} as const

export const TEXT_ALIGN_TYPE = {
  NONE: 0,
  LEFT: 1,
  CENTER: 2,
  RIGHT: 3
}

export const TEXT_DIRECTION_TYPE = {
  NONE: 0,
  LEFT: 1,
  RIGHT: 2
}

export const RANGE_FLAG = {END: 0, START: 1} as const
export type RANGE_FLAG = 0 | 1
