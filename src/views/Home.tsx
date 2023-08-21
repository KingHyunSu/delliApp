import React from 'react'
import {View, Text, Pressable} from 'react-native'

import {KakaoOAuthToken, login} from '@react-native-seoul/kakao-login'

const Home = () => {
  const signInWithKakao = async (): Promise<void> => {
    const token: KakaoOAuthToken = await login()

    console.log(JSON.stringify(token))
  }

  return (
    <View>
      <Text>Home</Text>
      <Pressable onPress={signInWithKakao}>
        <Text>카카오 로그인</Text>
      </Pressable>
    </View>
  )
}

export default Home
