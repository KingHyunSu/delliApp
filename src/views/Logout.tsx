import React from 'react'
import {View} from 'react-native'

import {useSetRecoilState} from 'recoil'
import {loginState, isLunchState} from '@/store/system'

const Logout = () => {
  const setIsLogin = useSetRecoilState(loginState)
  const setIsLunch = useSetRecoilState(isLunchState)

  React.useEffect(() => {
    setIsLogin(false)
    setIsLunch(true)
  }, [])

  return <View />
}

export default Logout
