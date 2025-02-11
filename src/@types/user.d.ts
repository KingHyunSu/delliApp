import {GetBackgroundListResponse, GetOutlineListResponse} from '@/apis/types/user'
import {LOGIN_TYPE} from '@/utils/types'

declare global {
  interface ActiveBackground {
    background_id: number
    main_url: string
    display_mode: number
    background_color: string
    accent_color: string
  }
  interface MyBackgroundItem extends GetBackgroundListResponse {}
  interface MyOutlineItem extends GetOutlineListResponse {}

  type DisplayMode = 1 | 2 // 1: 라이트, 2: 다크

  interface LoginInfo {
    login_type: (typeof LOGIN_TYPE)[keyof typeof LOGIN_TYPE]
    email: string
    nickname: string | null
    profile_path: string | null
  }

  interface ActiveOutline {
    my_outline_id: number
    product_outline_id: number
    background_color: string
    progress_color: string
  }
}
