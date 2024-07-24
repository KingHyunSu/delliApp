#import "AppDelegate.h"
#import <Firebase.h>
#import <RNKakaoLogins.h>
#import "RNSplashScreen.h"

#import <React/RCTLinkingManager.h>
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"delli";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  // Firebase 초기화
  [FIRApp configure];
  
  // shouldWidgetReload key 초기화
  NSString *appGroupID = @"group.delli.widget";
  NSUserDefaults *sharedUserDefaults = [[NSUserDefaults alloc] initWithSuiteName:appGroupID];
  
  if([sharedUserDefaults objectForKey:@"shouldWidgetReload"] == nil) {
    [sharedUserDefaults setBool:NO forKey:@"shouldWidgetReload"];
  }
  
  [super application:application didFinishLaunchingWithOptions:launchOptions];
  
  // RNSplashScreen 초기화
  [RNSplashScreen show];
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)concurrentRootEnabled
{
  return true;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
    return [RNKakaoLogins handleOpenUrl: url];
  }
  
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
