import {useState, useCallback} from 'react'
import {StyleSheet, Pressable, Text, View} from 'react-native'
import ScheduleCompleteCardDetailMenuModal from '@/components/modal/ScheduleCompleteCardDetailMenuModal'

import CancelIcon from '@/assets/icons/cancle.svg'
import LeftArrowIcon from '@/assets/icons/arrow_left.svg'
import MoreIcon from '@/assets/icons/more_horiz.svg'

import {navigationRef} from '@/utils/navigation'
import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'

interface Props {
  title: string
  completeCount: number
  detailScreen?: boolean
  onEdit?: () => void
  onDelete?: () => void
}
const AppBar = ({title, completeCount, detailScreen, onEdit, onDelete}: Props) => {
  const [isShowModal, setIsShowModal] = useState(false)
  const activeTheme = useRecoilValue(activeThemeState)

  const goBack = useCallback(() => {
    navigationRef.current?.goBack()
  }, [])

  const handleEdit = useCallback(() => {
    if (onEdit) {
      setIsShowModal(false)
      onEdit()
    }
  }, [onEdit])

  const handleDelete = useCallback(() => {
    if (onDelete) {
      setIsShowModal(false)
      onDelete()
    }
  }, [onDelete])

  return (
    <View style={[styles.container, {backgroundColor: activeTheme.color1}]}>
      <Pressable style={styles.button} onPress={goBack}>
        {detailScreen ? (
          <LeftArrowIcon stroke={activeTheme.color3} strokeWidth={3} />
        ) : (
          <CancelIcon stroke={activeTheme.color3} strokeWidth={3} />
        )}
      </Pressable>

      <View style={styles.titleWrapper}>
        <Text numberOfLines={1} style={[styles.title, {color: activeTheme.color3}]}>
          {title}
        </Text>

        <Text style={[styles.subTitle, {color: activeTheme.color3}]}>{completeCount}번째 완료</Text>
      </View>

      {detailScreen ? (
        <Pressable style={styles.button} onPress={() => setIsShowModal(true)}>
          <MoreIcon fill={activeTheme.color3} />
        </Pressable>
      ) : (
        <View style={styles.button} />
      )}

      {onEdit && onDelete && (
        <ScheduleCompleteCardDetailMenuModal
          visible={isShowModal}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setIsShowModal(false)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16
  },
  subTitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12
  }
})

export default AppBar
