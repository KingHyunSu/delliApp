import {useMemo, useCallback} from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import LottieView from 'lottie-react-native'
import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {ScheduleCompleteScreenProps} from '@/types/navigation'

const ScheduleComplete = ({navigation, route}: ScheduleCompleteScreenProps) => {
  const windowDimensions = useRecoilValue(windowDimensionsState)

  const fontSize = useMemo(() => {
    return windowDimensions.width * 0.1
  }, [windowDimensions.width])

  const moveHome = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainTabs',
          state: {
            routes: [{name: 'Home'}]
          }
        }
      ]
    })
  }, [navigation])

  const moveRecord = useCallback(() => {
    navigation.replace('EditScheduleCompleteCard', route.params)
  }, [navigation, route.params])

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <LottieView source={require('@/assets/lottie/congrats.json')} style={styles.lottie} autoPlay loop={false} />
        <Text style={[styles.text, {fontSize}]}>{route.params.complete_count}번 완료했어요!</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <Pressable style={backButtonStyle} onPress={moveHome}>
          <Text style={backButtonTextStyle}>돌아가기</Text>
        </Pressable>
        <Pressable style={recordButtonStyle} onPress={moveRecord}>
          <Text style={recordButtonTextStyle}>기록하기</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff'
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  text: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 40,
    color: '#000000'
  },
  lottie: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  buttonWrapper: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 30
  },
  button: {
    height: 56,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16
  }
})

const backButtonStyle = StyleSheet.compose(styles.button, {backgroundColor: '#efefef'})
const recordButtonStyle = StyleSheet.compose(styles.button, {backgroundColor: '#1E90FF'})
const backButtonTextStyle = StyleSheet.compose(styles.buttonText, {color: '#6B727E'})
const recordButtonTextStyle = StyleSheet.compose(styles.buttonText, {color: '#ffffff'})

export default ScheduleComplete
