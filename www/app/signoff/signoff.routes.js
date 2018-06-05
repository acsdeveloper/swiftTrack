(function() {
    'use strict';

    angular.module('swiftTrack.signoffpage', ['ui.router'])
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider
               
                .state('signoffpage', {
                    url: '/signoff',
                    templateUrl: 'app/people/signoff.html',
                    controller: 'signoffCtrl',
                    controllerAs: 'vm',
                    cache: false,
                    
                })
        }])


}())
