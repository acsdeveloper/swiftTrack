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
            'ionic',
            'ngPDFViewer',
            'ngCookies',
            'ngCordova'


        ])

        .run(function($ionicPlatform, $ionicHistory, $rootScope, $state, $ionicNavBarDelegate) {
            $ionicPlatform.ready(function() {
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
                        console.log('get asses')
                        $ionicNavBarDelegate.showBackButton(true);
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $ionicHistory.goBack();
                        $ionicHistory.clearHistory();
                        $ionicHistory.clearCache();
                    }

                    else {
                        $ionicHistory.goBack();
                    }
                };
                $ionicPlatform.registerBackButtonAction(handleBackButton, 999);
                $rootScope.$ionicGoBack = function() {
                    console.log('back ionic')
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
                        console.log('value=', value);
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
                console.log("filterrrrrrr",url);
               return $sce.trustAsResourceUrl(url);
            };
        }])

        .filter('filefilter', function($filter) {
            return function (item) {
                console.log(item)
                if(item && item!=undefined){
                    var targetPath = cordova.file.externalApplicationStorageDirectory +"files/";
                    var filename = item.substring(item.lastIndexOf('/')+1);
                    return targetPath+filename;
                }
                
            };
        });


}());
