import {GetBackgroundListResponse, GetActiveOutlineResponse, GetOutlineListResponse} from '@/apis/types/user'
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
  interface ActiveOutline extends GetActiveOutlineResponse {}
  interface MyOutlineItem extends GetOutlineListResponse {}

  interface LoginInfo {
    login_type: (typeof LOGIN_TYPE)[keyof typeof LOGIN_TYPE]
    email: string
  }
}
