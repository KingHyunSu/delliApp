export {}

declare global {
  type DisplayMode = 1 | 2 // 1: 라이트, 2: 다크

  interface UserInfo {
    user_id: string
    display_mode: DisplayMode
    active_background_id: number
  }
}
