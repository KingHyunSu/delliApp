//
//  RCTAppStroage.m
//  delli
//
//  Created by 김현수 on 6/16/24.
//

#import "RCTAppStroage.h"

@implementation RCTAppStroage

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(set:(NSString *)data
                  resolver:(RCTPromiseResolveBlock) resolve
                  rejecter:(RCTPromiseRejectBlock) reject)
{
  @try {
    NSUserDefaults *userDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.delli.widget"];
    [userDefaults setObject:data forKey:@"data"];
    [userDefaults synchronize];
    resolve(@"true");
  } @catch(NSException *exception) {
    reject(@"get_error", exception.reason, nil);
  }
}

@end
