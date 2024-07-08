//
//  WidgetUpdaterModule.swift
//  delli
//
//  Created by 김현수 on 7/6/24.
//

import Foundation
import WidgetKit
import React

@objc(WidgetUpdaterModule)
class WidgetUpdaterModule: NSObject {
  
  @objc(updateWidget:)
  func updateWidget(data: String) {
    let appGroupID = "group.delli.widget"
    let sharedDefaults = UserDefaults(suiteName: appGroupID)
    
    sharedDefaults?.set(data, forKey: "scheduleList")
    WidgetCenter.shared.reloadAllTimelines()
  }
}
