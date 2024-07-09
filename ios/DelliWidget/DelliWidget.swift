import WidgetKit
import SwiftUI
import SVGKit

public struct ScheduleModel:Codable {
  let schedule_id: Int
  let title: String
  let start_time: CGFloat
  let end_time: CGFloat
  let anchorDegree: Double
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
        schedule_id: 0,
        title: "",
        start_time: 0,
        end_time: 0,
        anchorDegree: 0
      )
    )
  }
  
  func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
    let entry = SimpleEntry(
      date: Date(),
      isUpdate: false,
      scheduleList: [],
      activeSchedule: ScheduleModel(
        schedule_id: 0,
        title: "",
        start_time: 0,
        end_time: 0,
        anchorDegree: 0
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
    
    // 일정별 업데이트 추가
    for schedule in scheduleList {
      let hour = Int(floor(Double(schedule.start_time) / 60.0))
      let minute = Int(schedule.start_time) % 60
      
      if let updateDate = calendar.date(
        bySettingHour: hour,
        minute: minute,
        second: 0,
        of: currentDate) {
        
        let entry = SimpleEntry(
          date: updateDate,
          isUpdate: false,
          scheduleList: scheduleList,
          activeSchedule: schedule
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
          schedule_id: 0,
          title: "",
          start_time: 0,
          end_time: 0,
          anchorDegree: 0
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
  
  func getImage() -> UIImage? {
    let appGroupID = "group.delli.widget"
    
    if let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupID) {
      let imageURL = containerURL.appendingPathComponent("timetable.png")
      
      if FileManager.default.fileExists(atPath: imageURL.path) {
        return UIImage(contentsOfFile: imageURL.path)
      }
    }
    
    return nil
  }
  
  @Environment(\.widgetFamily) var widgetFamily: WidgetFamily
  
  var body: some View {
    ZStack {
      Color.white
      
      switch self.widgetFamily {
      case .systemSmall:
        if let image = getImage() {
          GeometryReader { geometry in
            let radius = min(geometry.size.width, geometry.size.height) / 2 - 2.5
            let center = CGPoint(x: geometry.size.width / 2, y: geometry.size.height / 2)
            
            ZStack {
              Image(uiImage: image)
                .resizable()
                .aspectRatio(contentMode: .fit)
              
              ActiveScheduleBorder(
                x: center.x,
                y: center.y,
                radius: radius,
                startAngle: entry.activeSchedule.start_time * 0.25 + 3,
                endAngle: entry.activeSchedule.end_time * 0.25 - 3
              )
            }
            .padding(14)
          }
        } else {
          Text("생활계획표를 추가해주세요.")
        }
      case .systemMedium:
        if(entry.scheduleList.count > 0) {
          VStack() {
            ForEach(entry.scheduleList, id: \.self.schedule_id) { schedule in
              HStack {
                Text(schedule.title)
                  .foregroundStyle(.black)
                Text(entry.activeSchedule.title)
                  .foregroundStyle(.black)
              }
            }
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
