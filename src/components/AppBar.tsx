import {ReactNode, useCallback} from 'react'
import {Pressable, StyleSheet, Text, View} from 'react-native'
import {navigationRef} from '@/utils/navigation'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'

interface Props {
  title?: string
  backPress?: boolean
  backgroundColor?: string
  color?: string
  children?: ReactNode
}
const AppBar = ({title, backgroundColor = 'transparent', color = '#424242', backPress = false, children}: Props) => {
  const goBack = useCallback(() => {
    navigationRef.current?.goBack()
  }, [])

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {backPress && (
        <Pressable style={styles.backButton} onPress={goBack}>
          <ArrowLeftIcon width={28} height={28} stroke={color} strokeWidth={3} />
        </Pressable>
      )}

      {title && (
        <Text numberOfLines={1} style={[styles.title, {color}]}>
          {title}
        </Text>
      )}

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
