import http from '@/utils/http'

interface SystemInfoResponse {
  ios_update_required: boolean
  android_update_required: boolean
  server_maintenance: boolean
}
export const getSystemInfo = () => {
  return http.get<any, Response<SystemInfoResponse>>('system/info')
}
