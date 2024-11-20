import {ReactNode, useMemo, useCallback} from 'react'
import {Pressable, StyleSheet, Text, View} from 'react-native'
import {navigationRef} from '@/utils/navigation'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'

interface Props {
  title?: string
  backPress?: boolean
  color?: string
  backPressIconColor?: string
  children?: ReactNode
}
const AppBar = ({title, color, backPress = false, backPressIconColor = '#424242', children}: Props) => {
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
          <ArrowLeftIcon width={28} height={28} stroke={backPressIconColor} strokeWidth={3} />
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
    height: 48,
    zIndex: 999
  },
  backButton: {
    zIndex: 999,
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
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
