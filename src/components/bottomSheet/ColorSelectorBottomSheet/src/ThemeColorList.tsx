import {useCallback, useMemo, useState} from 'react'
import {StyleSheet, Pressable, Text, View} from 'react-native'
import DraggableFlatList, {RenderItemParams, DragEndParams} from 'react-native-draggable-flatlist'
import Switch from '@/components/Swtich'
import ColorThemeColorPickerModal from '@/components/modal/ColorThemeColorPickerModal'

import MenuIcon from '@/assets/icons/menu.svg'
import CancelIcon from '@/assets/icons/cancle.svg'
import PlusIcon from '@/assets/icons/plus.svg'

import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'
import {colorKit} from 'reanimated-color-picker'
import {objectEqual} from '@/utils/helper'

interface Props {
  value: EditColorThemeDetail
  onChange: (value: EditColorThemeDetail) => void
}
const ThemeColorList = ({value, onChange}: Props) => {
  const [showColoPickerModal, setShowColoPickerModal] = useState(false)
  const [changeTargetItem, setChangeTargetItem] = useState<EditColorThemeItem | null>(null)

  const activeTheme = useRecoilValue(activeThemeState)

  const _value = useMemo(() => {
    return {
      isActiveColorTheme: value.isActiveColorTheme,
      colorThemeItemList: value.colorThemeItemList.filter(item => item.actionType !== 'D')
    }
  }, [value])

  const changeOrder = useCallback(
    ({data}: DragEndParams<EditColorThemeItem>) => {
      const reorderList: EditColorThemeItem[] = data.map((item, index) => {
        if (item.actionType === 'I') {
          return {
            ...item,
            order: index + 1
          }
        } else if (item.actionType === 'D') {
          return item
        }

        return {
          ...item,
          actionType: 'U',
          order: index + 1
        }
      })

      onChange({
        isActiveColorTheme: value.isActiveColorTheme,
        colorThemeItemList: reorderList
      })
    },
    [onChange, value.isActiveColorTheme]
  )

  const activeColorTheme = useCallback(
    (bool: boolean) => {
      onChange({
        isActiveColorTheme: bool,
        colorThemeItemList: value.colorThemeItemList
      })
    },
    [onChange, value.colorThemeItemList]
  )

  const handleShowColoPickerModal = useCallback(
    (item: EditColorThemeItem) => () => {
      setChangeTargetItem(item)
      setShowColoPickerModal(true)
    },
    []
  )

  const handleCloseColorPickerModal = useCallback(() => {
    setChangeTargetItem(null)
    setShowColoPickerModal(false)
  }, [])

  const changeColor = useCallback(
    (data: EditColorThemeItem) => {
      const newColorThemeItemList = value.colorThemeItemList.map(item => {
        return item.order === data.order ? data : item
      })

      onChange({
        isActiveColorTheme: value.isActiveColorTheme,
        colorThemeItemList: newColorThemeItemList
      })
    },
    [value, onChange]
  )

  const insertColorThemeItem = useCallback(() => {
    const newColorThemeItem: EditColorThemeItem = {
      color_theme_item_id: -1,
      background_color: '#ffffff',
      text_color: '#000000',
      order: value.colorThemeItemList.length + 1,
      actionType: 'I'
    }

    onChange({
      isActiveColorTheme: value.isActiveColorTheme,
      colorThemeItemList: [...value.colorThemeItemList, newColorThemeItem]
    })
  }, [value, onChange])

  const deleteColorThemeItem = useCallback(
    (data: EditColorThemeItem) => () => {
      const newColorThemeItemList: EditColorThemeItem[] = value.colorThemeItemList.map(item => {
        if (data.order === item.order) {
          return {...item, actionType: 'D'}
        }

        return item
      })

      onChange({
        isActiveColorTheme: value.isActiveColorTheme,
        colorThemeItemList: newColorThemeItemList
      })
    },
    [value, onChange]
  )

  const warningTextComponent = useMemo(() => {
    const initColorThemeItem1: EditColorThemeItem = {
      color_theme_item_id: -1,
      background_color: '#efefef',
      text_color: '#000000',
      order: 1,
      actionType: 'I'
    }
    const initColorThemeItem2: EditColorThemeItem = {
      color_theme_item_id: -1,
      background_color: '#ffffff',
      text_color: '#000000',
      order: 2,
      actionType: 'I'
    }

    const isUpdated = value.colorThemeItemList.some(item => {
      return item.actionType && !objectEqual(initColorThemeItem1, item) && !objectEqual(initColorThemeItem2, item)
    })

    if (!value.isActiveColorTheme && isUpdated) {
      return (
        <View style={styles.warningTextWrapper}>
          <Text style={styles.warningText}>변경된 내용은 저장되지 않아요</Text>
        </View>
      )
    }

    return null
  }, [value])

  const getRenderItem = useCallback(
    ({item, getIndex, drag, isActive}: RenderItemParams<EditColorThemeItem>) => {
      const index = getIndex() || 0
      const borderTopWidth = index === 0 ? 1 : 0
      const color = colorKit.darken(item.background_color, 30).hex()

      return (
        <View
          style={[
            itemStyles.container,
            {
              borderTopWidth,
              borderColor: activeTheme.color2,
              backgroundColor: item.background_color
            }
          ]}>
          <View style={itemStyles.wrapper}>
            <Pressable style={itemStyles.button} onPressIn={drag}>
              <MenuIcon width={20} height={20} fill={color} />
            </Pressable>

            <Pressable style={itemStyles.changeColorButton} onPress={handleShowColoPickerModal(item)}>
              <Text style={[itemStyles.buttonText, {color: item.text_color}]}>색상 변경하기</Text>
            </Pressable>

            {index === 0 || isActive ? (
              <View style={itemStyles.button} />
            ) : (
              <Pressable style={itemStyles.button} onPress={deleteColorThemeItem(item)}>
                <CancelIcon width={20} height={20} stroke={color} strokeWidth={2.5} />
              </Pressable>
            )}
          </View>
        </View>
      )
    },
    [activeTheme.color2, handleShowColoPickerModal, deleteColorThemeItem]
  )

  return (
    <View style={styles.container}>
      <View style={styles.switchWrapper}>
        <Text style={[styles.switchLabel, {color: activeTheme.color3}]}>활성화</Text>

        <Switch value={value.isActiveColorTheme} onChange={activeColorTheme} />
      </View>

      <View style={styles.wrapper}>
        <DraggableFlatList
          contentContainerStyle={styles.listContentContainer}
          data={_value.colorThemeItemList}
          renderItem={getRenderItem}
          keyExtractor={(item, index) => `item-${index}`}
          bounces={false}
          onDragEnd={changeOrder}
        />
        {!value.isActiveColorTheme && (
          <View style={styles.disabledOverlay}>{warningTextComponent && warningTextComponent}</View>
        )}
      </View>

      <ColorThemeColorPickerModal
        visible={showColoPickerModal}
        value={changeTargetItem}
        onChange={changeColor}
        onClose={handleCloseColorPickerModal}
      />

      <View style={styles.footer}>
        <Pressable style={styles.plusButtonWrapper} onPress={insertColorThemeItem}>
          <View style={styles.plusButton}>
            <PlusIcon width={22} height={22} stroke="#ffffff" strokeWidth={3} />
          </View>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    gap: 20
  },
  wrapper: {
    maxHeight: '70%'
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    bottom: 0,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center'
  },
  warningTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10
  },
  warningText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#efefef'
  },

  listContentContainer: {
    paddingHorizontal: 20
  },
  switchWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25
  },
  switchLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16
  },

  footer: {
    alignItems: 'center'
  },
  plusButtonWrapper: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center'
  },
  plusButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const itemStyles = StyleSheet.create({
  container: {
    height: 72,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    width: 52,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14
  },
  changeColorButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ThemeColorList
