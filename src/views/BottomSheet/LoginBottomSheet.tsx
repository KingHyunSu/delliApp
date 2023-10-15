import React from 'react'
import {StyleSheet, View, Text, Pressable, Image} from 'react-native'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
// provider
import {login as kakaoLogin} from '@react-native-seoul/kakao-login'
// apis
import {login} from '@/apis/auth'
// utils
import {LOGIN_TYPE} from '@/utils/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useSetRecoilState} from 'recoil'
import {isLoginState} from '@/store/user'

interface Props {
  isShow: boolean
  onClose: Function
}
const LoginBottomSheet = ({isShow, onClose}: Props) => {
  const loginBottomSheetRef = React.useRef<BottomSheetModal>(null)
  const snapPoints = React.useMemo(() => ['50%'], [])

  const setLoginState = useSetRecoilState(isLoginState)

  const onDismiss = () => {
    onClose()
  }

  React.useEffect(() => {
    if (isShow) {
      loginBottomSheetRef.current?.present()
    }
  }, [isShow])

  const signInWithKakao = async (): Promise<void> => {
    try {
      const {accessToken} = await kakaoLogin()

      const params = {
        token: accessToken,
        type: LOGIN_TYPE.KAKAO
      }

      const result = await login(params)

      setLoginState(true)
      await AsyncStorage.setItem('token', result.data.token)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <BottomSheetModal
      name="login"
      ref={loginBottomSheetRef}
      backdropComponent={props => {
        return <BottomSheetBackdrop props={props} />
      }}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}>
      <View style={styles.container}>
        <Text>로그인</Text>

        <View>
          <Pressable onPress={signInWithKakao}>
            <Image
              resizeMode="contain"
              style={{width: 'auto'}}
              source={require('@/assets/images/kakao_login_large_wide.png')}
            />
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'space-between'
  }
})

export default LoginBottomSheet
