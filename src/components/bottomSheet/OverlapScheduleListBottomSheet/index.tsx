import {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {ListRenderItem, StyleSheet, Platform, Pressable, Text, View} from 'react-native'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetFlatList,
  BottomSheetModal
} from '@gorhom/bottom-sheet'
import OverlapSchedule from './src/OverlapSchedule'

import {useRecoilValue} from 'recoil'
import {activeThemeState, safeAreaInsetsState} from '@/store/system'
import {GetOverlapScheduleListResponse} from '@/apis/types/schedule'

interface Props {
  visible: boolean
  data: GetOverlapScheduleListResponse[]
  onSubmit: (value: number[]) => void
  onDismiss: () => void
}
const OverlapScheduleListBottomSheet = ({visible, data, onSubmit, onDismiss}: Props) => {
  const activeTheme = useRecoilValue(activeThemeState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const editScheduleCheckBottomSheet = useRef<BottomSheetModal>(null)

  const [disabledScheduleIdList, setDisabledScheduleIdList] = useState<number[]>([])

  const snapPoints = useMemo(() => {
    return ['90%']
  }, [])

  const bottomSafeArea = useMemo(() => {
    if (Platform.OS === 'ios') {
      return safeAreaInsets.bottom
    }

    return 0
  }, [safeAreaInsets.bottom])

  const containerStyle = useMemo(() => {
    return {paddingBottom: bottomSafeArea + 88}
  }, [bottomSafeArea])

  const footerButtonStyle = useMemo(() => {
    return [footerStyles.button, {marginBottom: bottomSafeArea}]
  }, [bottomSafeArea])

  const list = useMemo(() => {
    return data.reduce<GetOverlapScheduleListResponse[]>((acc, cur) => {
      if (acc.findIndex(item => item.schedule_id === cur.schedule_id) === -1) {
        acc.push(cur)
      }
      return acc
    }, [])
  }, [data])

  const deleteSchedule = useCallback(
    (schedule: GetOverlapScheduleListResponse) => {
      setDisabledScheduleIdList([...disabledScheduleIdList, schedule.schedule_id])
    },
    [disabledScheduleIdList]
  )

  const cancelScheduleDeleted = useCallback(
    (schedule: GetOverlapScheduleListResponse) => {
      const target = disabledScheduleIdList.find(item => item === schedule.schedule_id)

      if (target) {
        const newDisabledScheduleIdList = disabledScheduleIdList.filter(item => item !== target)
        setDisabledScheduleIdList(newDisabledScheduleIdList)
      }
    },
    [disabledScheduleIdList]
  )

  const handleSubmit = useCallback(() => {
    onSubmit(disabledScheduleIdList)
  }, [onSubmit, disabledScheduleIdList])

  const getKeyExtractor = useCallback((item: GetOverlapScheduleListResponse) => {
    return String(item.schedule_id)
  }, [])

  // components
  const bottomSheetBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const bottomSheetHandler = useCallback(
    (props: BottomSheetHandleProps) => {
      return (
        <BottomSheetHandler
          shadow={false}
          maxSnapIndex={1}
          backgroundColor={activeTheme.color5}
          animatedIndex={props.animatedIndex}
          animatedPosition={props.animatedPosition}
        />
      )
    },
    [activeTheme.color1]
  )

  const header = useCallback(() => {
    return (
      <View style={[headerStyles.container, {backgroundColor: activeTheme.color5}]}>
        <Text style={[headerStyles.titleText, {color: activeTheme.color3}]}>겹치는 일정이 있어요</Text>
        <Text style={headerStyles.subTitleText}>겹치는 일정들을 어떻게 할지 확인해 주세요</Text>
      </View>
    )
  }, [activeTheme.color3, activeTheme.color5])

  const renderItem: ListRenderItem<GetOverlapScheduleListResponse> = useCallback(
    ({item}) => {
      return (
        <OverlapSchedule
          schedule={item}
          activeTheme={activeTheme}
          onDelete={deleteSchedule}
          onCancelDeleted={cancelScheduleDeleted}
        />
      )
    },
    [activeTheme, deleteSchedule, cancelScheduleDeleted]
  )

  useEffect(() => {
    if (visible) {
      editScheduleCheckBottomSheet.current?.present()
    } else {
      editScheduleCheckBottomSheet.current?.dismiss()
    }
  }, [visible])

  return (
    <BottomSheetModal
      name="editScheduleCheck"
      ref={editScheduleCheckBottomSheet}
      backgroundStyle={{backgroundColor: activeTheme.color2}}
      backdropComponent={bottomSheetBackdrop}
      handleComponent={bottomSheetHandler}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}>
      <BottomSheetFlatList
        data={list}
        bounces={false}
        keyExtractor={getKeyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={header}
        contentContainerStyle={containerStyle}
      />

      <Pressable style={footerButtonStyle} onPress={handleSubmit}>
        <Text style={footerStyles.buttonText}>적용하기</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 20
  },
  titleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242',
    marginBottom: 5
  },
  scheduleTitleText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  subTitleText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#7c8698'
  }
})

const footerStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 16,

    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#1E90FF',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2
      },
      android: {
        elevation: 2
      }
    })
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#fff'
  }
})

export default OverlapScheduleListBottomSheet
