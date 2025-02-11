import {useMutation, useQuery} from '@tanstack/react-query'
import * as authApi from '@/apis/server/auth'
import {GetJoinTermsListResponse, JoinRequest, JoinResponse} from '@/apis/types/auth'
import {v4 as uuidV4} from 'uuid'
import {useSetRecoilState} from 'recoil'
import {
  activeBackgroundState,
  activeColorThemeDetailState,
  activeOutlineState,
  displayModeState,
  statusBarTextStyleState,
  widgetReloadableState
} from '@/store/system'
import {loginInfoState} from '@/store/user'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useGetJoinTermsList = () => {
  return useQuery({
    queryKey: ['joinTermsList'],
    queryFn: async () => {
      const response = await authApi.getJoinTermsList()

      return response.data as GetJoinTermsListResponse[]
    },
    initialData: []
  })
}

export const useJoin = () => {
  return useMutation({
    mutationFn: async (params: Omit<JoinRequest, 'uuid'>) => {
      const uuid = uuidV4()
      const response = await authApi.join({...params, uuid: uuid})

      return response.data as JoinResponse
    }
  })
}

export const useAccess = () => {
  const setStatusBarTextStyle = useSetRecoilState(statusBarTextStyleState)
  const setActiveBackground = useSetRecoilState(activeBackgroundState)
  const setActiveColorThemeDetail = useSetRecoilState(activeColorThemeDetailState)
  const setActiveOutline = useSetRecoilState(activeOutlineState)
  const setDisplayMode = useSetRecoilState(displayModeState)
  const setLoginInfo = useSetRecoilState(loginInfoState)
  const setWidgetReloadable = useSetRecoilState(widgetReloadableState)

  return useMutation({
    mutationFn: async () => {
      const response = await authApi.access()

      const accessInfo = response.data

      if (accessInfo.active_background) {
        setStatusBarTextStyle(accessInfo.active_background.display_mode === 0 ? 'dark-content' : 'light-content')
        setActiveBackground(accessInfo.active_background)
      }

      setDisplayMode(accessInfo.active_display_mode)
      setActiveOutline(accessInfo.active_outline)

      if (
        accessInfo.color_theme_detail.is_active_color_theme &&
        accessInfo.color_theme_detail.color_theme_item_list.length === 0
      ) {
        setActiveColorThemeDetail({
          is_active_color_theme: accessInfo.color_theme_detail.is_active_color_theme,
          color_theme_item_list: [
            {
              color_theme_item_id: -1,
              background_color: '#efefef',
              text_color: '#000000',
              order: 1
            },
            {
              color_theme_item_id: -1,
              background_color: '#ffffff',
              text_color: '#000000',
              order: 2
            }
          ]
        })
      } else {
        setActiveColorThemeDetail(accessInfo.color_theme_detail)
      }

      setLoginInfo({
        login_type: accessInfo.login_type,
        email: accessInfo.email,
        nickname: accessInfo.nickname,
        profile_path: accessInfo.profile_path
      })

      setWidgetReloadable(accessInfo.widget_reloadable)

      await AsyncStorage.setItem('loginType', String(accessInfo.login_type))
    }
  })
}
