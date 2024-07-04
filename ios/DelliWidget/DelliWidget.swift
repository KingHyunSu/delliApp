//
//  DelliWidget.swift
//  DelliWidget
//
//  Created by 김현수 on 6/16/24.
//

import WidgetKit
import SwiftUI
import SVGKit

public struct ScheduleModel:Codable {
  let schedule_id: Int
  let title: String
}

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> SimpleEntry {
    SimpleEntry(date: Date(), scheduleList: [])
  }
  
  func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
    let entry = SimpleEntry(date: Date(), scheduleList: [])
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
    for hourOffset in 0 ..< 5 {
      let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
      let entry = SimpleEntry(date: entryDate, scheduleList: scheduleList)
      entries.append(entry)
    }
    
    let timeline = Timeline(entries: entries, policy: .atEnd)
    completion(timeline)
  }
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let scheduleList: [ScheduleModel]
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
    switch self.widgetFamily {
    case .systemSmall:
      if let image = getImage() {
        Image(uiImage: image)
          .resizable()
          .aspectRatio(contentMode: .fit)
      } else {
        Text("이미지 없음")
      }
    case .systemMedium:
      if(entry.scheduleList.count > 0) {
        VStack() {
          ForEach(entry.scheduleList, id: \.self.schedule_id) { schedule in
            Text(schedule.title)
          }
        }
      } else {
        Text("데이터 없음")
      }
    default:
      Text("default")
    }
  }
  
}

struct DelliWidget: Widget {
  let kind: String = "DelliWidget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      if #available(iOS 17.0, *) {
        DelliWidgetEntryView(entry: entry)
          .containerBackground(.fill.tertiary, for: .widget)
      } else {
        DelliWidgetEntryView(entry: entry)
      }
    }
    .configurationDisplayName("My Widget")
    .description("This is an example widget.")
    .supportedFamilies([
      .systemSmall,
      .systemMedium
    ])
  }
}

//#Preview(as: .systemSmall) {
//    DelliWidget()
//} timeline: {
//    SimpleEntry(date: .now, emoji: "😀")
//    SimpleEntry(date: .now, emoji: "🤩")
//}
