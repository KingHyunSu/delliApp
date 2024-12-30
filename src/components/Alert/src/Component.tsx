import {useCallback, useMemo} from 'react'
import {StyleSheet, Modal, View, Text, Pressable} from 'react-native'
import {AlertHandler, AlertInfo, AlertButton} from './types'

interface Props {
  value: AlertInfo | null
  onHide: AlertHandler['hide']
}
const AlertComponent = ({value, onHide}: Props) => {
  const handlePress = useCallback(
    async (item: AlertButton) => {
      try {
        await Promise.resolve(item.onPress())
      } catch (e) {
        console.error('Alert Press Error', e)
      } finally {
        onHide()
      }
    },
    [onHide]
  )

  const buttonListComponent = useMemo(() => {
    if (value && value.buttons) {
      const flexDirection = value.direction ? value.direction : 'row'

      return (
        <View style={[styles.buttonContainer, {flexDirection}]}>
          {value.buttons.map((item, index) => {
            return (
              <Pressable
                key={index}
                style={[
                  styles.button,
                  {
                    flex: flexDirection === 'row' ? 1 : 0,
                    backgroundColor: item.backgroundColor ? item.backgroundColor : '#efefef'
                  }
                ]}
                onPress={() => handlePress(item)}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: item.textColor ? item.textColor : '#424242'
                    }
                  ]}>
                  {item.text}
                </Text>
              </Pressable>
            )
          })}
        </View>
      )
    }

    return <></>
  }, [value, handlePress])

  if (value) {
    return (
      <Modal visible={!!value} transparent>
        <View style={styles.container}>
          <View style={styles.wrapper}>
            {value.title && <Text style={styles.title}>{value.title}</Text>}
            {value.message && <Text style={styles.message}>{value.message}</Text>}

            {buttonListComponent}
          </View>
        </View>
      </Modal>
    )
  }

  return <></>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  wrapper: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 20,
    gap: 10
  },
  title: {
    marginTop: 5,
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#424242',
    paddingHorizontal: 5
  },
  message: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242',
    paddingHorizontal: 5
  },
  buttonContainer: {
    gap: 10,
    marginTop: 15
  },
  button: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    textAlign: 'center'
  }
})

export default AlertComponent
