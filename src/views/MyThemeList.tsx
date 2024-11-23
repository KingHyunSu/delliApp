import {useCallback, useEffect, useMemo, useState} from 'react'
import {StyleSheet, View, Text, FlatList, ListRenderItem, Pressable, Image} from 'react-native'
import AppBar from '@/components/AppBar'
import CheckIcon from '@/assets/icons/check.svg'
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {activeThemeState, alertState, windowDimensionsState} from '@/store/system'
import {useGetActiveTheme, useGetMyThemeList} from '@/apis/hooks/useProduct'
import {useUpdateTheme} from '@/apis/hooks/useUser'

const MyThemeList = () => {
  const {mutateAsync: getMyThemeListMutateAsync} = useGetMyThemeList()
  const {mutateAsync: updateThemeMutateAsync} = useUpdateTheme()
  const {mutateAsync: getActiveThemeMutateAsync} = useGetActiveTheme()

  const [myThemeList, setMyThemeList] = useState<MyThemeListItem[]>([])

  const [activeTheme, setActiveTheme] = useRecoilState(activeThemeState)
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const alert = useSetRecoilState(alertState)

  const imageWidth = useMemo(() => {
    const totalPadding = 40
    const totalGap = 20
    return (windowDimensions.width - totalPadding - totalGap) / 3
  }, [windowDimensions.width])

  const changeActiveTheme = useCallback(
    (id: number) => () => {
      if (id === activeTheme.theme_id) {
        return
      }

      alert({
        type: 'primary',
        title: '테마를 변경할까요?',
        confirmButtonText: '변경하기',
        confirmFn: async () => {
          await updateThemeMutateAsync(id)
          const themeDetail = await getActiveThemeMutateAsync(id)

          setActiveTheme(themeDetail)
        }
      })
    },
    [activeTheme.theme_id, updateThemeMutateAsync, getActiveThemeMutateAsync, setActiveTheme]
  )

  useEffect(() => {
    const init = async () => {
      const _myThemeList = await getMyThemeListMutateAsync()
      setMyThemeList(_myThemeList)
    }

    init()
  }, [getMyThemeListMutateAsync, setMyThemeList])

  const getRenderItem: ListRenderItem<MyThemeListItem> = useCallback(
    ({item}) => {
      const aspectRatio = 1.77

      const isActive = activeTheme.theme_id === item.theme_id

      return (
        <Pressable style={itemStyles.container} onPress={changeActiveTheme(item.theme_id)}>
          <Image
            style={{width: imageWidth, height: imageWidth * aspectRatio, borderRadius: 10}}
            source={{uri: item.thumb_url}}
          />

          {isActive && (
            <View style={[itemStyles.overlap, {width: imageWidth, height: imageWidth * aspectRatio}]}>
              <CheckIcon width="30%" height="30%" strokeWidth={3} stroke="#f5f6f8" />
            </View>
          )}

          <View style={itemStyles.textContainer}>
            <Text style={itemStyles.title}>{item.title}</Text>
          </View>
        </Pressable>
      )
    },
    [activeTheme, imageWidth]
  )

  return (
    <View style={styles.container}>
      <AppBar color="#f5f6f8" backPress />

      <Text style={styles.label}>내 테마</Text>

      <FlatList
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.listColumnWrapper}
        data={myThemeList}
        renderItem={getRenderItem}
        numColumns={3}
      />
    </View>
  )
}

const itemStyles = StyleSheet.create({
  container: {
    gap: 5
  },
  overlap: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000030',
    borderRadius: 10
  },
  textContainer: {
    paddingLeft: 5
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#424242'
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8'
  },
  label: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#000000',
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 30
  },
  listContainer: {
    paddingHorizontal: 16
  },
  listColumnWrapper: {
    gap: 10
  }
})

export default MyThemeList
