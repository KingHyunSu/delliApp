import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'
import {BottomSheetModal, BottomSheetHandleProps, BottomSheetBackdropProps} from '@gorhom/bottom-sheet'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import {Shadow} from 'react-native-shadow-2'
import CustomBackdrop from './src/CustomBackdrop'
import DefaultColorList from './src/DefaultColorList'
import MyColorList from './src/MyColorList'

import {useRecoilState, useRecoilValue} from 'recoil'
import {showColorSelectorBottomSheetState} from '@/store/bottomSheet'
import {editScheduleListSnapPointState, safeAreaInsetsState, windowDimensionsState} from '@/store/system'
import {colorToChangeState, scheduleState} from '@/store/schedule'
import {useGetColorList} from '@/apis/hooks/useColor'
import {showColorPickerModalState} from '@/store/modal'

type Tab = 'default' | 'my'
const ColorSelectorBottomSheet = () => {
  const {data: myColorList} = useGetColorList()

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const [activeTab, setActiveTab] = useState<Tab>('default')
  const [activeDeletedItem, setActiveDeletedItem] = useState<Color | null>(null)

  const [showColorSelectorBottomSheet, setShowColorSelectorBottomSheet] = useRecoilState(
    showColorSelectorBottomSheetState
  )
  const [showColorPickerModal, setShowColorPickerModal] = useRecoilState(showColorPickerModalState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const [minEditScheduleListSnapPoint] = useRecoilValue(editScheduleListSnapPointState)
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)
  const colorToChange = useRecoilValue(colorToChangeState)

  const getTabButtonTextStyle = useCallback(
    (type: Tab) => {
      return activeTab === type ? activeTabButtonTextStyle : styles.tabButtonText
    },
    [activeTab]
  )

  const makeButtonStyle = useMemo(() => {
    return showColorPickerModal ? disabledMakeButton : styles.makeButton
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
    const minSnapPoint = minEditScheduleListSnapPoint + safeAreaInsets.bottom
    const maxSnapPoint = windowDimensions.height - (safeAreaInsets.top + 75)

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

  const changeTab = useCallback(
    (tab: Tab) => () => {
      setActiveTab(tab)
    },
    [setActiveTab]
  )

  const closeMenu = useCallback(() => {
    setActiveDeletedItem(null)
  }, [setActiveDeletedItem])

  useEffect(() => {
    if (showColorSelectorBottomSheet) {
      bottomSheetRef.current?.present()
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [showColorSelectorBottomSheet])

  const getBackdropComponent = useCallback((props: BottomSheetBackdropProps) => {
    return <CustomBackdrop props={props} onClose={() => bottomSheetRef.current?.dismiss()} />
  }, [])

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
      backdropComponent={getBackdropComponent}
      handleComponent={getHandleComponent}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleClose}>
      <View style={styles.container}>
        <View style={styles.tabButtonContainer}>
          <Pressable style={styles.tabButton} onPress={changeTab('default')}>
            <Text style={getTabButtonTextStyle('default')}>기본 색상</Text>
          </Pressable>

          <Text style={styles.separatorText}>|</Text>

          <Pressable style={styles.tabButton} onPress={changeTab('my')}>
            <Text style={getTabButtonTextStyle('my')}>내 색상</Text>
          </Pressable>
        </View>

        {activeTab === 'default' && (
          <DefaultColorList
            color={activeColor}
            colorButtonStyle={styles.colorButton}
            activeColorButtonStyle={styles.activeColorPoint}
            contentContainerStyle={styles.scrollContainer}
            columnWrapperStyle={styles.scrollColumnWrapper}
            onChange={changeColor}
          />
        )}

        {activeTab === 'my' && activeDeletedItem && <Pressable style={styles.menuOverlay} onPress={closeMenu} />}

        {activeTab === 'my' && (
          <MyColorList
            activeDeletedItem={activeDeletedItem}
            color={activeColor}
            myColorList={convertMyColorList}
            colorButtonStyle={styles.colorButton}
            activeColorButtonStyle={styles.activeColorPoint}
            contentContainerStyle={styles.scrollContainer}
            columnWrapperStyle={styles.scrollColumnWrapper}
            closeMenu={closeMenu}
            onItemLongPress={handleItemLongPress}
            onChange={changeColor}
          />
        )}

        {activeTab === 'my' && (
          <Shadow
            containerStyle={[styles.makeButtonWrapper, {bottom: safeAreaInsets.bottom + 20}]}
            stretch={true}
            startColor="#ffffff"
            distance={30}>
            <Pressable style={makeButtonStyle} onPress={() => setShowColorPickerModal(true)}>
              <Text style={styles.makeButtonText}>색상 만들기</Text>
            </Pressable>
          </Shadow>
        )}
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30
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
    marginBottom: 10
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
    borderWidth: 2,
    borderColor: '#f5f6f8'
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
    paddingTop: 20
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

const activeTabButtonTextStyle = StyleSheet.compose(styles.tabButtonText, {color: '#424242'})
const disabledMakeButton = StyleSheet.compose(styles.makeButton, {backgroundColor: '#efefef'})

export default ColorSelectorBottomSheet
