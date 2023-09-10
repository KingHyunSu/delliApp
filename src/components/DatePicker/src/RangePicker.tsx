import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

import {RangeFlag} from '../type'
import {RANGE_FLAG} from '../utils/code'

interface Props {
  date: string[]
  flag: RangeFlag
  onChange: Function
}
const RangePicker = ({date, flag, onChange}: Props) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.wrapper} onPress={() => onChange(RANGE_FLAG.START)}>
        <Text style={[styles.label, flag === 1 && styles.active]}>시작일</Text>
        <Text style={styles.text}>{date[0]}</Text>
      </Pressable>

      <View style={styles.bar} />

      <Pressable style={styles.wrapper} onPress={() => onChange(RANGE_FLAG.END)}>
        <Text style={[styles.label, flag === 0 && styles.active]}>종료일</Text>
        <Text style={styles.text}>{date[1] === '9999-12-31' ? '없음' : date[1]}</Text>
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
    fontSize: 14
    // color: '#BABABA'
  },
  text: {
    fontSize: 14
    // color: '#BABABA'
  },
  active: {
    color: '#1E90FF',
    fontWeight: 'bold'
  }
})
export default RangePicker
