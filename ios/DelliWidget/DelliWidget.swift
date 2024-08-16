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
    let scheduleListJsonString = sharedUserDefaults?.string(forKey: "scheduleList")
    var scheduleList: [ScheduleModel] = []
    
    do {
      if scheduleListJsonString != nil {
        let decodedScheduleList = Data(scheduleListJsonString?.utf8 ?? "".utf8)
        scheduleList = try JSONDecoder().decode([ScheduleModel].self, from: decodedScheduleList)
      }
    } catch {
      print(error)
    }
    
    let currentDate = Date()
    let calendar = Calendar.current
    let startOfDay = calendar.startOfDay(for: currentDate)
    let currentTime = calendar.dateComponents([.minute], from: startOfDay, to: currentDate).minute
    
    if(scheduleList.count == 0) {
      let entry = SimpleEntry(
        date: calendar.date(byAdding: .hour, value: 0, to: currentDate)!,
        isUpdate: false,
        scheduleList: [],
        activeSchedule: ScheduleModel(
          schedule_id: nil,
          title: "",
          start_time: 0,
          end_time: 0
        )
      )
      
      entries.append(entry)
    } else {
      for schedule in scheduleList {
        let hour = Int(floor(Double(schedule.start_time) / 60.0))
        let minute = Int(schedule.start_time) % 60
        
        var entry = SimpleEntry(
          date: calendar.date(bySettingHour: hour, minute: minute, second: 0, of: currentDate)!,
          isUpdate: false,
          scheduleList: scheduleList,
          activeSchedule: schedule
        )
        
        entries.append(entry)
        
        // 위젯 타임라인 생성시 현재 시간에 따라 일정 active 제어
        if let currentTime = currentTime {
          // 자정 이전에 일정이 있을 경우
          if(schedule.schedule_id != nil
             && schedule.start_time > schedule.end_time
             && currentTime < Int(schedule.end_time)
          ) {
            entry = SimpleEntry(
              date: calendar.date(byAdding: .hour, value: 0, to: currentDate)!,
              isUpdate: false,
              scheduleList: scheduleList,
              activeSchedule: schedule
            )
            
            entries.append(entry)
          }
        }
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
//      sharedUserDefaults?.set(true, forKey: "shouldWidgetReload")
      
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
                
                Text(entry.activeSchedule.schedule_id != nil ? entry.activeSchedule.title : "-")
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
          Text("생활계획표")
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

