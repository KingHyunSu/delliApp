import {useState, useMemo, useCallback} from 'react'
import {StyleSheet, BackHandler, ActivityIndicator, View, Text, Image, Pressable} from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import AppBar from '@/components/AppBar'
import {Timetable} from '@/components/TimeTable'
import HomeCustomBottomSheet from '@/components/bottomSheet/HomeCustomBottomSheet'
import OutlineColorPickerModal from '@/components/modal/OutlineColorPickerModal'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {
  activeBackgroundState,
  activeOutlineState,
  activeThemeState,
  statusBarColorState,
  statusBarTextStyleState
} from '@/store/system'
import {scheduleListState} from '@/store/schedule'
import {HomeCustomProps} from '@/types/navigation'
import {useUpdateCustom} from '@/apis/hooks/useUser'

import {useUpdateWidgetStyle} from '@/utils/hooks/useWidget'

type ActiveMenu = 'background' | 'outline' | null
const HomeCustom = ({navigation}: HomeCustomProps) => {
  const {mutateAsync: updateCustomMutateAsync} = useUpdateCustom()

  const updateWidgetStyle = useUpdateWidgetStyle()

  const [isLoading, setIsLoading] = useState(false)
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null)

  const [activeBackground, setActiveBackground] = useRecoilState(activeBackgroundState)
  const [activeOutline, setActiveOutline] = useRecoilState(activeOutlineState)
  const scheduleList = useRecoilValue(scheduleListState)
  const activeTheme = useRecoilValue(activeThemeState)
  const setStatusBarColor = useSetRecoilState(statusBarColorState)
  const setStatusBarTextStyle = useSetRecoilState(statusBarTextStyleState)

  const [background, setBackground] = useState(activeBackground)
  const [outline, setOutline] = useState(activeOutline)

  const getMenuButtonTextStyle = useCallback(
    (type: ActiveMenu) => {
      const color = type === activeMenu ? activeTheme.color7 : activeTheme.color8

      return [styles.menuButtonText, {color}]
    },
    [activeMenu, activeTheme.color7, activeTheme.color8]
  )

  const moveHome = useCallback(() => {
    navigation.navigate('MainTabs', {
      screen: 'Home'
    })
  }, [navigation])

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
    setIsLoading(true)

    const response = await updateCustomMutateAsync({
      active_background_id: background.background_id,
      active_outline_id: outline.product_outline_id,
      my_outline_id: outline.my_outline_id,
      outline_background_color: outline.background_color,
      outline_progress_color: outline.progress_color
    })

    if (response.result) {
      await updateWidgetStyle({
        outline_background_color: outline.background_color,
        outline_progress_color: outline.progress_color,
        background_color: background.background_color,
        text_color: background.accent_color
      })

      setActiveBackground(background)
      setActiveOutline(outline)

      navigation.navigate('MainTabs', {
        screen: 'Home'
      })
    }

    setIsLoading(false)
  }, [background, outline, updateCustomMutateAsync, setIsLoading, setActiveBackground, setActiveOutline, navigation])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (activeMenu) {
          setActiveMenu(null)
        } else {
          navigation.navigate('MainTabs', {
            screen: 'Home'
          })
        }

        return true
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => subscription.remove()
    }, [activeMenu, navigation])
  )

  const loadBackground = useCallback(() => {
    setStatusBarColor(background.background_color)
    setStatusBarTextStyle(background.display_mode === 1 ? 'dark-content' : 'light-content')
  }, [background, setStatusBarColor, setStatusBarTextStyle])

  const backgroundComponent = useMemo(() => {
    if (background.background_id === 1) {
      return <Image style={styles.backgroundImage} source={require('@/assets/beige.png')} onLoad={loadBackground} />
    }

    return (
      <Image
        style={styles.backgroundImage}
        source={{uri: background.main_url}}
        onLoad={loadBackground}
        onLoadEnd={() => console.log('onLoadEnd')}
      />
    )
  }, [background, loadBackground])

  return (
    <View style={styles.container}>
      {backgroundComponent}

      <AppBar>
        <Pressable style={styles.headerButton} onPress={moveHome}>
          <Text style={[styles.headerButtonText, {color: background.accent_color}]}>취소</Text>
        </Pressable>

        <Pressable style={styles.headerButton} onPress={handleSave}>
          <Text style={[styles.headerButtonText, {color: background.accent_color}]}>완료</Text>
        </Pressable>
      </AppBar>

      <View style={styles.timetableWrapper}>
        <Timetable data={scheduleList} readonly outline={outline} />

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

      <HomeCustomBottomSheet
        visible={!!activeMenu}
        activeMenu={activeMenu}
        activeBackground={background}
        activeOutline={outline}
        onChangeBackground={setBackground}
        onDismiss={closeBottomSheet}
      />

      <OutlineColorPickerModal value={outline} activeBackground={background} onChange={setOutline} />
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
