(function() {
    'use strict';

    angular.module('swiftTrack.dashboard', ['ui.router'])
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'dashboardCtrl',
                controllerAs: 'vm',
                cache: false,
                
            })
                // .state('app.dashboard', {
                //     url: '/dashboard',
                //     cache: false,
                //     views: {
                //         'menuContent': {
                //             templateUrl: 'app/dashboard/dashboard.html',
                //             controller: 'dashboardCtrl',
                //             controllerAs: 'vm',
                //         }
                //     }
                // });
        }])


}())
