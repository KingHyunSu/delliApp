import WidgetKit
import SwiftUI

public struct ScheduleModel:Codable {
  let schedule_id: Int?
  let title: String
  let start_time: CGFloat
  let end_time: CGFloat
}

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
        let value = try JSONDecoder().decode([ScheduleModel].self, from: decodedScheduleList)
        
        scheduleList = value
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
          print("오늘 경과된 시간 (분): \(currentTime)")
          print("start_time: \(Int(schedule.start_time))")
          print("end_time: \(Int(schedule.end_time))")
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
    if let midnight = calendar.date(bySettingHour: 0, minute: 0, second: 0, of: calendar.date(byAdding: .day, value: 1, to: currentDate)!) {
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
  
  @Environment(\.widgetFamily) var widgetFamily: WidgetFamily
  
  var body: some View {
    ZStack {
      Color.white
      
      switch self.widgetFamily {
      case .systemSmall:
        if(entry.isUpdate) {
         Text("일정 새로고침")
//            .widgetURL(URL(string: "myapp://widget/reload"))
        } else {
          TimeTable(data: entry.activeSchedule)
            .padding(14)
        }
      case .systemMedium:
        if(entry.scheduleList.count > 0) {
          HStack {
            TimeTable(data: entry.activeSchedule)
            
            if(entry.activeSchedule.schedule_id != nil) {
              VStack {
                Text(entry.activeSchedule.title)
              }
            } else {
              Text("일정이 없습니다.")
            }
            
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
    .widgetBackground(.white)
  }
}

struct DelliWidget: Widget {
  let kind: String = "DelliWidget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      DelliWidgetEntryView(entry: entry)
      //      if #available(iOS 17.0, *) {
      //        DelliWidgetEntryView(entry: entry)
      //      } else {
      //        DelliWidgetEntryView(entry: entry)
      //      }
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

//#Preview(as: .systemSmall) {
//    DelliWidget()
//} timeline: {
//    SimpleEntry(date: .now, emoji: "😀")
//    SimpleEntry(date: .now, emoji: "🤩")
//}
