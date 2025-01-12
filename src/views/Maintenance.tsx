import {useEffect} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import SystemSplashScreen from 'react-native-splash-screen'

const Maintenance = () => {
  useEffect(() => {
    SystemSplashScreen.hide()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>시스템 점검중</Text>
        <Text style={styles.subTitle}>서비스 개선을 위하여 점검중입니다</Text>
        <Text style={styles.subTitle}>이용에 불편을 드려서 죄송합니다</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {
    gap: 5
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15
  },
  subTitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#000000',
    textAlign: 'center'
  }
})

export default Maintenance
