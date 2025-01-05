import http from '@/utils/http'
import {
  UpdateDisplayModeRequest,
  UpdateDisplayModeResponse,
  UpdateCustomRequest,
  UpdateCustomResponse,
  SetBackgroundRequest,
  SetBackgroundResponse,
  GetBackgroundListResponse,
  GetOutlineListResponse,
  UpdateColorThemeRequest
} from '@/apis/types/user'

export const updateDisplayMode = (data: UpdateDisplayModeRequest) => {
  return http.post<any, Response<UpdateDisplayModeResponse>>('user/update/display_mode', data)
}

export const updateCustom = (data: UpdateCustomRequest) => {
  return http.post<any, Response<UpdateCustomResponse>>('user/update/custom', data)
}

export const setBackground = (data: SetBackgroundRequest) => {
  return http.post<any, Response<SetBackgroundResponse>>('user/background', data)
}

export const getBackgroundList = () => {
  return http.post<any, Response<GetBackgroundListResponse[]>>('user/background/list')
}

export const getOutlineList = () => {
  return http.get<any, Response<GetOutlineListResponse[]>>('user/outline/list')
}

export const updateColorTheme = (data: UpdateColorThemeRequest) => {
  return http.post<any, Response<ColorThemeItem[]>>('user/color-theme', data)
}
