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
      let entry = SimpleEntry(
        date: midnight,
        isUpdate: true,
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
    }
    
    print(entries)
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
              
              VStack(alignment: .leading) {
                Text("진행중인 일정")
                  .font(.custom("Pretendard-Light", size: 12))
                  .foregroundColor(Color(red: 66 / 255, green: 66 / 255, blue: 66 / 255))
                  .padding(.bottom, 1)
                
                if(entry.activeSchedule.schedule_id != nil) {
                  Text(entry.activeSchedule.title)
                    .font(.custom("Pretendard-SemiBold", size: 14))
                    .foregroundColor(Color(red: 66 / 255, green: 66 / 255, blue: 66 / 255))
                } else {
                  Text("진행중인 일정이 없어요")
                    .font(.custom("Pretendard-Regular", size: 14))
                    .foregroundColor(Color(red: 124 / 255, green: 134 / 255, blue: 152 / 255))
                }
                
                HStack {
                  Text("할 일")
                    .font(.custom("Pretendard-Light", size: 12))
                    .foregroundColor(Color.black)
                  
                  if(entry.activeSchedule.todo_list.count > 0) {
                    Text("\(entry.activeSchedule.todo_list.count)")
                      .font(.custom("Pretendard-Bold", size: 12))
                      .foregroundColor(Color(red: 30 / 255, green: 144 / 255, blue: 255 / 255))
                  }
                }
                .padding(EdgeInsets(top: 5, leading: 0, bottom: 1, trailing: 0))
                
                if(entry.activeSchedule.todo_list.count > 0) {
                  ForEach(entry.activeSchedule.todo_list.prefix(2), id: \.self.todo_id) { todo in
                    HStack(alignment: .center) {
                      if(todo.complete_id == nil) {
                        ZStack {
                          RoundedRectangle(cornerRadius: 5)
                            .stroke(
                              Color(red: 238 / 255, green: 237 / 255, blue: 237 / 255),
                              lineWidth: 1
                            )
                            .frame(width: 20, height: 20)
                          
                          Image("checkBefore")
                            .resizable()
                            .frame(width: 12, height: 12)
                        }
                      } else {
                        ZStack {
                          RoundedRectangle(cornerRadius: 5)
                            .stroke(
                              Color(Color(red: 118 / 255, green: 214 / 255, blue: 114 / 255)),
                              lineWidth: 1
                            )
                            .fill(Color(red: 118 / 255, green: 214 / 255, blue: 114 / 255))
                            .frame(width: 20, height: 20)
                          
                          Image("checkAfter")
                            .resizable()
                            .frame(width: 12, height: 12)
                        }
                      }
                      
                      Text(todo.title)
                        .font(.custom("Pretendard-Medium", size: 14))
                        .foregroundColor(Color(red: 66 / 255, green: 66 / 255, blue: 66 / 255))
                    }
                  }
                } else {
                  Text("할 일이 없어요")
                    .font(.custom("Pretendard-Regular", size: 14))
                    .foregroundColor(Color(red: 124 / 255, green: 134 / 255, blue: 152 / 255))
                }
              }
              .frame(
                minWidth: 0,
                maxWidth: .infinity,
                minHeight: 0,
                maxHeight: .infinity,
                alignment: .topLeading
              )
              .padding(EdgeInsets(top: 10, leading: 0, bottom: 10, trailing: 10))
            }
          } else {
            Text("데이터 없음")
          }
        default:
          Text("default")
        }
      }
      .padding(5)
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
    .configurationDisplayName("My Widget")
    .description("This is an example widget.")
    .supportedFamilies([
      .systemSmall,
      .systemMedium
    ])
    .contentMarginsDisabled()
  }
}

#Preview(as: .systemMedium) {
  DelliWidget()
} timeline: {
  SimpleEntry(
    date: .now,
    isUpdate: false,
    scheduleList: [
      ScheduleModel(
        schedule_id: 1,
        title: "테스트",
        start_time: 0,
        end_time: 1440,
        todo_list: []
      )
    ],
    activeSchedule: ScheduleModel(
      schedule_id: 1,
      title: "테스트1212121231234142314123142313431",
      start_time: 0,
      end_time: 120,
      todo_list: [
        TodoModel(
          todo_id: 1,
          complete_id: 1,
          title: "할 일 테스트1212121231234142314123142313431"
        ),
        TodoModel(
          todo_id: 2,
          complete_id: nil,
          title: "할 일 테스트21212121231234142314123142313431"
        )
      ]
    )
  )
}
