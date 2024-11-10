import {useCallback} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import ThemeList from '@/views/theme/ThemeList'
import {StoreListScreenProps} from '@/types/navigation'

const StoreList = ({navigation}: StoreListScreenProps) => {
  const moveThemeDetail = useCallback(
    (id: number) => {
      navigation.navigate('ThemeDetail', {id})
    },
    [navigation]
  )

  return (
    <View style={styles.container}>
      <View style={appBarStyles.container}>
        <Text style={appBarStyles.title}>상점</Text>
      </View>

      <ThemeList moveDetail={moveThemeDetail} />
    </View>
  )
}

const appBarStyles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingVertical: 30
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#000000'
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8'
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 30
  },
  listColumnWrapper: {
    gap: 10
  }
})

export default StoreList
