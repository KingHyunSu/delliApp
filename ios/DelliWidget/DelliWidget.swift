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
  let title: String
}

public struct ScheduleModel:Codable {
  let schedule_id: Int?
  let title: String
  let start_time: CGFloat
  let end_time: CGFloat
  //  let todo_list: [TodoModel]
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
        end_time: 0
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
        end_time: 0
      )
    )
    completion(entry)
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
    var entries: [SimpleEntry] = []

    let appGroupID = "group.delli.widget"
    let sharedUserDefaults = UserDefaults(suiteName: appGroupID)

    //    let shouldWidgetUpdateJsonString = sharedUserDefaults?.string(forKey: "shouldWidgetUpdate")
    let scheduleListJsonString = sharedUserDefaults?.string(forKey: "scheduleList")

    //    var shouldWidgetUpdate: Bool = false
    var scheduleList: [ScheduleModel] = []

    do {
      //      if shouldWidgetUpdateJsonString != nil {
      //        let decodedShouldWidgetUpdate = Data(shouldWidgetUpdateJsonString?.utf8 ?? "".utf8)
      //        shouldWidgetUpdate = try JSONDecoder().decode(Bool.self, from: decodedShouldWidgetUpdate)
      //      }

      if scheduleListJsonString != nil {
        let decodedScheduleList = Data(scheduleListJsonString?.utf8 ?? "".utf8)
        scheduleList = try JSONDecoder().decode([ScheduleModel].self, from: decodedScheduleList)
      }
    } catch {
      print(error)
    }


    // Generate a timeline consisting of five entries an hour apart, starting from the current date.
    let currentDate = Date()
    let calendar = Calendar.current
    let startOfDay = calendar.startOfDay(for: currentDate)
    let currentTime = calendar.dateComponents([.minute], from: startOfDay, to: currentDate).minute

    // 일정별 업데이트 추가
    /**
     1. 자정 전에 일정이 있을 경우 active
     2. 자정일 경우 일정 그대로 추가
     3. 자정 넘어서 일정이 있을 경우 자정에 업데이트용 timeline 추가
     */


    // TODO - 현재 시간(current)에 맞는 active schedule 찾아야함

    for schedule in scheduleList {
      let hour = Int(floor(Double(schedule.start_time) / 60.0))
      let minute = Int(schedule.start_time) % 60

      if let updateDate = calendar.date(
        bySettingHour: hour,
        minute: minute,
        second: 0,
        of: currentDate) {

        var activeSchedule = ScheduleModel(
          schedule_id: nil,
          title: "",
          start_time: 0,
          end_time: 0
        )

        if let currentTime = currentTime {
          if(currentTime < Int(schedule.end_time) && currentTime > Int(schedule.start_time)) {
            activeSchedule = schedule
          }
        }

        let entry = SimpleEntry(
          date: updateDate,
          isUpdate: false,
          scheduleList: scheduleList,
          activeSchedule: activeSchedule
        )
        entries.append(entry)
      }
    }

    // 자정 새로고침 업데이트 추가
    if let midnight = calendar.date(
      bySettingHour: 0,
      minute: 0,
      second: 0,
      of: calendar.date(byAdding: .day, value: 1, to: currentDate)!
    ) {
      //    if let midnight = calendar.date(
      //      bySettingHour: 17,
      //      minute: 06,
      //      second: 0,
      //      of: currentDate) {
//    if let midnight = calendar.date(byAdding: .minute, value: 2, to: currentDate) {
      sharedUserDefaults?.set(true, forKey: "shouldWidgetReload")

      let entry = SimpleEntry(
        date: midnight,
        isUpdate: true,
        scheduleList: [],
        activeSchedule: ScheduleModel(
          schedule_id: nil,
          title: "",
          start_time: 0,
          end_time: 0
        )
      )
      entries.append(entry)
    }

    let timeline = Timeline(entries: entries, policy: .atEnd)
    completion(timeline)
  }
}

struct DelliWidgetEntryView : View {
  var entry: Provider.Entry
  var backgroundColor: Color = Color.white

  @Environment(\.widgetFamily) var widgetFamily: WidgetFamily

  var body: some View {
    ZStack {
      ZStack {
        switch self.widgetFamily {
        case .systemSmall:
          TimeTable(data: entry.activeSchedule)
        case .systemMedium:
          if(entry.scheduleList.count > 0) {
            HStack {
              TimeTable(data: entry.activeSchedule)

              VStack {
                Text("진행중인 일정")
                  .font(.custom("Pretendard-Bold", size: 12))
                  .foregroundColor(Color(red: 124 / 255, green: 134 / 255, blue: 152 / 255))
                  .frame(minWidth:0,
                         maxWidth: .infinity,
                         alignment: .leading
                  )
                  .padding(.bottom, 2)

                Text(entry.activeSchedule.title)
                  .font(.custom("Pretendard-Regular", size: 18))
                  .foregroundStyle(Color.black)
                  .frame(minWidth:0,
                         maxWidth: .infinity,
                         alignment: .leading
                  )

                  .padding(.bottom, 10)

                Text("할 일")
                  .font(.custom("Pretendard-SemiBold", size: 12))
                  .foregroundColor(Color(red: 124 / 255, green: 134 / 255, blue: 152 / 255))
                  .frame(minWidth:0,
                         maxWidth: .infinity,
                         alignment: .leading
                  )
                  .padding(.bottom, 2)
              }
              .frame(
                minWidth: 0,
                maxWidth: .infinity,
                minHeight: 0,
                maxHeight: .infinity,
                alignment: .topLeading
              )
              .padding(.vertical, 6)

              //            VStack() {
              //              ForEach(entry.scheduleList, id: \.self.schedule_id) { schedule in
              //                HStack {
              //                  Text(schedule.title)
              //                    .foregroundStyle(.black)
              //                  Text(entry.activeSchedule.title)
              //                    .foregroundStyle(.black)
              //                }
              //              }
              //            }
            }
          } else {
            Text("데이터 없음")
          }
        default:
          Text("default")
        }
      }
      .padding(14)
      .widgetBackground(backgroundColor)
      .frame(
        minWidth: 0,
        maxWidth: .infinity,
        minHeight: 0,
        maxHeight: .infinity
      )
      .overlayIf(
        entry.isUpdate,
        Color.black
          .frame(minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: .infinity)
          .opacity(0.7)
      )

      if(entry.isUpdate) {
        VStack {
          Text("클릭하여 일정")
          Text("새로고침")
        }
        .foregroundColor(Color.white)
        .font(.custom("Pretendard-Medium", size: 16))
        .widgetURL(URL(string: "delli://widget/reload"))
      }
    }
  }
}

struct DelliWidget: Widget {
  let kind: String = "DelliWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      DelliWidgetEntryView(entry: entry)
    }
    .configurationDisplayName("My Widget")
    .description("This is an example widget.")
    .supportedFamilies([
      .systemSmall,
      .systemMedium
    ])
    .contentMarginsDisabled()
  }
}
//
//#Preview(as: .systemMedium) {
//  DelliWidget()
//} timeline: {
//  SimpleEntry(
//    date: .now,
//    isUpdate: true,
//    scheduleList: [
//      ScheduleModel(
//        schedule_id: 1,
//        title: "테스트",
//        start_time: 0,
//        end_time: 1440
//      )
//    ],
//    activeSchedule: ScheduleModel(
//      schedule_id: 1,
//      title: "테스트",
//      start_time: 0,
//      end_time: 1439
//    )
//  )
//}
