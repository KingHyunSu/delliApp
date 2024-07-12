import SwiftUI

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

struct TimeTable: View {
  var data: ScheduleModel
  
  var body: some View {
    if let image = getImage() {
      GeometryReader { geometry in
        //        let radius = min(geometry.size.width, geometry.size.height) / 2 - 2.5
        let radius = geometry.size.height / 2
        let center = CGPoint(x: geometry.size.width / 2, y: geometry.size.height / 2)
        
        ZStack {
          Image(uiImage: image)
            .resizable()
            .aspectRatio(contentMode: .fit)
          
          if(data.schedule_id != nil) {
            ActiveScheduleBorder(
              x: center.x,
              y: center.y,
              radius: radius,
              startAngle: data.start_time * 0.25 + 3,
              endAngle: data.end_time * 0.25 - 3
            )
          }
        }
      }
    } else {
      Text("생활계획표를 추가해주세요.")
    }
    
//    GeometryReader { geometry in
//      //        let radius = min(geometry.size.width, geometry.size.height) / 2 - 2.5
//      let radius = geometry.size.height / 2
//      let center = CGPoint(x: geometry.size.width / 2, y: geometry.size.height / 2)
//      
//      ZStack {
//        Image("TimelinePreview")
//          .resizable()
//          .aspectRatio(contentMode: .fit)
//        
//        if(data.schedule_id != nil) {
//          ActiveScheduleBorder(
//            x: center.x,
//            y: center.y,
//            radius: radius,
//            startAngle: data.start_time * 0.25 + 3,
//            endAngle: data.end_time * 0.25 - 3
//          )
//        }
//      }
//    }
  }
}
