import Foundation
import WidgetKit
import SwiftUI

extension View {
  func widgetBackground(_ color: Color) -> some View {
    if #available(iOSApplicationExtension 17.0, *) {
      return containerBackground(for: .widget) {
        color
      }
    } else {
      return background(color)
    }
  }
  
  @ViewBuilder public func overlayIf<T: View>(
    _ condition: Bool,
    _ content: T,
    alignment: Alignment = .center
  ) -> some View {
    if condition {
      self.overlay(content, alignment: alignment)
    } else {
      self
    }
  }
}

extension UIColor {
  convenience init(hexCode: String) {
    var hexFormatted: String = hexCode.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines).uppercased()
    
    if hexFormatted.hasPrefix("#") {
      hexFormatted = String(hexFormatted.dropFirst())
    }
    
    assert(hexFormatted.count == 6, "Invalid hex code used.")
    
    var rgbValue: UInt64 = 0
    Scanner(string: hexFormatted).scanHexInt64(&rgbValue)
    
    self.init(red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
              green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
              blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
              alpha: 1.0)
  }
}

public struct TodoModel:Codable {
  let todo_id: Int
  let complete_id: Int?
  let title: String
}

public struct ScheduleModel:Codable {
  let schedule_id: Int?
  let title: String
  let start_time: CGFloat
  let end_time: CGFloat
  let todo_list: [TodoModel]
  let widget_update_date: String
}

public struct ActiveScheduleModel:Codable {
  let schedule_id: Int?
  let title: String
  let start_time: CGFloat
  let end_time: CGFloat
  let todo_list: [TodoModel]
}

public struct StyleModel:Codable {
  let outline_background_color: String
  let outline_progress_color: String
  let background_color: String
  let text_color: String
}

struct SimpleEntry: TimelineEntry {
  let index: Int
  let date: Date
  let activeDate: String?
  let isUpdate: Bool
  let style: StyleModel
  let scheduleList: [ScheduleModel]
  let activeSchedule: ActiveScheduleModel
}

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> SimpleEntry {
    SimpleEntry(
      index: 0,
      date: Date(),
      activeDate: nil,
      isUpdate: false,
      style: StyleModel(
        outline_background_color: "#FFFFFF",
        outline_progress_color: "#FF6F61",
        background_color: "#F8F4EC",
        text_color: "#424242"
      ),
      scheduleList: [],
      activeSchedule: ActiveScheduleModel(
        schedule_id: nil,
        title: "",
        start_time: 0,
        end_time: 0,
        todo_list: []
      )
    )
  }
  
  func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
    let entry = SimpleEntry(
      index: 0,
      date: Date(),
      activeDate: nil,
      isUpdate: false,
      style: StyleModel(
        outline_background_color: "#FFFFFF",
        outline_progress_color: "#FF6F61",
        background_color: "#F8F4EC",
        text_color: "#424242"
      ),
      scheduleList: [],
      activeSchedule: ActiveScheduleModel(
        schedule_id: nil,
        title: "",
        start_time: 0,
        end_time: 0,
        todo_list: []
      )
    )
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
    var entries: [SimpleEntry] = []
    let appGroupID = "group.delli.widget"
    let sharedUserDefaults = UserDefaults(suiteName: appGroupID)
    
    let scheduleListJsonString = sharedUserDefaults?.string(forKey: "scheduleList")
    let styleJsonString = sharedUserDefaults?.string(forKey: "style")
    
    var scheduleList: [ScheduleModel] = []
    var style = StyleModel(
      outline_background_color: "#FFFFFF",
      outline_progress_color: "#FF6F61",
      background_color: "#F8F4EC",
      text_color: "#424242"
    )
    var isUpdate = false
    var activeDateString: String? = nil
    
    do {
      if let _scheduleListJsonString = scheduleListJsonString {
        let decodedScheduleList = Data(_scheduleListJsonString.utf8)
        scheduleList = try JSONDecoder().decode([ScheduleModel].self, from: decodedScheduleList)
      }
      if let _styleJsonString = styleJsonString {
        let decodedStyle = Data(_styleJsonString.utf8)
        style = try JSONDecoder().decode(StyleModel.self, from: decodedStyle)
        
      }
    } catch {
      print(error)
    }
    
    let currentDate = Date()
    let calendar = Calendar.current
    let startOfDay = calendar.startOfDay(for: currentDate)
    
    if let activeDate = sharedUserDefaults?.object(forKey: "activeDate") as? Date {
      let activeStartOfDay = calendar.startOfDay(for: activeDate)
      
      let dateFormatter = DateFormatter()
      dateFormatter.dateFormat = "MM월 dd일"
      activeDateString = dateFormatter.string(from: activeStartOfDay)
      
      if(startOfDay != activeStartOfDay) {
        isUpdate = true
      }
    }
    
    if scheduleList.isEmpty {
      let entry = SimpleEntry(
        index: 0,
        date: currentDate,
        activeDate: nil,
        isUpdate: true,
        style: style,
        scheduleList: [],
        activeSchedule: ActiveScheduleModel(
          schedule_id: nil,
          title: "",
          start_time: 0,
          end_time: 0,
          todo_list: []
        )
      )
      
      entries.append(entry)
    } else {
      let iosFormatter = ISO8601DateFormatter()
      
      for (index, schedule) in scheduleList.enumerated() {
        if let entryDate = iosFormatter.date(from: schedule.widget_update_date) {
          let entry = SimpleEntry(
            index: index,
            date: entryDate,
            activeDate: activeDateString,
            isUpdate: isUpdate,
            style: style,
            scheduleList: scheduleList,
            activeSchedule: ActiveScheduleModel(
              schedule_id: schedule.schedule_id,
              title: schedule.title,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              todo_list: schedule.todo_list
            )
          )
          
          entries.append(entry)
        }
      }
    }
    
    // 자정 새로고침 업데이트 추가
    if let midnight = calendar.date(bySettingHour: 0, minute: 0, second: 0, of: calendar.date(byAdding: .day, value: 1, to: startOfDay)!) {
      let entry = SimpleEntry(
        index: scheduleList.count,
        date: midnight,
        activeDate: activeDateString,
        isUpdate: true,
        style: style,
        scheduleList: scheduleList,
        activeSchedule: ActiveScheduleModel(
          schedule_id: nil,
          title: "",
          start_time: 0,
          end_time: 0,
          todo_list: []
        )
      )
      entries.append(entry)
    }
    
    let timeline = Timeline(entries: entries, policy: .never)
    completion(timeline)
  }
}

struct DelliWidgetEntryView : View {
  var entry: Provider.Entry
  
  private var backgroundColor: Color {
    Color(UIColor(hexCode: entry.style.background_color))
  }
  private var textColor: Color {
    Color(UIColor(hexCode: entry.style.text_color))
  }
  private var outlineBackgroundColor: Color {
    Color(UIColor(hexCode: entry.style.outline_background_color))
  }
  private var outlineProgressColor: Color {
    Color(UIColor(hexCode: entry.style.outline_progress_color))
  }
  
  @Environment(\.widgetFamily) var widgetFamily: WidgetFamily
  
  func timer(startTime: CGFloat, endTime: CGFloat, isFirst: Bool) -> Date {
    let currentDate = Date()

    // 시작 시간과 종료 시간을 분 단위로 가져옴
    let startTimeInMinutes = Int(startTime)
    let endTimeInMinutes = Int(endTime)
    
    // 종료 시간을 시간과 분으로 변환
    let endHour = endTimeInMinutes / 60
    let endMinute = endTimeInMinutes % 60
    
    // 현재 날짜의 종료 시간으로 Date 객체 생성
    var eventDate = Calendar.current.date(bySettingHour: endHour, minute: endMinute, second: 0, of: currentDate)!
    
    if (!isFirst && startTimeInMinutes > endTimeInMinutes) {
      // 자정 이전인 경우 종료 시간을 다음날로 설정
      eventDate = Calendar.current.date(
        bySettingHour: endHour,
        minute: endMinute,
        second: 0,
        of: Calendar.current.date(byAdding: .day, value: 1, to: currentDate)!
      )!
    }
    
    let remainingTime = eventDate.timeIntervalSince(currentDate)
    
    return Date(timeIntervalSinceNow: remainingTime)
  }
  
  func timeString(from minutes: CGFloat) -> String {
    // 하루의 시작 시간을 기준으로 분 단위를 시간과 분으로 변환
    let hours = Int(minutes) / 60
    let minutes = Int(minutes) % 60
    
    // Calendar를 이용해 Date 객체 생성
    var components = DateComponents()
    components.hour = hours
    components.minute = minutes
    
    // 현재 시간대의 Calendar 사용
    let calendar = Calendar.current
    if let date = calendar.date(from: components) {
      // DateFormatter로 원하는 형식으로 변환
      let formatter = DateFormatter()
      formatter.dateFormat = "a h:mm" // "a"는 AM/PM, "h"는 12시간 형식
      formatter.locale = Locale(identifier: "ko_KR") // 한국어 로케일 설정
      return formatter.string(from: date)
    }
    
    return ""
  }
  
  func timeRangeText(startTime: CGFloat, endTime: CGFloat) -> String {
    let startTimeString = timeString(from: startTime)
    let endTimeString = timeString(from: endTime)
    return "\(startTimeString) ~ \(endTimeString)"
  }
  
  var body: some View {
    ZStack {
      ZStack {
        switch self.widgetFamily {
        case .systemSmall:
          TimeTable(data: entry.scheduleList,
                    activeSchedule: entry.activeSchedule,
                    style: entry.style,
                    isUpdate: entry.isUpdate)
        case .systemMedium:
          HStack {
            TimeTable(data: entry.scheduleList,
                      activeSchedule: entry.activeSchedule,
                      style: entry.style,
                      isUpdate: entry.isUpdate)
            
            if(entry.scheduleList.count > 0) {
              VStack(alignment: .center) {
                Text("진행중인 일정")
                  .font(.custom("Pretendard-Bold", size: 10))
                  .foregroundColor(textColor)
                  .lineLimit(1)
                
                Spacer().frame(height: 7)
                
                if(entry.activeSchedule.schedule_id != nil && !entry.isUpdate) {
                  Text(entry.activeSchedule.title)
                    .font(.custom("Pretendard-Bold", size: 16))
                    .foregroundColor(textColor)
                    .lineLimit(1)
                  
                  Spacer().frame(height: 5)
                  
                  Text(
                    timeRangeText(
                      startTime: entry.activeSchedule.start_time,
                      endTime: entry.activeSchedule.end_time
                    )
                  )
                  .font(.custom("Pretendard-Medium", size: 12))
                  .foregroundColor(textColor)
                  
                  Text("남은 시간")
                    .font(.custom("Pretendard-Bold", size: 12))
                    .foregroundColor(textColor)
                    .lineLimit(1)
                    .padding(.top, 10)
                  
                  Spacer().frame(height: 5)
                  
                  Text(
                    timer(
                      startTime: entry.activeSchedule.start_time,
                      endTime: entry.activeSchedule.end_time,
                      isFirst: entry.index == 0
                    ),
                    style: .timer
                  )
                  .font(.custom("Pretendard-Bold", size: 12))
                  .foregroundColor(textColor)
                  .multilineTextAlignment(.center)
                } else {
                  Text("진행중인 일정이 없어요")
                    .font(.custom("Pretendard-Bold", size: 14))
                    .foregroundColor(textColor)
                    .padding(.top, 20)
                  
                }
              }
              .frame(
                minWidth: 0,
                maxWidth: .infinity,
                minHeight: 0,
                maxHeight: .infinity,
                alignment: .top
              )
              .padding(10)
            } else {
              VStack(alignment: .center) {
                Text("나만의 생활계획표를")
                  .font(.custom("Pretendard-Bold", size: 16))
                  .foregroundColor(textColor)
                Text("만들어보세요")
                  .font(.custom("Pretendard-Bold", size: 16))
                  .foregroundColor(textColor)
              }
              .frame(
                minWidth: 0,
                maxWidth: .infinity,
                minHeight: 0,
                maxHeight: .infinity
              )
            }
          }
        default:
          Text("default")
        }
      }
      .padding(15)
      .widgetBackground(backgroundColor)
      .frame(
        minWidth: 0,
        maxWidth: .infinity,
        minHeight: 0,
        maxHeight: .infinity
      )
      .blur(radius: entry.isUpdate ? 2 : 0)
      .overlayIf(
        entry.isUpdate,
        Color.black
          .frame(minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: .infinity)
          .opacity(0.7)
      )
      
      if(entry.isUpdate) {
        VStack {
          if let activeDate = entry.activeDate {
            Text("\(activeDate)의")
            Text("모든 일정이")
            Text("완료되었어요")
            
            Spacer().frame(height: 15)
          }
          
          ZStack {
            RoundedRectangle(cornerRadius: 10)
              .fill(Color(red: 30 / 255, green: 144 / 255, blue: 255 / 255))
              .frame(width: 120, height: 38)
            Text("일정 새로고침")
              .foregroundColor(Color.white)
              .font(.custom("Pretendard-Bold", size: 14))
          }
        }
        .foregroundColor(Color.white)
        .font(.custom("Pretendard-Medium", size: 14))
      }
    }
  }
}

struct DelliWidget: Widget {
  let kind: String = "DelliWidget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      let timestamp = Int(Date().timeIntervalSince1970 * 1000)
      
      if entry.isUpdate {
        DelliWidgetEntryView(entry: entry)
          .widgetURL(URL(string: "delli://widget/reload/\(timestamp)"))
      } else {
        DelliWidgetEntryView(entry: entry)
          .widgetURL(URL(string: "delli://widget"))
      }
    }
    .configurationDisplayName("생활계획표")
    .description("생활계획표로 일정을 간편하게 확인해 보세요")
    .supportedFamilies([
      .systemSmall,
      .systemMedium
    ])
    .contentMarginsDisabled()
  }
}

//#Preview(as: .systemMedium) {
//  DelliWidget()
//} timeline: {
//  SimpleEntry(
//    date: .now,
//    activeDate: "8월 24일",
//    isUpdate: true,
//    scheduleList: [
//      ScheduleModel(
//        schedule_id: 1,
//        title: "테스트",
//        start_time: 0,
//        end_time: 1440,
//        todo_list: []
//      )
//    ],
//    activeSchedule: ScheduleModel(
//      schedule_id: 1,
//      title: "테스트1212121231234142314123142313431",
//      start_time: 0,
//      end_time: 160,
//      todo_list: [
//        TodoModel(
//          todo_id: 1,
//          complete_id: 1,
//          title: "할 일 테스트1212121231234142314123142313431"
//        ),
//        TodoModel(
//          todo_id: 2,
//          complete_id: nil,
//          title: "할 일 테스트21212121231234142314123142313431"
//        )
//      ]
//    )
//  )
//}
