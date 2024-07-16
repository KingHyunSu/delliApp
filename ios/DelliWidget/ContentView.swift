import SwiftUI

struct ContentView: View {
    var body: some View {
        ClockWiseCircle()
            .frame(width: 200, height: 200)
    }
}

struct ClockWiseCircle: View {
    @State private var angle: Double = 0
    private let timer = Timer.publish(every: 0.01, on: .main, in: .common).autoconnect()
    
    var body: some View {
        GeometryReader { geometry in
            let radius = min(geometry.size.width, geometry.size.height) / 2
            let center = CGPoint(x: geometry.size.width / 2, y: geometry.size.height / 2)
            let x = center.x + radius * cos(angle)
            let y = center.y + radius * sin(angle)
            
            Circle()
                .frame(width: 20, height: 20)
                .position(x: x, y: y)
                .onReceive(timer) { _ in
                    angle += 0.01
                    if angle >= 2 * .pi {
                        angle = 0
                    }
                }
        }
    }
}
