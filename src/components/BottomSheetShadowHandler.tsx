import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Shadow} from 'react-native-shadow-2'

const BottomSheetShadowHandler = () => {
  return (
    <Shadow
      startColor="#f0eff586"
      distance={10}
      sides={{top: true, bottom: false, start: false, end: false}}
      corners={{
        topStart: true,
        topEnd: true,
        bottomStart: false,
        bottomEnd: false
      }}
      style={styles.shadowContainer}>
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
    </Shadow>
  )
}

const styles = StyleSheet.create({
  shadowContainer: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 2,
    borderColor: '#e7e7eb89',

    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12
  },
  handle: {
    width: 30,
    height: 4,
    backgroundColor: 'gray',
    borderRadius: 4
  }
})

export default BottomSheetShadowHandler
