import React from 'react'
import {StyleSheet, View} from 'react-native'

interface Props {
  children: React.ReactNode
}
const AppBar = ({children}: Props) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48
  }
})

export default AppBar
