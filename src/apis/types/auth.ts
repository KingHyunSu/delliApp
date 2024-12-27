import {
  GetRoutineListResponse,
  GetScheduleListResponse,
  GetScheduleRoutineCompleteListResponse,
  GetScheduleTodoListResponse
} from '@/apis/types/sync'
import {LOGIN_TYPE} from '@/utils/types'

export interface GetJoinTermsListResponse {
  terms_id: number
  type: string // 1: 서비스 이용약관 동의, 2: 개인정보 수집 및 이용동의, 3: 만 14세 이상 확인
  version: number
  url: string | null
  required: string
}

export interface JoinRequest {
  uuid: string
  login_type: number
  token: string
  terms_agree_list: number[]
}

export interface JoinResponse {
  token: string
}

export interface LoginRequest {
  login_type: number
  token: string
}
export interface LoginResponse {
  token: string
}

export interface LoginLinkSNSRequest {
  login_type: number
  token: string
  schedule_list: GetScheduleListResponse[]
  schedule_todo_list: GetScheduleTodoListResponse[]
  schedule_routine_list: GetRoutineListResponse[]
  schedule_routine_complete_list: GetScheduleRoutineCompleteListResponse[]
}
export interface LoginLinkSNSResponse {
  token: string
}

export interface AccessResponse {
  color_theme_detail: ColorThemeDetail
  active_background: ActiveBackground | null
  active_outline: ActiveOutline
  active_display_mode: DisplayMode
  login_type: (typeof LOGIN_TYPE)[keyof typeof LOGIN_TYPE]
  email: string
}

export interface LeaveRequest {
  loginType: number
  code: string | null
}
export interface LeaveResponse {
  result: boolean
}

export interface GetNewTokenRequest {
  token: string
}
export interface GetNewTokenResponse {
  token: string
}
