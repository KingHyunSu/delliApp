import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

import {RANGE_FLAG} from '@/utils/types'

interface Props {
  value: string[]
  flag: RANGE_FLAG
  onChange?: Function
}
const RangePicker = ({value, flag, onChange}: Props) => {
  const changeStart = () => {
    if (onChange) {
      onChange(RANGE_FLAG.START)
    }
  }
  const changeEnd = () => {
    if (onChange) {
      onChange(RANGE_FLAG.END)
    }
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.wrapper} onPress={changeStart}>
        <Text style={[styles.label, flag === 1 && styles.active]}>시작일</Text>
        <Text style={styles.text}>{value[0]}</Text>
      </Pressable>

      <Pressable style={styles.wrapper} onPress={changeEnd}>
        <Text style={[styles.label, flag === 0 && styles.active]}>종료일</Text>
        <Text style={styles.text}>{value[1] === '9999-12-31' ? '없음' : value[1]}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4ec'
  },
  wrapper: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bar: {
    width: 1,
    height: 15,
    backgroundColor: '#e4e4ec'
  },
  label: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#000'
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#000'
  },
  active: {
    fontFamily: 'Pretendard-Bold',
    color: '#1E90FF'
  }
})
export default RangePicker
