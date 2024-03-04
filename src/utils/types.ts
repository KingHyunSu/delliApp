export const LOGIN_TYPE = {
  KAKAO: '1',
  APPLE: '2',
  GOOGLE: '3'
}

export type COLOR_TYPE = 'background' | 'text'

export const RANGE_FLAG = {END: 0, START: 1} as const
export type RANGE_FLAG = 0 | 1
