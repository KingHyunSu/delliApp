import {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {
  ListRenderItem,
  ImageSourcePropType,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  View,
  Text,
  Pressable,
  Image
} from 'react-native'
import Loading from '@/components/Loading'
import KakaoLogoIcon from '@/assets/icons/kakaoLogo.svg'
import AppleLogoIcon from '@/assets/icons/appleLogo.svg'
import GoogleLogoIcon from '@/assets/icons/googleLogo.svg'

import AsyncStorage from '@react-native-async-storage/async-storage'
import {useAlert} from '@/components/Alert'

import {useRecoilValue, useSetRecoilState} from 'recoil'
import {loginState, windowDimensionsState} from '@/store/system'

import {useAccess} from '@/apis/hooks/useAuth'
import {login} from '@/apis/server/auth'
import {login as kakaoLogin} from '@react-native-seoul/kakao-login'
import {appleAuth} from '@invertase/react-native-apple-authentication'
import {GoogleSignin} from '@react-native-google-signin/google-signin'

import {IntroScreenProps} from '@/types/navigation'
import {LOGIN_TYPE} from '@/utils/types'
import SystemSplashScreen from 'react-native-splash-screen'

type Item = {url: ImageSourcePropType}
const Intro = ({navigation}: IntroScreenProps) => {
  const alert = useAlert()
  const {mutateAsync: accessMutateAsync} = useAccess()

  const flatListRef = useRef<FlatList>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const setIsLogin = useSetRecoilState(loginState)

  const imageList = useMemo(() => {
    return [
      {url: require('@/assets/images/login/1.png')},
      {url: require('@/assets/images/login/2.png')},
      {url: require('@/assets/images/login/3.png')},
      {url: require('@/assets/images/login/4.png')},
      {url: require('@/assets/images/login/5.png')}
    ]
  }, [])

  const getDotStyle = useCallback(
    (index: number) => {
      const backgroundColor = activeIndex === index ? '#1E90FF' : '#efefef'

      return [styles.dot, {backgroundColor}]
    },
    [activeIndex]
  )

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = e.nativeEvent.contentOffset.x
      const index = Math.floor(contentOffsetX / windowDimensions.width)

      setActiveIndex(index)
    },
    [windowDimensions.width]
  )

  const handleError = useCallback(() => {
    alert.show({
      title: '로그인 실패',
      message: '잠시 후 다시 시도해 주세요',
      buttons: [
        {
          text: '확인',
          onPress: () => {}
        }
      ]
    })
  }, [alert])

  const handleLogin = useCallback(
    async (type: (typeof LOGIN_TYPE)[keyof typeof LOGIN_TYPE], token: string) => {
      const response = await login({login_type: type, token})

      if (response.code === '2000') {
        await AsyncStorage.setItem('token', response.data.token)
        await accessMutateAsync()

        setIsLogin(true)
      } else if (response.code === '4000') {
        navigation.navigate('JoinTerms', {type, token})
      } else {
        console.error('login error')
      }
    },
    [navigation, accessMutateAsync, setIsLogin]
  )

  const signInWithGuest = useCallback(async () => {
    navigation.navigate('JoinTerms', {type: LOGIN_TYPE.GUEST, token: ''})
  }, [navigation])

  const signInWithKakao = useCallback(async () => {
    try {
      setIsLoading(true)

      const {accessToken} = await kakaoLogin()
      await handleLogin(LOGIN_TYPE.KAKAO, accessToken)
    } catch (e) {
      handleError()
    } finally {
      setIsLoading(false)
    }
  }, [handleLogin, handleError])

  const singInWithApple = useCallback(async () => {
    try {
      setIsLoading(true)

      const response = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL]
      })

      const credentialState = await appleAuth.getCredentialStateForUser(response.user)

      if (credentialState === appleAuth.State.AUTHORIZED && response.identityToken) {
        await handleLogin(LOGIN_TYPE.APPLE, response.identityToken)
      }
    } catch (e: any) {
      if (e.code !== appleAuth.Error.CANCELED) {
        handleError()
      }
    } finally {
      setIsLoading(false)
    }
  }, [handleLogin, handleError])

  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true)

      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()

      if (response.idToken) {
        await handleLogin(LOGIN_TYPE.GOOGLE, response.idToken)
      }
    } catch (e) {
      handleError()
    } finally {
      setIsLoading(false)
    }
  }, [handleLogin, handleError])

  const getRenderItem: ListRenderItem<Item> = useCallback(
    ({item}) => {
      const itemWidth = windowDimensions.width
      const itemHeight = windowDimensions.height * 0.5
      const imageWidth = itemHeight * (480 / 1040)

      return (
        <View style={[styles.itemWrapper, {width: itemWidth}]}>
          <Image
            source={item.url}
            resizeMode="contain"
            style={[styles.itemImage, {width: imageWidth, height: itemHeight}]}
          />
        </View>
      )
    },
    [windowDimensions]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % imageList.length)
    }, 3000)

    if (isLoading) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isLoading, imageList.length])

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: activeIndex,
        animated: true
      })
    }
  }, [activeIndex])

  useEffect(() => {
    SystemSplashScreen.hide()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator animating={isLoading} color="#424242" size="large" />
        </View>
      )}

      <View style={styles.imageContainer}>
        <FlatList
          ref={flatListRef}
          data={imageList}
          renderItem={getRenderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={windowDimensions.width}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        />

        <View style={styles.dotWrapper}>
          {imageList.map((item, index) => {
            return <View key={String(index)} style={getDotStyle(index)} />
          })}
        </View>
      </View>

      <View style={styles.loginButtonContainer}>
        <Text style={styles.loginLabel}>SNS 계정으로 로그인하기</Text>

        <View style={styles.loginButtonWrapper}>
          <Pressable style={kakaoLoginButton} onPress={signInWithKakao}>
            <KakaoLogoIcon width={26} height={26} />
          </Pressable>

          {Platform.OS === 'ios' && (
            <Pressable onPress={singInWithApple}>
              <Image source={require('@/assets/icons/appleLogo.png')} style={{width: 52, height: 52}} />
            </Pressable>
          )}

          <Pressable style={googleLoginButton} onPress={signInWithGoogle}>
            <GoogleLogoIcon width={26} height={26} />
          </Pressable>
        </View>

        <Pressable style={styles.guestLoginButton} onPress={signInWithGuest}>
          <Text style={styles.guestLoginButtonText}>게스트로 사용하기</Text>
        </Pressable>
      </View>

      <Loading />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between'
  },
  loadingWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff90',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  imageContainer: {
    marginTop: '15%',
    gap: 20
  },
  itemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  itemText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#000'
  },
  itemImage: {
    height: '100%',
    borderWidth: 1,
    borderColor: '#efefef',
    borderRadius: 15
  },

  dotWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },

  loginButtonContainer: {
    paddingBottom: 30,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  loginButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 20,
    marginBottom: 30
  },
  loginLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#777777'
  },
  loginButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center'
  },
  guestLoginButton: {
    width: '70%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#777777'
  },
  guestLoginButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#777777'
  }
})

const kakaoLoginButton = StyleSheet.compose(styles.loginButton, {backgroundColor: '#FEE500'})
const googleLoginButton = StyleSheet.compose(styles.loginButton, {
  backgroundColor: '#ffffff',
  borderColor: '#F2F2F2',
  borderWidth: 1
})

export default Intro
