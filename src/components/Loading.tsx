import React from 'react'
import {useWindowDimensions, StyleSheet, Platform, StatusBar, Modal} from 'react-native'
import {getStatusBarHeight} from 'react-native-status-bar-height'
import LottieView from 'lottie-react-native'

import {useRecoilValue} from 'recoil'
import {isLoadingState} from '@/store/system'

const Loading = () => {
  const isLoading = useRecoilValue(isLoadingState)

  const {width, height} = useWindowDimensions()
  const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight || 0

  const top = React.useMemo(() => {
    return height * 0.28 + 135 + statusBarHeight - 20
  }, [height, statusBarHeight])

  const left = React.useMemo(() => {
    return width / 2 - 20
  }, [width])

  return (
    <Modal visible={isLoading} transparent={true} animationType="none">
      <LottieView
        speed={1.2}
        source={require('@/assets/lottie/loading.json')}
        autoPlay
        loop
        style={[styles.spinner, {top, left}]}
        colorFilters={[
          {
            keypath: 'ÐÐ¸Ð½ÑÑÑ',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð§Ð°ÑÑ',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 12',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 11',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 13',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 14',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 10',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 9',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 8',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 7',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 6',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 5',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 4',
            color: '#4e4e4e'
          },
          {
            keypath: 'Ð¡Ð»Ð¾Ð¹-ÑÐ¸Ð³ÑÑÐ° 2',
            color: '#4e4e4e'
          }
        ]}
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  spinner: {
    width: 40,
    height: 40,
    position: 'absolute'
  }
})

export default Loading
