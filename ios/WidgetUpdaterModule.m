//
//  WidgetUpdaterModule.m
//  delli
//
//  Created by 김현수 on 7/6/24.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WidgetUpdaterModule, NSObject)

RCT_EXTERN_METHOD(updateWidget: (NSString *)data)

@end
