//
//  WidgetUpdaterModule.m
//  delli
//
//  Created by 김현수 on 7/6/24.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WidgetUpdaterModule, NSObject)
RCT_EXTERN_METHOD(updateWidget:(NSString *)data style:(NSString *)style dateString:(NSString *)dateString)
RCT_EXTERN_METHOD(shouldWidgetReload: (RCTPromiseResolveBlock)resolve reject: (RCTPromiseRejectBlock)reject)
@end
