import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
    gap: 20
  },
  titleButton: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },
  titleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#000'
  },
  titlePlaceHoldText: {
    color: '#c3c5cc'
  },

  // expansion panel style
  expansionPanel: {
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 10,
    overflow: 'hidden'
  },
  expansionPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  expansionPanelHeaderTextBox: {
    gap: 5
  },
  expansionPanelHeaderLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Light',
    color: '#424242'
  },
  expansionPanelHeaderTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#424242'
  },
  expansionPanelContents: {
    borderTopWidth: 1,
    borderTopColor: '#eeeded'
  },
  expansionPanelItemContainer: {
    overflow: 'hidden',
    justifyContent: 'flex-start'
  },
  expansionPanelItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },
  expansionPanelItemContents: {
    paddingTop: 20
  },
  expansionPanelItemLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#424242'
  },
  expansionPanelItemButton: {
    paddingVertical: 10,
    width: 115,
    borderRadius: 7,
    backgroundColor: '#f5f6f8'
  },
  expansionPanelItemButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#7c8698',
    textAlign: 'center'
  },
  expansionPanelItemActiveButton: {
    backgroundColor: '#1E90FF'
  },
  expansionPanelItemActiveButtonText: {
    color: '#fff'
  },

  dateOfWeekTitleContainer: {
    flexDirection: 'row',
    gap: 5
  },
  dayOfWeekContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 16,
    borderTopWidth: 1,
    borderTopColor: '#eeeded',
    paddingTop: 20
  },
  dayOfWeek: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#c3c5cc'
  },
  dayofWeekText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#c3c5cc'
  },
  activeDayOfWeekText: {
    color: '#424242'
  },
  disableDayOfWeekText: {
    color: '#c3c5cc'
  },
  activeDayOfWeek: {
    borderColor: '#424242'
  },
  alarmWheelContainer: {
    marginTop: 20,
    marginHorizontal: 16
  },
  alarmWheelSelectedWrapper: {
    backgroundColor: '#f5f6f8',
    borderRadius: 10
  },
  alarmWheelText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: '#7c8698'
  },

  submitBtn: {
    height: 48,
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#1E90FF'
    // backgroundColor: '#2d8cec'
  },
  submitText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#fff'
  }
})
