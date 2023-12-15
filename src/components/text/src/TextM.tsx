import React from 'react'
import {StyleSheet, Text, TextStyle} from 'react-native'

interface Props {
  children: React.ReactNode
  style: TextStyle
}
const TextM = ({children, style}: Props) => {
  return <Text style={[styles.container, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Pretendard-Medium',
    color: '#000'
  }
})

export default TextM
