import {useMemo, useCallback} from 'react'
import {Pressable, StyleSheet, Text, View} from 'react-native'
import {navigationRef} from '@/utils/navigation'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'

interface Props {
  title?: string
  color?: string
  backPress?: boolean
  children?: React.ReactNode
}
const AppBar = ({title, color, backPress = false, children}: Props) => {
  const containerStyle = useMemo(() => {
    const backgroundColor = color ? color : '#ffffff'

    return [styles.container, {backgroundColor}]
  }, [color])

  const goBack = useCallback(() => {
    navigationRef.current?.goBack()
  }, [])

  return (
    <View style={containerStyle}>
      {backPress && (
        <Pressable style={styles.backButton} onPress={goBack}>
          <ArrowLeftIcon stroke="#424242" strokeWidth={3} />
        </Pressable>
      )}

      {title && <Text style={styles.title}>{title}</Text>}

      {children && children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48
  },
  backButton: {
    zIndex: 999,
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
    // paddingLeft: 10
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#424242'
  }
})

export default AppBar
