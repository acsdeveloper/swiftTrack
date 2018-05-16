(function() {
    'use strict';

    angular.module('swiftTrack.assessment', ['ui.router'])
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider
                // .state('app.assessment', {
                //     url: '/assessment',
                //     cache: false,
                //     views: {
                //         'menuContent': {
                //             templateUrl: 'app/assessment/assessment.html',
                //             controller: 'assessmentCtrl',
                //             controllerAs: 'vm',
                //         }
                //     }
                // });
                .state('assessment', {
                    url: '/assessment',
                    templateUrl: 'app/assessment/assessment.html',
                    controller: 'assessmentCtrl',
                    controllerAs: 'vm',
                    cache: false,
                    
                })
        }])


}())
