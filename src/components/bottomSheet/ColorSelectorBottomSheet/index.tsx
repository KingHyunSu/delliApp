import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {ViewStyle, StyleSheet, View, Pressable, Text} from 'react-native'
import {BottomSheetModal, BottomSheetHandleProps, BottomSheetBackdropProps} from '@gorhom/bottom-sheet'
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
  alertState,
  editScheduleListSnapPointState,
  safeAreaInsetsState,
  windowDimensionsState
} from '@/store/system'
import {colorToChangeState, scheduleState} from '@/store/schedule'
import {showColorPickerModalState} from '@/store/modal'
import {useGetColorList} from '@/apis/hooks/useColor'
import {objectEqual} from '@/utils/helper'

type CategoryTab = 'theme' | 'custom'
type CustomTab = 'default' | 'my'
interface Props {
  colorThemeDetail: ColorThemeDetail
  editColorThemeDetail: EditColorThemeDetail
  onChangeEditColorThemeDetail: (value: EditColorThemeDetail) => void
}
const ColorSelectorBottomSheet = ({colorThemeDetail, editColorThemeDetail, onChangeEditColorThemeDetail}: Props) => {
  const {data: myColorList} = useGetColorList()

  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const isRender = useRef(false)

  const [activeCategoryTab, setActiveCategoryTab] = useState<CategoryTab>('custom')
  const [activeCustomTab, setActiveCustomTab] = useState<CustomTab>('default')
  const [activeDeletedItem, setActiveDeletedItem] = useState<Color | null>(null)

  const [showColorSelectorBottomSheet, setShowColorSelectorBottomSheet] = useRecoilState(
    showColorSelectorBottomSheetState
  )
  const [showColorPickerModal, setShowColorPickerModal] = useRecoilState(showColorPickerModalState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const activeTheme = useRecoilValue(activeThemeState)
  const [minEditScheduleListSnapPoint] = useRecoilValue(editScheduleListSnapPointState)
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)
  const colorToChange = useRecoilValue(colorToChangeState)
  const alert = useSetRecoilState(alertState)

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

  const makeButtonStyle = useMemo(() => {
    const opacity = showColorPickerModal ? 0.3 : 1

    return [styles.makeButton, {opacity}]
  }, [showColorPickerModal])

  const activeColor = useMemo(() => {
    switch (colorToChange) {
      case 'background':
        return schedule.background_color
      case 'font':
        return schedule.text_color
      default:
        return ''
    }
  }, [schedule.background_color, schedule.text_color, colorToChange])

  const convertMyColorList = useMemo(() => {
    if (myColorList.length % 5 !== 0) {
      const emptyCount = 5 - (myColorList.length % 5)
      const newMyColorList = [...myColorList]

      for (let i = 0; i < emptyCount; i++) {
        newMyColorList.push({color_id: -1, color: ''})
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

  const handleItemLongPress = useCallback(
    (item: Color) => {
      setActiveDeletedItem(item)
    },
    [setActiveDeletedItem]
  )

  const changeColor = useCallback(
    (color: string) => {
      if (colorToChange === 'background') {
        setSchedule(prevState => ({
          ...prevState,
          background_color: color
        }))
      } else if (colorToChange === 'font') {
        setSchedule(prevState => ({
          ...prevState,
          text_color: color
        }))
      }
    },
    [colorToChange, setSchedule]
  )

  const changeCategoryTab = useCallback(
    (tab: CategoryTab) => {
      if (tab === activeCategoryTab) {
        return
      }

      let editColorThemeItemList: EditColorThemeItem[] = editColorThemeDetail.colorThemeItemList
      const initColorThemeItem1: EditColorThemeItem = {id: -1, color: '#efefef', order: 1, actionType: 'I'}
      const initColorThemeItem2: EditColorThemeItem = {id: -1, color: '#ffffff', order: 2, actionType: 'I'}

      if (tab === 'custom') {
        const isUpdated = editColorThemeItemList.some(item => {
          return item.actionType && !objectEqual(initColorThemeItem1, item) && !objectEqual(initColorThemeItem2, item)
        })

        if (isUpdated) {
          alert({
            type: 'danger',
            title: '테마 변경 내용이 있어요',
            desc: '해제하면 변경된 내용이 모두 사라져요.\n테마 적용을 해제할까요?',
            confirmButtonText: '해제하기',
            confirmFn: () => {
              onChangeEditColorThemeDetail({
                colorThemeType: 0,
                colorThemeItemList: []
              })
              setActiveCategoryTab(tab)
            }
          })
        } else {
          onChangeEditColorThemeDetail({
            colorThemeType: 0,
            colorThemeItemList: []
          })
          setActiveCategoryTab(tab)
        }
      } else if (tab === 'theme') {
        if (editColorThemeItemList.length === 0) {
          editColorThemeItemList = [initColorThemeItem1, initColorThemeItem2]
        }

        onChangeEditColorThemeDetail({
          colorThemeType: 1,
          colorThemeItemList: editColorThemeItemList
        })
        setActiveCategoryTab(tab)
      }
    },
    [activeCategoryTab, editColorThemeDetail.colorThemeItemList, onChangeEditColorThemeDetail, alert]
  )

  const changeTab = useCallback(
    (tab: CustomTab) => () => {
      setActiveCustomTab(tab)
    },
    []
  )

  const closeMenu = useCallback(() => {
    setActiveDeletedItem(null)
  }, [setActiveDeletedItem])

  useEffect(() => {
    if (showColorSelectorBottomSheet) {
      bottomSheetRef.current?.present()

      if (!isRender.current) {
        if (colorThemeDetail.color_theme_type !== 0) {
          setActiveCategoryTab('theme')
        } else {
          setActiveCategoryTab('custom')
        }
      }

      isRender.current = true
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [showColorSelectorBottomSheet, colorThemeDetail.color_theme_type])

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

  return (
    <BottomSheetModal
      name="CategoryStatsDetail"
      ref={bottomSheetRef}
      enablePanDownToClose={false}
      enableOverDrag={false}
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      backdropComponent={getBackdropComponent}
      handleComponent={getHandleComponent}
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

            {activeCustomTab === 'my' && activeDeletedItem && (
              <Pressable style={styles.menuOverlay} onPress={closeMenu} />
            )}

            {activeCustomTab === 'my' && (
              <MyColorList
                activeDeletedItem={activeDeletedItem}
                color={activeColor}
                myColorList={convertMyColorList}
                colorButtonStyle={colorButtonStyle}
                activeColorButtonStyle={activeColorPointStyle}
                contentContainerStyle={styles.scrollContainer}
                columnWrapperStyle={styles.scrollColumnWrapper}
                closeMenu={closeMenu}
                onItemLongPress={handleItemLongPress}
                onChange={changeColor}
              />
            )}

            {activeCustomTab === 'my' && (
              <Shadow
                containerStyle={[styles.makeButtonWrapper, {bottom: safeAreaInsets.bottom + 20}]}
                stretch={true}
                startColor={activeTheme.color1}
                distance={30}>
                <Pressable style={makeButtonStyle} onPress={() => setShowColorPickerModal(true)}>
                  <Text style={styles.makeButtonText}>색상 만들기</Text>
                </Pressable>
              </Shadow>
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
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
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
    position: 'absolute',
    left: 30,
    right: 30
  },
  makeButton: {
    height: 52,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  makeButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#ffffff'
  }
})

export default ColorSelectorBottomSheet
