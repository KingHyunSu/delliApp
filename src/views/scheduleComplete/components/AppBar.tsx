import {useState, useMemo, useCallback} from 'react'
import {StyleSheet, Pressable, Text, View} from 'react-native'
import ScheduleCompleteCardDetailMenuModal from '@/components/modal/ScheduleCompleteCardDetailMenuModal'

import CancelIcon from '@/assets/icons/cancle.svg'
import LeftArrowIcon from '@/assets/icons/arrow_left.svg'
import MoreIcon from '@/assets/icons/more_horiz.svg'

import {navigationRef} from '@/utils/navigation'
import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'

interface Props {
  type: 'detail' | 'edit'
  title: string
  completeCount: number
  onSubmit?: () => void
  onEdit?: () => void
  onDelete?: () => void
}
const AppBar = ({type, title, completeCount, onSubmit, onEdit, onDelete}: Props) => {
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

  const rightButtonComponent = useMemo(() => {
    switch (type) {
      case 'detail':
        return (
          <Pressable style={rightButtonStyle} onPress={() => setIsShowModal(true)}>
            <MoreIcon fill={activeTheme.color3} />
          </Pressable>
        )
      case 'edit':
        return (
          <Pressable style={rightButtonStyle} onPress={onSubmit}>
            <Text style={styles.buttonText}>완료</Text>
          </Pressable>
        )
      default:
        return <View style={rightButtonStyle} />
    }
  }, [type, onSubmit, activeTheme.color3])

  return (
    <View style={[styles.container, {backgroundColor: activeTheme.color1}]}>
      <Pressable style={leftButtonStyle} onPress={goBack}>
        {type === 'detail' ? (
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

      {rightButtonComponent}

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
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16
  },
  subTitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#1E90FF'
  }
})

const leftButtonStyle = StyleSheet.compose(styles.button, {
  paddingLeft: 12
})
const rightButtonStyle = StyleSheet.compose(styles.button, {
  alignItems: 'flex-end',
  paddingRight: 16
})

export default AppBar
