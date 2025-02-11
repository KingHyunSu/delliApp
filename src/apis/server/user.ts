import http from '@/utils/http'
import {
  GetUserProfileResponse,
  GetProfileImageUploadUrlRequest,
  GetProfileImageUploadUrlResponse,
  UpdateProfileImageRequest,
  UpdateProfileImageResponse,
  UpdateNicknameRequest,
  UpdateNicknameResponse,
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

export const getUserProfile = () => {
  return http.get<any, Response<GetUserProfileResponse>>('user/profile')
}

export const getProfileImageUploadUrl = (params: GetProfileImageUploadUrlRequest) => {
  return http.get<any, Response<GetProfileImageUploadUrlResponse>>('user/profile-image/upload-url', {params})
}

export const updateProfileImage = (data: UpdateProfileImageRequest) => {
  return http.post<any, Response<UpdateProfileImageResponse>>('user/update/profile-image', data)
}

export const updateNickname = (data: UpdateNicknameRequest) => {
  return http.post<any, Response<UpdateNicknameResponse>>('user/update/nickname', data)
}

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
