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

private func progress() -> Double {
  let currentDate = Date()
  let calendar = Calendar.current
  
  // 하루의 시작과 끝 시간 계산
  let startOfDay = calendar.startOfDay(for: currentDate)
  let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay)!
  
  let totalDuration = endOfDay.timeIntervalSince(startOfDay)
  let elapsedTime = currentDate.timeIntervalSince(startOfDay)
  
  return min(max(elapsedTime / totalDuration, 0.0), 1.0) // progress value between 0.0 and 1.0
}

struct TimeProgressViewStyle: ProgressViewStyle {
  func makeBody(configuration: Configuration) -> some View {
    ZStack {
      Circle()
        .stroke(lineWidth: 6)
        .foregroundColor(Color(red: 249 / 255, green: 249 / 255, blue: 249 / 255))
      
      Circle()
        .trim(from: 0.0, to: CGFloat(configuration.fractionCompleted ?? 0.0))
        .stroke(style: StrokeStyle(lineWidth: 7, lineCap: .round))
        .foregroundColor(Color(red: 255 / 255, green: 161 / 255, blue: 147 / 255))
        .rotationEffect(.degrees(-90))
    }
  }
}

struct TimeTable: View {
  var data: [ScheduleModel]
  var isUpdate: Bool
  
  var body: some View {
    ZStack {
      if(data.count > 0) {
        if let image = getImage() {
          Image(uiImage: image)
            .resizable()
            .aspectRatio(contentMode: .fit)
            .padding(10)
          
          ProgressView(value: isUpdate ? 1 : progress())
            .progressViewStyle(TimeProgressViewStyle())
            .padding(7)
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
