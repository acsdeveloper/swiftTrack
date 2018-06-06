(function() {
    'use strict';

    angular.module('swiftTrack.signoff', ['ui.router'])
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
                .state('signoff', {
                    url: '/signoff',
                    templateUrl: 'app/signoff/signoff.html',
                    controller: 'signoffCtrl',
                    controllerAs: 'vm',
                    cache: false,
                    
                })
        }])


}())
