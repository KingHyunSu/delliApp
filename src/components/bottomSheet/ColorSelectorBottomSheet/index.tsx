import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {View, Pressable, Text, StyleSheet, ListRenderItem} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetHandleProps,
  BottomSheetBackdropProps
} from '@gorhom/bottom-sheet'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import CustomBackdrop from './src/CustomBackdrop'
import {Shadow} from 'react-native-shadow-2'

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

  const snapPoints = useMemo(() => {
    const minSnapPoint = minEditScheduleListSnapPoint + safeAreaInsets.bottom
    const maxSnapPoint = windowDimensions.height - (safeAreaInsets.top + 75)

    return [minSnapPoint, maxSnapPoint]
  }, [minEditScheduleListSnapPoint, safeAreaInsets.top, safeAreaInsets.bottom, windowDimensions.height])

  const defaultColorList = useMemo(() => {
    return [
      // red
      '#FFCBCB',
      '#FF8A8A',
      '#FF7F7F',
      '#FF6E6E',
      '#FF5C5C',

      // orange
      '#FFD9B3',
      '#FFD1B3',
      '#FFAD7A',
      '#FF9C66',
      '#FF8866',

      // yellow
      // '#FFF0B3', // 유료 색상
      '#FFF5B2',
      '#FFF2A1',
      '#FFEB84',
      '#FFE680',
      '#FFDE70',

      // green
      '#D4FFB3',
      '#B4F99E',
      '#A5E88F',
      '#94DA82',
      '#85C973',

      // blue
      '#CCF2FF',
      '#99E4FE',
      '#66D5FD',
      '#33C4FC',
      '#02AEFA',

      // navy
      '#A2B9E0',
      '#91A8D0',
      '#7F94BF',
      '#6C83AF',
      '#5A729F',

      // purple
      '#D1B3FF',
      '#CDA5E8',
      '#B28AC6',
      '#A37ABF',
      '#8F67A9',

      // black
      '#A9A9A9',
      '#8E8E8E',
      '#7D7D7D',
      '#6E6E6E',
      '#5C5C5C',

      // other
      '#ffffff',
      '#000000',
      '',
      '',
      ''

      // '#f59ed3',
      // '#f2f2a6',
      // '#a6e3f5',
      // '#b1f7de',
      // '#c2ffb6',
      // '#99e6d0',
      // '#60daa8',
      // '#acacf4',
      // '#7294f4',
      // '#6c5cd7',
      // '#160b61',
      // '#B3C7FF',
      // '#E5B3FF'
    ]
  }, [])

  const getKeyExtractor = useCallback((item: string, index: number) => {
    return index.toString()
  }, [])

  const handleClose = useCallback(() => {
    setShowColorSelectorBottomSheet(false)
  }, [setShowColorSelectorBottomSheet])

  const changeColor = useCallback(
    (color: string) => () => {
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

  const getRenderItem: ListRenderItem<string | null> = useCallback(
    ({item}) => {
      if (item) {
        let isActive = false

        if (colorToChange === 'background' && item === schedule.background_color) {
          isActive = true
        } else if (colorToChange === 'font' && item === schedule.text_color) {
          isActive = true
        }

        return (
          <Pressable style={[styles.colorButton, {backgroundColor: item}]} onPress={changeColor(item)}>
            {isActive && <View style={styles.activeColorPoint} />}
          </Pressable>
        )
      }

      return <View style={{width: 42, height: 42}} />
    },
    [schedule.background_color, schedule.text_color, colorToChange, changeColor]
  )

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
          <BottomSheetFlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={getKeyExtractor}
            data={defaultColorList}
            numColumns={5}
            renderItem={getRenderItem}
            contentContainerStyle={styles.scrollContainer}
            columnWrapperStyle={styles.scrollColumnWrapper}
          />
        )}

        {activeTab === 'my' && (
          <BottomSheetFlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={getKeyExtractor}
            data={myColorList}
            numColumns={5}
            renderItem={getRenderItem}
            style={{marginBottom: safeAreaInsets.bottom + 20}}
            contentContainerStyle={styles.scrollContainer}
            columnWrapperStyle={styles.scrollColumnWrapper}
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
