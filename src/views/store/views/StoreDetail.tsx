import {useMemo} from 'react'
import {StyleSheet, View} from 'react-native'
import AppBar from '@/components/AppBar'
import {StoreDetailScreenProps} from '@/types/navigation'
import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'
import BackgroundDetail from '@/views/store/components/BackgroundDetail'
import PurchaseCompleteModal from '@/components/modal/PurchaseCompleteModal'

const StoreDetail = ({route}: StoreDetailScreenProps) => {
  const activeTheme = useRecoilValue(activeThemeState)

  const contentsComponent = useMemo(() => {
    switch (route.params.type) {
      case 'background':
        return <BackgroundDetail id={route.params.id} />
      default:
        return <></>
    }
  }, [route.params.type, route.params.id])

  return (
    <View style={[styles.container]}>
      <AppBar backPress backgroundColor={activeTheme.color1} color={activeTheme.color3} />

      {contentsComponent}

      <PurchaseCompleteModal />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default StoreDetail
