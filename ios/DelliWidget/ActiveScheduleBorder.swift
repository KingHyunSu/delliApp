import SwiftUI
import CoreGraphics

func polarToCartesian(centerX: CGFloat, centerY: CGFloat, radius: CGFloat, angleInDegrees: CGFloat) -> CGPoint {
  let angleInRadians = (angleInDegrees - 90) * .pi / 180.0
  
  let x = centerX + radius * cos(angleInRadians)
  let y = centerY + radius * sin(angleInRadians)
  
  return CGPoint(x: x, y: y)
}

func getArcSweep(startAngle: CGFloat, endAngle: CGFloat) -> Int {
  if (endAngle >= startAngle) {
    return endAngle - startAngle <= 180 ? 0 : 1
  }
  
  return endAngle + 360.0 - startAngle <= 180 ? 0 : 1
}

struct ActiveScheduleBorder: View {
  var x:CGFloat = 0
  var y:CGFloat = 0
  var radius:CGFloat = 0
  var startAngle:CGFloat = 0
  var endAngle:CGFloat = 0
  
  var body: some View {
    let arcSweep = getArcSweep(startAngle: startAngle, endAngle: endAngle)
    let padding:CGFloat = 14
    var path = Path()
    
    path.addArc(
      center: CGPoint(x: x - padding, y: y - padding),
      radius: radius - padding,
      startAngle: Angle(degrees: Double(startAngle - 90)),
      endAngle: Angle(degrees: Double(endAngle - 90)),
      clockwise: arcSweep == 1
    )
    
    return path.stroke(
      Color(red: 30 / 255, green: 144 / 255, blue: 255 / 255),
      style: StrokeStyle(lineWidth: 3, lineCap: .round, lineJoin: .round)
    )
    .opacity(0.5)
  }
}
