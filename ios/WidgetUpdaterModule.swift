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
    let sharedUserDefaults = UserDefaults(suiteName: appGroupID)
    
    sharedUserDefaults?.set(false, forKey: "shouldWidgetReload")
    sharedUserDefaults?.set(data, forKey: "scheduleList")
    WidgetCenter.shared.reloadAllTimelines()
  }
  
  @objc
  func shouldWidgetReload(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let appGroupID = "group.delli.widget"
    let sharedUserDefaults = UserDefaults(suiteName: appGroupID)
    
    if let shouldWidgetReload = sharedUserDefaults?.string(forKey: "shouldWidgetReload") {
      print(shouldWidgetReload)
      resolve(shouldWidgetReload)
    } else {
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("shouldWidgetUpdate error", "There was no shouldWidgetUpdate value", error)
    }
  }
}
