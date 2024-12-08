import {useMemo, useCallback} from 'react'
import {StyleSheet, Pressable, Text, View} from 'react-native'
import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'

interface Props {
  isPurchased: boolean
  onClick: () => void
}
const Footer = ({isPurchased, onClick}: Props) => {
  const activeTheme = useRecoilValue(activeThemeState)

  const buttonStyle = useMemo(() => {
    const backgroundColor = isPurchased ? '#efefef' : '#1E90FF'

    return [styles.button, {backgroundColor}]
  }, [isPurchased])

  const buttonTextStyle = useMemo(() => {
    const color = isPurchased ? '#6B727E' : '#ffffff'

    return [styles.buttonText, {color}]
  }, [isPurchased])

  const handleClick = useCallback(() => {
    if (isPurchased) {
      return
    }

    onClick()
  }, [isPurchased, onClick])

  return (
    <View style={[styles.container, {backgroundColor: activeTheme.color5}]}>
      <Pressable style={buttonStyle} onPress={handleClick}>
        <Text style={buttonTextStyle}>{isPurchased ? '구매완료' : '받기'}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 45
  },
  button: {
    height: 52,
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold'
  }
})

export default Footer
