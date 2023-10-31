import React from 'react'
import {StyleSheet, ScrollView, Pressable, View, Text} from 'react-native'
import AppBar from '@/components/AppBar'

import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'
import ArrowRightIcon from '@/assets/icons/arrow_right.svg'

import {SettingNavigationProps} from '@/types/navigation'

const Setting = ({navigation}: SettingNavigationProps) => {
  return (
    <View style={styles.container}>
      <AppBar>
        <View style={{flex: 1}}>
          <Pressable style={styles.backButton} onPress={navigation.goBack}>
            <ArrowLeftIcon stroke="#242933" />
          </Pressable>
        </View>

        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.appBarTitle}>설정</Text>
        </View>

        <View style={{flex: 1}} />
      </AppBar>

      <ScrollView style={styles.contents}>
        <Pressable style={styles.item}>
          <Text style={styles.contentText}>서비스 이용 약관</Text>
          <ArrowRightIcon stroke="#242933" />
        </Pressable>

        <Pressable style={styles.item}>
          <Text style={styles.contentText}>개인정보 처리방침</Text>
          <ArrowRightIcon stroke="#242933" />
        </Pressable>

        <View style={styles.footer}>
          <View style={styles.item}>
            <Text style={styles.contentText}>버전</Text>
            <Text style={styles.contentText}>1.0.0</Text>
          </View>

          <Pressable style={styles.item}>
            <Text style={styles.contentText}>로그아웃</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contents: {
    paddingVertical: 20
  },
  footer: {
    marginTop: 20
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  appBarTitle: {
    fontFamily: 'GmarketSansTTFMidium',
    fontSize: 16
  },
  contentText: {
    fontFamily: 'GmarketSansTTFMidium',
    fontSize: 16
  },
  backButton: {
    width: 40,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Setting
