import React from 'react'
import {StyleSheet, View, Text, Pressable, Image} from 'react-native'
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet'
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
  const setLoginState = useSetRecoilState(isLoginState)
  const bottomSheetRef = React.useRef<BottomSheet>(null)

  const snapPoints = React.useMemo(() => ['50%'], [])

  const handleSheetChanges = (index: number) => {
    if (bottomSheetRef?.current && index === -1) {
      onClose()
    }
  }

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

  React.useEffect(() => {
    if (isShow) {
      bottomSheetRef.current?.expand()
    }
  }, [isShow])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={handleSheetChanges}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.5}
          // enableTouchThrough={false}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          style={[{backgroundColor: 'rgba(0, 0, 0, 1)'}, StyleSheet.absoluteFillObject]}
        />
      )}>
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
    </BottomSheet>
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
