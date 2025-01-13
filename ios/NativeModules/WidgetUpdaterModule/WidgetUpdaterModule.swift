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
  @objc 
  static func requiresMainQueueSetup() -> Bool { return true }

  @objc(updateWidget:style:dateString:)
  public func updateWidget(data: String, style: String, dateString: String) -> Void {
    let appGroupID = "group.delli.widget"
    let sharedUserDefaults = UserDefaults(suiteName: appGroupID)
    
    sharedUserDefaults?.set(data, forKey: "scheduleList")
    sharedUserDefaults?.set(style, forKey: "style")
    
    if let date = ISO8601DateFormatter().date(from: dateString) {
      sharedUserDefaults?.set(date, forKey: "activeDate")
    }

    WidgetCenter.shared.reloadAllTimelines()
  }
  
  @objc
  public func shouldWidgetReload(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    let appGroupID = "group.delli.widget"
    let sharedUserDefaults = UserDefaults(suiteName: appGroupID)
    
    if let shouldWidgetReload = sharedUserDefaults?.bool(forKey: "shouldWidgetReload") {
      resolve(shouldWidgetReload)
    } else {
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("shouldWidgetUpdate error", "There was no shouldWidgetUpdate value", error)
    }
  }
}
