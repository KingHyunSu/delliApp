//
//  RCTAppGroupModule.m
//  delli
//
//  Created by 김현수 on 6/30/24.
//

#import "RCTAppGroupModule.h"

@implementation RCTAppGroupModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getAppGroupPath,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) 
{
  NSString *appGroupID = @"group.delli.widget";
  NSURL *containerURL = [[NSFileManager defaultManager] containerURLForSecurityApplicationGroupIdentifier:appGroupID];
  
  if (containerURL != nil) {
    resolve([containerURL path]);
  } else {
    NSError *error = [NSError errorWithDomain:@"AppGroupModule" code:500 userInfo:@{NSLocalizedDescriptionKey:@"Failed to get App Group path"}];
    reject(@"no_app_group_path", @"There was an error getting the App Group path", error);
  }
}
@end
