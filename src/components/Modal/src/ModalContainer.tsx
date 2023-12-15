import React from 'react'
import {StyleSheet, Modal, View} from 'react-native'

interface Props {
  visible: boolean
  children: React.ReactNode
}
const ModalContainer = ({visible, children}: Props) => {
  return (
    <Modal visible={visible} animationType="none" transparent={true}>
      <View style={styles.container}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ModalContainer
