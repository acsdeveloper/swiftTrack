(function() {
    'use strict';

    angular.module('swiftTrack.progressreport', ['ui.router'])
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider
                // .state('app.progressreport', {
                //     url: '/report',
                //     cache: false,
                //     views: {
                //         'menuContent': {
                //             templateUrl: 'app/people/people.html',
                //             controller: 'peopleCtrl',
                //             controllerAs: 'vm',
                //         }
                //     }
                // });
                .state('progressreport', {
                    url: '/report',
                    templateUrl: 'app/people/people.html',
                    controller: 'peopleCtrl',
                    controllerAs: 'vm',
                    cache: false,
                    
                })
        }])


}())
