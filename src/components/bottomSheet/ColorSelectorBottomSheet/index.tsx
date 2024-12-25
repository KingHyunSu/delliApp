import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {ViewStyle, StyleSheet, View, Pressable, Text} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetFooter,
  BottomSheetHandleProps,
  BottomSheetBackdropProps,
  BottomSheetFooterProps
} from '@gorhom/bottom-sheet'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import {Shadow} from 'react-native-shadow-2'
import CustomBackdrop from './src/CustomBackdrop'
import DefaultColorList from './src/DefaultColorList'
import MyColorList from './src/MyColorList'
import ThemeColorList from './src/ThemeColorList'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {showColorSelectorBottomSheetState} from '@/store/bottomSheet'
import {
  activeThemeState,
  editScheduleListSnapPointState,
  safeAreaInsetsState,
  toastState,
  windowDimensionsState
} from '@/store/system'
import {colorToChangeState} from '@/store/schedule'
import {showColorPickerModalState} from '@/store/modal'
import {useDeleteScheduleColor, useGetScheduleColorList} from '@/apis/hooks/useColor'
import {useQueryClient} from '@tanstack/react-query'
import {trigger} from 'react-native-haptic-feedback'

type CategoryTab = 'theme' | 'custom'
type CustomTab = 'default' | 'my'
interface Props {
  data: EditScheduleForm
  colorThemeDetail: ColorThemeDetail
  editColorThemeDetail: EditColorThemeDetail
  onChange: (value: EditScheduleForm) => void
  onChangeEditColorThemeDetail: (value: EditColorThemeDetail) => void
}
const ColorSelectorBottomSheet = ({
  data,
  colorThemeDetail,
  editColorThemeDetail,
  onChange,
  onChangeEditColorThemeDetail
}: Props) => {
  const queryClient = useQueryClient()

  const {data: myColorList} = useGetScheduleColorList()
  const {mutateAsync: deleteMyColorMutateAsync} = useDeleteScheduleColor()

  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const isRender = useRef(false)

  const [activeCategoryTab, setActiveCategoryTab] = useState<CategoryTab>('custom')
  const [activeCustomTab, setActiveCustomTab] = useState<CustomTab>('default')
  const [isActiveDeleteMyColor, setIsActiveDeleteMyColor] = useState(false)
  const [deleteMyColorList, setDeleteMyColorList] = useState<number[]>([])

  const [showColorSelectorBottomSheet, setShowColorSelectorBottomSheet] = useRecoilState(
    showColorSelectorBottomSheetState
  )
  const [showColorPickerModal, setShowColorPickerModal] = useRecoilState(showColorPickerModalState)

  const activeTheme = useRecoilValue(activeThemeState)
  const [minEditScheduleListSnapPoint] = useRecoilValue(editScheduleListSnapPointState)
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)
  const colorToChange = useRecoilValue(colorToChangeState)
  const toast = useSetRecoilState(toastState)

  const getTabButtonTextStyle = useCallback(
    (type: CustomTab) => {
      return [styles.tabButtonText, {color: activeCustomTab === type ? activeTheme.color7 : activeTheme.color8}]
    },
    [activeTheme.color7, activeTheme.color8, activeCustomTab]
  )

  const colorButtonStyle = useMemo(() => {
    return [styles.colorButton, {borderColor: activeTheme.color6}] as ViewStyle
  }, [activeTheme.color6])

  const activeColorPointStyle = useMemo(() => {
    return [styles.activeColorPoint, {borderColor: activeTheme.color6}] as ViewStyle
  }, [activeTheme.color6])

  const activeColor = useMemo(() => {
    switch (colorToChange) {
      case 'background':
        return data.background_color
      case 'font':
        return data.text_color
      default:
        return ''
    }
  }, [data.background_color, data.text_color, colorToChange])

  const convertMyColorList = useMemo(() => {
    if (myColorList.length % 5 !== 0) {
      const emptyCount = 5 - (myColorList.length % 5)
      const newMyColorList = [...myColorList]

      for (let i = 0; i < emptyCount; i++) {
        newMyColorList.push({schedule_color_id: -1, color: ''})
      }

      return newMyColorList
    }
    return myColorList
  }, [myColorList])

  const snapPoints = useMemo(() => {
    const controlTypeButtonWrapperHeight = 70
    const colorTypeButtonWrapperHeight = 62

    const minSnapPoint = minEditScheduleListSnapPoint + safeAreaInsets.bottom
    const maxSnapPoint =
      windowDimensions.height - (safeAreaInsets.top + controlTypeButtonWrapperHeight + colorTypeButtonWrapperHeight)

    return [minSnapPoint, maxSnapPoint]
  }, [minEditScheduleListSnapPoint, safeAreaInsets.top, safeAreaInsets.bottom, windowDimensions.height])

  const handleClose = useCallback(() => {
    setShowColorSelectorBottomSheet(false)
  }, [setShowColorSelectorBottomSheet])

  const handleItemLongPress = useCallback((item: Color) => {
    trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    })

    setIsActiveDeleteMyColor(true)
    setDeleteMyColorList(prevState => [...prevState, item.schedule_color_id])
  }, [])

  const changeColor = useCallback(
    (color: string) => {
      if (editColorThemeDetail.isActiveColorTheme) {
        onChangeEditColorThemeDetail({
          isActiveColorTheme: false,
          colorThemeItemList: editColorThemeDetail.colorThemeItemList
        })

        toast({visible: true, message: '테마 적용이 취소됐어요'})
      }

      if (colorToChange === 'background') {
        onChange({...data, background_color: color})
      } else if (colorToChange === 'font') {
        onChange({...data, text_color: color})
      }
    },
    [
      toast,
      colorToChange,
      onChangeEditColorThemeDetail,
      editColorThemeDetail.isActiveColorTheme,
      editColorThemeDetail.colorThemeItemList,
      data,
      onChange
    ]
  )

  const changeMyColor = useCallback(
    (item: Color) => {
      if (activeCategoryTab === 'custom' && activeCustomTab === 'my' && isActiveDeleteMyColor) {
        setDeleteMyColorList(prevState => [...prevState, item.schedule_color_id])
      } else {
        changeColor(item.color)
      }
    },
    [activeCategoryTab, activeCustomTab, isActiveDeleteMyColor, changeColor]
  )

  const resetDeleteMyItem = useCallback(() => {
    setIsActiveDeleteMyColor(false)
    setDeleteMyColorList([])
  }, [])

  const changeCategoryTab = useCallback(
    (tab: CategoryTab) => {
      if (tab === activeCategoryTab) {
        return
      }

      if (tab === 'theme') {
        let editColorThemeItemList: EditColorThemeItem[] = editColorThemeDetail.colorThemeItemList

        if (editColorThemeItemList.length === 0) {
          const initColorThemeItem1: EditColorThemeItem = {
            color_theme_item_id: -1,
            color: '#efefef',
            order: 1,
            actionType: 'I'
          }
          const initColorThemeItem2: EditColorThemeItem = {
            color_theme_item_id: -1,
            color: '#ffffff',
            order: 2,
            actionType: 'I'
          }

          editColorThemeItemList = [initColorThemeItem1, initColorThemeItem2]
        }

        onChangeEditColorThemeDetail({
          isActiveColorTheme: editColorThemeDetail.isActiveColorTheme,
          colorThemeItemList: editColorThemeItemList
        })
      }

      resetDeleteMyItem()
      setActiveCategoryTab(tab)
    },
    [
      activeCategoryTab,
      resetDeleteMyItem,
      editColorThemeDetail.isActiveColorTheme,
      editColorThemeDetail.colorThemeItemList,
      onChangeEditColorThemeDetail
    ]
  )

  const changeTab = useCallback(
    (tab: CustomTab) => () => {
      resetDeleteMyItem()
      setActiveCustomTab(tab)
    },
    [resetDeleteMyItem]
  )

  const handleDeleteMyColor = useCallback(async () => {
    const response = await deleteMyColorMutateAsync({delete_list: deleteMyColorList})

    if (response.result) {
      const newMyColorList = myColorList.filter(item => {
        const isDeleted = deleteMyColorList.includes(item.schedule_color_id)

        return !isDeleted
      })

      queryClient.setQueryData(['scheduleColorList'], newMyColorList)

      resetDeleteMyItem()
    }
  }, [deleteMyColorList, deleteMyColorMutateAsync, queryClient, myColorList, resetDeleteMyItem])

  useEffect(() => {
    if (showColorSelectorBottomSheet) {
      bottomSheetRef.current?.present()

      if (!isRender.current) {
        if (colorThemeDetail.is_active_color_theme) {
          setActiveCategoryTab('theme')
        } else {
          setActiveCategoryTab('custom')
        }
      }

      isRender.current = true
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [showColorSelectorBottomSheet, colorThemeDetail.is_active_color_theme])

  const getBackdropComponent = useCallback(
    (props: BottomSheetBackdropProps) => {
      return (
        <CustomBackdrop
          props={props}
          activeCategoryTab={activeCategoryTab}
          activeTheme={activeTheme}
          snapPoints={snapPoints}
          onChangeCategoryTab={changeCategoryTab}
          onClose={() => bottomSheetRef.current?.dismiss()}
        />
      )
    },
    [activeCategoryTab, changeCategoryTab, activeTheme, snapPoints]
  )

  const getHandleComponent = useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={2}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  const getFooterComponent = useCallback(
    (props: BottomSheetFooterProps) => {
      if (activeCategoryTab === 'custom' && activeCustomTab === 'my') {
        return (
          <BottomSheetFooter {...props} bottomInset={safeAreaInsets.bottom + 10}>
            <Shadow containerStyle={styles.makeButtonWrapper} startColor={activeTheme.color1} distance={30}>
              {isActiveDeleteMyColor ? (
                <View style={styles.deleteButtonWrapper}>
                  <Pressable style={deleteButtonStyle} onPress={handleDeleteMyColor}>
                    <Text style={styles.buttonText}>삭제하기</Text>
                  </Pressable>

                  <Pressable style={cancelDeleteButtonStyle} onPress={resetDeleteMyItem}>
                    <Text style={styles.cancelDeleteButtonText}>취소</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={[makeButtonStyle, {opacity: showColorPickerModal ? 0.3 : 1}]}
                  onPress={() => setShowColorPickerModal(true)}>
                  <Text style={styles.buttonText}>색상 만들기</Text>
                </Pressable>
              )}
            </Shadow>
          </BottomSheetFooter>
        )
      }

      return null
    },
    [
      activeCategoryTab,
      activeCustomTab,
      isActiveDeleteMyColor,
      safeAreaInsets.bottom,
      activeTheme.color1,
      handleDeleteMyColor,
      showColorPickerModal,
      setShowColorPickerModal
    ]
  )

  return (
    <BottomSheetModal
      name="CategoryStatsDetail"
      ref={bottomSheetRef}
      enablePanDownToClose={false}
      enableOverDrag={false}
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      backdropComponent={getBackdropComponent}
      handleComponent={getHandleComponent}
      footerComponent={getFooterComponent}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleClose}>
      <View style={styles.container}>
        {activeCategoryTab === 'theme' ? (
          <View style={styles.wrapper}>
            <ThemeColorList value={editColorThemeDetail} onChange={onChangeEditColorThemeDetail} />
          </View>
        ) : (
          <View style={styles.wrapper}>
            <View style={styles.tabButtonContainer}>
              <Pressable style={styles.tabButton} onPress={changeTab('default')}>
                <Text style={getTabButtonTextStyle('default')}>기본 색상</Text>
              </Pressable>

              <Text style={styles.separatorText}>|</Text>

              <Pressable style={styles.tabButton} onPress={changeTab('my')}>
                <Text style={getTabButtonTextStyle('my')}>내 색상</Text>
              </Pressable>
            </View>

            {activeCustomTab === 'default' && (
              <DefaultColorList
                color={activeColor}
                colorButtonStyle={colorButtonStyle}
                activeColorButtonStyle={activeColorPointStyle}
                contentContainerStyle={styles.scrollContainer}
                columnWrapperStyle={styles.scrollColumnWrapper}
                onChange={changeColor}
              />
            )}

            {activeCustomTab === 'my' && (
              <MyColorList
                color={activeColor}
                myColorList={convertMyColorList}
                isActiveDeleteMyColor={isActiveDeleteMyColor}
                deleteMyColorList={deleteMyColorList}
                colorButtonStyle={colorButtonStyle}
                activeColorButtonStyle={activeColorPointStyle}
                contentContainerStyle={styles.scrollContainer}
                columnWrapperStyle={styles.scrollColumnWrapper}
                onItemLongPress={handleItemLongPress}
                onItemPress={changeMyColor}
              />
            )}
          </View>
        )}
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10
  },
  wrapper: {
    flex: 1
  },
  separatorText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: '#babfc5'
  },
  tabButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 10,
    paddingHorizontal: 30
  },
  tabButton: {
    height: 42,
    justifyContent: 'center'
  },
  tabButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#babfc5'
  },
  colorButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2
  },
  activeColorPoint: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#f5f6f8'
  },
  scrollContainer: {
    gap: 15,
    paddingTop: 20,
    paddingHorizontal: 30
  },
  scrollColumnWrapper: {
    justifyContent: 'space-between'
  },
  makeButtonWrapper: {
    marginHorizontal: 'auto'
  },
  button: {
    height: 42,
    justifyContent: 'center',
    borderRadius: 50,
    paddingHorizontal: 25
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#ffffff'
  },
  deleteButtonWrapper: {
    flexDirection: 'row',
    gap: 10
  },
  cancelDeleteButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#6B727E'
  }
})

const makeButtonStyle = StyleSheet.compose(styles.button, {backgroundColor: '#1E90FF'})
const deleteButtonStyle = StyleSheet.compose(styles.button, {backgroundColor: '#ff4160'})
const cancelDeleteButtonStyle = StyleSheet.compose(styles.button, {backgroundColor: '#efefef'})

export default ColorSelectorBottomSheet
