import {GetBackgroundListResponse, GetActiveOutlineResponse, GetOutlineListResponse} from '@/apis/types/user'

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
    login_type: number
    email: string
  }
}
