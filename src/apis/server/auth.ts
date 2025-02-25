import http from '@/utils/http'
import {
  AccessResponse,
  GetJoinTermsListResponse,
  GetNewTokenRequest,
  GetNewTokenResponse,
  JoinRequest,
  JoinResponse,
  LeaveRequest,
  LeaveResponse,
  LoginLinkSNSRequest,
  LoginLinkSNSResponse,
  LoginRequest,
  LoginResponse,
  LoginSyncDataRequest
} from '@/apis/types/auth'

export const getJoinTermsList = () => {
  return http.get<any, Response<GetJoinTermsListResponse[]>>('auth/terms/join')
}

export const join = (data: JoinRequest) => {
  return http.post<any, Response<JoinResponse>>('auth/join', data)
}

export const login = (data: LoginRequest) => {
  return http.post<any, Response<LoginResponse>>('auth/login', data)
}

export const loginLinkSNS = (data: LoginLinkSNSRequest) => {
  return http.post<any, Response<LoginLinkSNSResponse>>('auth/login/link', data)
}

export const loginSyncData = (data: LoginSyncDataRequest) => {
  return http.post<any, Response<LoginLinkSNSResponse>>('auth/login/link/sync', data)
}

export const access = () => {
  return http.post<any, Response<AccessResponse>>('auth/access')
}

export const leave = (data: LeaveRequest) => {
  return http.post<any, Response<LeaveResponse>>('auth/leave', data)
}

export const getNewToken = (data: GetNewTokenRequest) => {
  return http.post<any, Response<GetNewTokenResponse>>('auth/token/reissue', data)
}
