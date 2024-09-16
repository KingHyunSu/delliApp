import {useMemo} from 'react'
import {StyleSheet, View} from 'react-native'

interface Props {
  color?: string
  children: React.ReactNode
}
const AppBar = ({color, children}: Props) => {
  const containerStyle = useMemo(() => {
    const backgroundColor = color ? color : '#ffffff'

    return [styles.container, {backgroundColor}]
  }, [color])

  return <View style={containerStyle}>{children}</View>
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
