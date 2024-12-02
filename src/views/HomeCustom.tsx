import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, ActivityIndicator, View, Text, Image, Pressable} from 'react-native'
import AppBar from '@/components/AppBar'
import {Timetable} from '@/components/TimeTable'
import {CustomBackgroundBottomSheet} from '@/components/bottomSheet/homeCustom'

import RNFetchBlob from 'rn-fetch-blob'
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {activeBackgroundState, activeThemeState, statusBarColorState, statusBarTextStyleState} from '@/store/system'
import {scheduleListState} from '@/store/schedule'
import {HomeCustomProps} from '@/types/navigation'
import {useUpdateActiveBackgroundId} from '@/apis/hooks/useUser'
import {useGetActiveBackground} from '@/apis/hooks/useProduct'

type ActiveMenu = 'background' | 'outline' | null
const HomeCustom = ({navigation}: HomeCustomProps) => {
  const {mutateAsync: updateActiveBackgroundIdMutateAsync} = useUpdateActiveBackgroundId()
  const {mutateAsync: getActiveBackgroundMutateAsync} = useGetActiveBackground()

  const [isLoading, setIsLoading] = useState(false)
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null)
  const [background, setBackground] = useState<DownloadedBackgroundItem | null>(null)

  const [activeBackground, setActiveBackground] = useRecoilState(activeBackgroundState)
  const scheduleList = useRecoilValue(scheduleListState)
  const activeTheme = useRecoilValue(activeThemeState)
  const setStatusBarColor = useSetRecoilState(statusBarColorState)
  const setStatusBarTextStyle = useSetRecoilState(statusBarTextStyleState)

  const headerButtonTextColor = useMemo(() => {
    return background ? background.accent_color : activeBackground.accent_color
  }, [background, activeBackground.accent_color])

  const getMenuButtonTextStyle = useCallback(
    (type: ActiveMenu) => {
      const color = type === activeMenu ? activeTheme.color7 : activeTheme.color8

      return [styles.menuButtonText, {color}]
    },
    [activeMenu, activeTheme.color7, activeTheme.color8]
  )

  const closeBottomSheet = useCallback(() => {
    setActiveMenu(null)
  }, [])

  const changeActiveMenu = useCallback(
    (type: ActiveMenu) => () => {
      setActiveMenu(type)
    },
    []
  )

  const handleSave = useCallback(async () => {
    if (!background) {
      return
    }

    setIsLoading(true)

    await updateActiveBackgroundIdMutateAsync(background.background_id)
    const _activeBackground = await getActiveBackgroundMutateAsync(background.background_id)

    setActiveBackground(_activeBackground)

    setIsLoading(false)
    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: {scheduleUpdated: false}
    })
  }, [
    background,
    updateActiveBackgroundIdMutateAsync,
    getActiveBackgroundMutateAsync,
    setIsLoading,
    setActiveBackground,
    navigation
  ])

  useEffect(() => {
    if (!background) {
      setBackground(activeBackground)
    }
  }, [background, activeBackground])

  const loadBackground = useCallback(() => {
    if (background) {
      setStatusBarColor(background.background_color)
      setStatusBarTextStyle(background.display_mode === 1 ? 'dark-content' : 'light-content')
    }
  }, [background, setStatusBarColor, setStatusBarTextStyle])

  const backgroundComponent = useMemo(() => {
    if (!background || background.background_id === 1) {
      return <Image style={styles.backgroundImage} source={require('@/assets/beige.png')} onLoad={loadBackground} />
    }

    return (
      <Image
        style={styles.backgroundImage}
        source={{uri: `file://${RNFetchBlob.fs.dirs.DocumentDir}/${background.file_name}`}}
        onLoad={loadBackground}
        onLoadEnd={() => console.log('onLoadEnd')}
      />
    )
  }, [background, loadBackground])

  return (
    <View style={styles.container}>
      {backgroundComponent}

      <AppBar color="transparent">
        <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.headerButtonText, {color: headerButtonTextColor}]}>취소</Text>
        </Pressable>

        <Pressable style={styles.headerButton} onPress={handleSave}>
          <Text style={[styles.headerButtonText, {color: headerButtonTextColor}]}>완료</Text>
        </Pressable>
      </AppBar>

      <View style={styles.timetableWrapper}>
        <Timetable data={scheduleList} readonly isRendered={true} />

        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" animating={isLoading} />
        </View>
      </View>

      <View style={[styles.menuContainer, {backgroundColor: activeTheme.color5, borderTopColor: activeTheme.color6}]}>
        <Pressable style={styles.menuButton} onPress={changeActiveMenu('background')}>
          <Text style={getMenuButtonTextStyle('background')}>배경</Text>
        </Pressable>

        <Pressable style={styles.menuButton} onPress={changeActiveMenu('outline')}>
          <Text style={getMenuButtonTextStyle('outline')}>테두리</Text>
        </Pressable>
      </View>

      <CustomBackgroundBottomSheet
        visible={activeMenu === 'background'}
        value={background}
        onChange={setBackground}
        onDismiss={closeBottomSheet}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  headerButton: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16
  },
  timetableWrapper: {
    marginTop: 36
  },
  loadingWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },

  menuContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    borderTopWidth: 1
  },
  menuButton: {
    paddingHorizontal: 20,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16
  }
})

export default HomeCustom
