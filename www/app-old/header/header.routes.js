/*global angular*/
(function() {
    'use strict';
    angular.module('swiftTrack.header', ['ui.router'])
        .config(function($stateProvider) {
            /*Menu router*/
            $stateProvider
                .state('app.header', {
                    url: '/header',
                    templateUrl: 'app/header/header.html',
                    cache: false,
                    views: {
                        'menuContent': {
                            templateUrl: 'app/dashboard/dashboard.html',
                            controller: 'dashboardCtrl'
                        }
                    }
                });
        });
}());
