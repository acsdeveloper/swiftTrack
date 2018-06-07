(function() {
    'use strict';
    angular.module('swiftTrack', [

            'swiftTrack.controllers',
            'swiftTrack.login',
            'swiftTrack.dashboard',
            'swiftTrack.assessment',
            'swiftTrack.progressreport',
            'swiftTrack.storageFactory',
            'swiftTrack.constants',
            'swiftTrack.requestService',
            'swiftTrack.userService',
            'swiftTrack.loader',
            'swiftTrack.networkInformation',
            'swiftTrack.pouchservice',
            'swiftTrack.signoff',
            // 'swiftTrack.sync',
            'ionic',
            'ngPDFViewer',
            'ngCookies',
            'ngCordova'


        ])

        .run(function($ionicPopup,Loader,$interval,$cookieStore,SyncService,storageFactory,SignoffService,$ionicPlatform, $ionicHistory, $rootScope, $state, $ionicNavBarDelegate,$cordovaNetwork) {
            $ionicPlatform.ready(function() {
                cordova.exec(win, fail, "File", "getFreeDiskSpace", []);
                function win(freeSpace){
                     if(freeSpace<1000000){
                        $ionicPopup.alert({
                            title: 'Low space',
                            template: 'Please Free up some space and come back'
                        }).then(function(res) {
                            ionic.Platform.exitApp();
                        });
                    }
                }
                function fail(err){
                    console.log(err)
                }
                // $rootScope.checkPermission = function() {
                //     setLocationPermission = function() {
                //       cordova.plugins.diagnostic.requestLocationAuthorization(function(status) {
                //         switch (status) {
                //           case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                //             break;
                //           case cordova.plugins.diagnostic.permissionStatus.DENIED:
                //             break;
                //           case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                //             break;
                //           case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                //             break;
                //         }
                //       }, function(error) {}, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);
                //     };
                //     cordova.plugins.diagnostic.getPermissionAuthorizationStatus(function(status) {
                //       switch (status) {
                //         case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                //           break;
                //         case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                //           setLocationPermission();
                //           break;
                //         case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                //           setLocationPermission();
                //           break;
                //         case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                //           setLocationPermission();
                //           break;
                //       }
                //     }, function(error) {}, cordova.plugins.diagnostic.runtimePermission.ACCESS_COARSE_LOCATION);
                //   };

                //sync code start 
                document.addEventListener("offline", onOffline, false);

                function onOffline() {
                    console.log('Offline detected');
                    // storageFactory.setdeviceOnline(false);
                    // Handle the offline event
                }
        
                document.addEventListener("online", onOnline, false);
        
                function onOnline() {
                    console.log('Online detected');
                    // storageFactory.setdeviceOnline(true);
                    // $cookieStore.put("ChangesBoolean", true);
                    if($cookieStore.get('ChangesBoolean') && $cookieStore.get('sessionkey')){
                        // Loader.startLoading();
                        SyncService.saveAPIOnline().then(function(){
                            Loader.stopLoading();
                            $cookieStore.put("ChangesBoolean", false);
                        })

                    }else{
                        console.log("5mins sync")
                        Loader.stopLoading();
                        SignoffService.fetchfulldata().then(function(val){      //--fetching swifttrack full data
                            SignoffService.putDataPouch(val).then(function(){   //--saving full data in detailed document in pouch
                                
                            })
                        })
                    }

                    // Handle the online event
                }
                //sync code end
                $interval(function () {
                    onOnline();
                }, 60000);
                if($cordovaNetwork.isOnline()){
                    Loader.startLoading();
                    onOnline();
                }

                //test ad
                //300000
                console.log(navigator.connection.type)
                // if (window.cordova && cordovaPlugin.Keyboard) {
                //     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                //     // for form inputs)
                //     cordovaPlugin.Keyboard.hideKeyboardAccessoryBar(true);

                //     // Don't remove this line unless you know what you are doing. It stops the viewport
                //     // from snapping when text inputs are focused. Ionic handles this internally for
                //     // a much nicer keyboard experience.
                //     cordova.plugins.Keyboard.disableScroll(true);
                // }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
                var handleBackButton = function() {
                    console.log($ionicHistory.currentStateName(), "current")
                    if ("app.dashboard" === $ionicHistory.currentStateName() || "app.login" === $ionicHistory.currentStateName()) {
                        // $ionicHistory.nextViewOptions({
                        //     disableBack: true
                        // });
                        ionic.Platform.exitApp();
                    }
                    else if ("app.assessment" === $ionicHistory.currentStateName() || "app.progressreport" === $ionicHistory.currentStateName()) {
                        // console.log('get asses')
                        $ionicNavBarDelegate.showBackButton(true);
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $ionicHistory.goBack();
                        $ionicHistory.clearHistory();
                        $ionicHistory.clearCache();
                    }
                    else if("signoff"==$ionicHistory.currentStateName()){
                        // console.log($cordovaNetwork.isOnline(),"locatopnmj")
                        if($cordovaNetwork.isOnline()==true && storageFactory.getchangessignoff()){

                            SignoffService.fetchfulldata().then(function(val){
                                    $ionicHistory.goBack();
                                SignoffService.putDataPouch(val).then(function(){
                                })
                            })
                        }else{
                            $ionicHistory.goBack();
                            $ionicHistory.clearHistory();
                            $ionicHistory.clearCache();
                        }
                    }

                    else {
                        $ionicHistory.goBack();
                    }
                };
                $ionicPlatform.registerBackButtonAction(handleBackButton, 999);
                $rootScope.$ionicGoBack = function() {
                    // console.log('back ionic')
                    handleBackButton();
                };
            });
        })
        // .config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
        //     $stateProvider
        //         .state('app', {
        //             url: '/header',
        //             abstract: true,
        //             templateUrl: 'app/header/header.html',
        //             controller: 'headerCtrl',
        //             controllerAs: 'vm'
        //         });
        //     $urlRouterProvider.otherwise('dashboard');
        //     $ionicConfigProvider.backButton.previousTitleText(false);
        //     $ionicConfigProvider.backButton.text(false);
        //     $ionicConfigProvider.backButton.icon('ion-android-arrow-back');
        //     $ionicConfigProvider.scrolling.jsScrolling(false);
        // })
        .directive('focusMe', function($timeout, $parse) {
            return {
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.focusMe);
                    scope.$watch(model, function(value) {
                        // console.log('value=', value);
                        $timeout(function() {
                            element[0].focus();
                        });

                    });

                }
            };
        })
        .directive('dynamicUrl', function () {
            return {
                restrict: 'A',
                link: function postLink(scope, element, attr) {
                    element.attr('src', attr.dynamicUrlSrc);
                }
            };
        })

        .filter('trusted', ['$sce', function ($sce) {
            return function(url) {
                // console.log("filterrrrrrr",url);
               return $sce.trustAsResourceUrl(url);
            };
        }])

        .filter('filefilter', function($filter) {
            return function (item) {
                // console.log(item)
                if(item && item!=undefined){
                    var targetPath = cordova.file.externalApplicationStorageDirectory +"files/";
                    var filename = item.substring(item.lastIndexOf('/')+1);
                    return targetPath+filename;
                }
                
            };
        })

        .filter('prof_imag_filter', function($filter) {
            return function (item) {
                // console.log(item)
                if(item && item!=undefined){
                    var targetPath = cordova.file.externalApplicationStorageDirectory +"files/";
                    var filename = item.substring(item.lastIndexOf('/')+1);
                    return targetPath+filename;
                }
                
            };
        });

        


}());
