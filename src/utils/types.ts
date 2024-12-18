export const LOGIN_TYPE = {
  GUEST: 0,
  KAKAO: 1,
  APPLE: 2,
  GOOGLE: 3
} as const

export const RANGE_FLAG = {END: 0, START: 1} as const
export type RANGE_FLAG = 0 | 1
