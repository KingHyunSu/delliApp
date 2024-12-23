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
  statusBarTextStyleState
} from '@/store/system'
import {colorKit} from 'reanimated-color-picker'
import {loginInfoState} from '@/store/user'

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

  return useMutation({
    mutationFn: async () => {
      const response = await authApi.access()

      const accessInfo = response.data

      if (accessInfo.active_background) {
        setStatusBarTextStyle(accessInfo.active_background.display_mode === 0 ? 'dark-content' : 'light-content')
        setActiveBackground(accessInfo.active_background)
      }

      let colorThemeDetail = accessInfo.color_theme_detail

      if (colorThemeDetail.color_theme_type === 1) {
        const activeBackgroundColor = accessInfo.active_background?.background_color || '#F8F4EC'

        colorThemeDetail.color_theme_item_list = [
          {color_theme_item_id: -1, color: activeBackgroundColor, order: 1},
          {color_theme_item_id: -1, color: colorKit.brighten(activeBackgroundColor, 20).hex(), order: 2}
        ]
      }

      setDisplayMode(accessInfo.active_display_mode)
      setActiveOutline(accessInfo.active_outline)
      setActiveColorThemeDetail({
        color_theme_type: colorThemeDetail.color_theme_type,
        color_theme_item_list: colorThemeDetail.color_theme_item_list
      })

      setLoginInfo({
        login_type: accessInfo.login_type,
        email: accessInfo.email
      })
    }
  })
}
