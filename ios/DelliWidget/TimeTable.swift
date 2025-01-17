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
  var data: [ScheduleModel]
  var activeSchedule: ActiveScheduleModel
  var style: StyleModel
  var isUpdate: Bool
  
  var fromTirm: CGFloat {
    activeSchedule.start_time * 0.0007 + 0.01
  }
  var endTirm: CGFloat {
    activeSchedule.end_time * 0.0007 - 0.02
  }
  
  var body: some View {
    ZStack {
      if(data.count > 0) {
        if let image = getImage() {
          Image(uiImage: image)
            .resizable()
            .aspectRatio(contentMode: .fit)
            .padding(10)
          
          ZStack {
            Circle()
              .stroke(lineWidth: 6)
              .foregroundColor(Color(UIColor(hexCode: style.outline_background_color)))
            
            if(activeSchedule.schedule_id != nil) {
              if(fromTirm < endTirm) {
                Circle()
                  .trim(from: fromTirm, to: endTirm)
                  .stroke(style: StrokeStyle(lineWidth: 7, lineCap: .round))
                  .foregroundColor(Color(UIColor(hexCode: style.outline_progress_color)))
                  .rotationEffect(.degrees(-90))
              } else {
                ZStack {
                  Circle()
                    .trim(from: fromTirm, to: 1.0)
                    .stroke(style: StrokeStyle(lineWidth: 7, lineCap: .round))
                    .foregroundColor(Color(UIColor(hexCode: style.outline_progress_color)))
                    .rotationEffect(.degrees(-90))
                  Circle()
                    .trim(from: 0.0, to: endTirm)
                    .stroke(style: StrokeStyle(lineWidth: 7, lineCap: .round))
                    .foregroundColor(Color(UIColor(hexCode: style.outline_progress_color)))
                    .rotationEffect(.degrees(-90))
                }
              }
            }
          }.padding(7)
        }
        
        //        preview용 생활계획표
        //        Image("emptyTimetable")
        //          .resizable()
        //          .aspectRatio(contentMode: .fit)
        //          .padding(10)
        //
        //        ProgressView(value: isUpdate ? 1 : progress())
        //          .progressViewStyle(TimeProgressViewStyle())
        //          .padding(6.5)
      } else {
        ZStack{
          Circle()
            .foregroundColor(Color(red: 245 / 255, green: 246 / 255, blue: 248 / 255))
            .padding(9.5)
          
          Circle()
            .stroke(lineWidth: 6)
            .foregroundColor(Color(red: 249 / 255, green: 249 / 255, blue: 249 / 255))
            .padding(6.5)
          
          Text("일정을 추가해주세요")
            .font(.custom("Pretendard-Bold", size: 10))
            .foregroundColor(Color(red: 186 / 255, green: 191 / 255, blue: 197 / 255))
        }
      }
    }
  }
}
