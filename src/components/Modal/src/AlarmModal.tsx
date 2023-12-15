import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

import ModalContainer from './ModalContainer'

export interface Ref {
  open: Function
  close: Function
}
interface Props {}
export const AlarmModal = React.forwardRef<Ref, Props>(({}, ref) => {
  const timeList = ['5', '10', '15', '30', '60']

  const [visible, setVisible] = React.useState(false)

  const open = () => {
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  React.useImperativeHandle(ref, () => ({
    open,
    close
  }))

  return (
    <ModalContainer visible={visible}>
      <View style={styles.container}>
        {timeList.map(item => {
          return (
            <View style={styles.row}>{item === '60' ? <Text>{`1시간 전`}</Text> : <Text>{`${item}분 전`}</Text>}</View>
          )
        })}
      </View>
    </ModalContainer>
  )
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15
  },
  row: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    borderBottomWidth: 1
  }
})
