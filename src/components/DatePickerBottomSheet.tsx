import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import {Shadow} from 'react-native-shadow-2'

const ShadowHandler = () => {
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
      style={shadowStyles.shadowContainer}>
      <View style={shadowStyles.handleContainer}>
        <View style={shadowStyles.handle} />
      </View>
    </Shadow>
  )
}

const shadowStyles = StyleSheet.create({
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

const DatePickerBottomSheet = () => {
  // ref
  const bottomSheetRef = React.useRef<BottomSheet>(null)

  // variables
  const snapPoints = React.useMemo(() => ['25%', '50%'], [])

  // callbacks
  const handleSheetChanges = React.useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        detached
        // handleComponent={ShadowHandler}
        onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey'
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center'
  }
})

export default DatePickerBottomSheet
