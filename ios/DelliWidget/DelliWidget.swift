//
//  DelliWidget.swift
//  DelliWidget
//
//  Created by 김현수 on 6/16/24.
//

import WidgetKit
import SwiftUI
import SVGKit

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> SimpleEntry {
    SimpleEntry(date: Date(), emoji: "😀")
  }
  
  func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
    let entry = SimpleEntry(date: Date(), emoji: "😀")
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
    var entries: [SimpleEntry] = []
    
    // Generate a timeline consisting of five entries an hour apart, starting from the current date.
    let currentDate = Date()
    for hourOffset in 0 ..< 5 {
      let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
      let entry = SimpleEntry(date: entryDate, emoji: "😀")
      entries.append(entry)
    }
    
    let timeline = Timeline(entries: entries, policy: .atEnd)
    completion(timeline)
  }
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let emoji: String
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
  
  
  var body: some View {
    if let image = getImage() {
      Image(uiImage: image)
        .resizable()
        .aspectRatio(contentMode: .fit)
    } else {
      Text("이미지 없음")
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
  }
}

//#Preview(as: .systemSmall) {
//    DelliWidget()
//} timeline: {
//    SimpleEntry(date: .now, emoji: "😀")
//    SimpleEntry(date: .now, emoji: "🤩")
//}
