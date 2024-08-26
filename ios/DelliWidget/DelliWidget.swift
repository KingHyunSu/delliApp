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
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let isUpdate: Bool
  let scheduleList: [ScheduleModel]
  let activeSchedule: ScheduleModel
}

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> SimpleEntry {
    SimpleEntry(
      date: Date(),
      isUpdate: false,
      scheduleList: [],
      activeSchedule: ScheduleModel(
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
      date: Date(),
      isUpdate: false,
      scheduleList: [],
      activeSchedule: ScheduleModel(
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

    var scheduleList: [ScheduleModel] = []
    var isUpdate = false

    do {
      if let jsonString = scheduleListJsonString {
        let decodedScheduleList = Data(jsonString.utf8)
        scheduleList = try JSONDecoder().decode([ScheduleModel].self, from: decodedScheduleList)
      }
    } catch {
      print(error)
    }

    let currentDate = Date()
    let calendar = Calendar.current
    let startOfDay = calendar.startOfDay(for: currentDate)
    let currentTime = calendar.dateComponents([.minute], from: startOfDay, to: currentDate).minute ?? 0

    if let activeDate = sharedUserDefaults?.object(forKey: "activeDate") as? Date {
      let activeStartOfDay = calendar.startOfDay(for: activeDate)

      if(startOfDay != activeStartOfDay) {
        isUpdate = true
      }
    }


    if scheduleList.isEmpty {
      let entry = SimpleEntry(
        date: currentDate,
        isUpdate: false,
        scheduleList: [],
        activeSchedule: ScheduleModel(
          schedule_id: nil,
          title: "",
          start_time: 0,
          end_time: 0,
          todo_list: []
        )
      )

      entries.append(entry)
    } else {
      for schedule in scheduleList {
        let hour = Int(floor(Double(schedule.start_time) / 60.0))
        let minute = Int(schedule.start_time) % 60

        var entry = SimpleEntry(
          date: calendar.date(bySettingHour: hour, minute: minute, second: 0, of: currentDate)!,
          isUpdate: isUpdate,
          scheduleList: scheduleList,
          activeSchedule: schedule
        )

        entries.append(entry)

        if schedule.schedule_id != nil && schedule.start_time > schedule.end_time && currentTime < Int(schedule.end_time) {
          entry = SimpleEntry(
            date: currentDate,
            isUpdate: isUpdate,
            scheduleList: scheduleList,
            activeSchedule: schedule
          )

          entries.append(entry)
        }
      }
    }

    // 자정 새로고침 업데이트 추가
    if let midnight = calendar.date(bySettingHour: 0, minute: 0, second: 0, of: calendar.date(byAdding: .day, value: 1, to: startOfDay)!) {
      let entry = SimpleEntry(
        date: midnight,
        isUpdate: true,
        scheduleList: scheduleList,
        activeSchedule: ScheduleModel(
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
  var backgroundColor: Color = Color(red: 254 / 255, green: 229 / 255, blue: 225 / 255)

  @Environment(\.widgetFamily) var widgetFamily: WidgetFamily

  func timer() -> Date {
    let currentDate = Date()

    // 시작 시간과 종료 시간을 분 단위로 가져옴
    let startTimeInMinutes = Int(entry.activeSchedule.start_time)
    let endTimeInMinutes = Int(entry.activeSchedule.end_time)

    // 종료 시간을 시간과 분으로 변환
    let endHour = endTimeInMinutes / 60
    let endMinute = endTimeInMinutes % 60

    // 현재 날짜의 종료 시간으로 Date 객체 생성
    var eventDate = Calendar.current.date(bySettingHour: endHour, minute: endMinute, second: 0, of: currentDate)!

    // 만약 시작 시간이 종료 시간보다 크다면, 종료 시간을 다음날로 설정
    if startTimeInMinutes > endTimeInMinutes {
        eventDate = Calendar.current.date(byAdding: .day, value: 1, to: eventDate)!
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
          TimeTable(data: entry.scheduleList, isUpdate: entry.isUpdate)
        case .systemMedium:
          HStack {
            TimeTable(data: entry.scheduleList, isUpdate: entry.isUpdate)

            if(entry.scheduleList.count > 0) {
              VStack(alignment: .center) {
                Text("진행중인 일정")
                  .font(.custom("Pretendard-Bold", size: 10))
                  .foregroundColor(Color(red: 255 / 255, green: 161 / 255, blue: 147 / 255))
                  .lineLimit(1)

                Spacer().frame(height: 7)

                if(entry.activeSchedule.schedule_id != nil && !entry.isUpdate) {
                  Text(entry.activeSchedule.title)
                    .font(.custom("Pretendard-Bold", size: 16))
                    .foregroundColor(Color(red: 51 / 255, green: 51 / 255, blue: 51 / 255))
                    .lineLimit(1)

                  Spacer().frame(height: 5)

                  Text(timeRangeText(startTime: entry.activeSchedule.start_time, endTime: entry.activeSchedule.end_time))
                    .font(.custom("Pretendard-Medium", size: 12))
                    .foregroundColor(Color(red: 51 / 255, green: 51 / 255, blue: 51 / 255))

                  Text("남은 시간")
                    .font(.custom("Pretendard-Bold", size: 12))
                    .foregroundColor(Color(red: 51 / 255, green: 51 / 255, blue: 51 / 255))
                    .lineLimit(1)
                    .padding(.top, 10)

                  Spacer().frame(height: 5)

                  Text(timer(), style: .timer)
                    .font(.custom("Pretendard-Bold", size: 12))
                    .foregroundColor(Color(red: 51 / 255, green: 51 / 255, blue: 51 / 255))
                    .multilineTextAlignment(.center)
                } else {
                  Text("진행중인 일정이 없어요")
                    .font(.custom("Pretendard-Bold", size: 14))
                    .foregroundColor(Color(red: 51 / 255, green: 51 / 255, blue: 51 / 255))
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
                  .foregroundColor(Color(red: 51 / 255, green: 51 / 255, blue: 51 / 255))
                Text("만들어보세요")
                  .font(.custom("Pretendard-Bold", size: 16))
                  .foregroundColor(Color(red: 51 / 255, green: 51 / 255, blue: 51 / 255))
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
          Text("생활계획표")
          Text("새로고침")
          // [todo] 8월 26일 생활계획표 만료
        }
        .foregroundColor(Color.white)
        .font(.custom("Pretendard-Medium", size: 16))
      }

    }
  }
}

struct DelliWidget: Widget {
  let kind: String = "DelliWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      DelliWidgetEntryView(entry: entry)
        .widgetURL(URL(string: "delli://widget/reload"))
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
//    isUpdate: false,
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
