import http from '@/utils/http'
import {EditColorThemeRequest, EditColorThemeResponse} from '@/apis/types/schedule'

export const editColorTheme = (data: EditColorThemeRequest) => {
  return http.post<any, Response<EditColorThemeResponse>>('schedule/color/theme', data)
}
