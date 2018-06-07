(function() {
    'use strict';

    angular.module('swiftTrack.login', ['ui.router'])
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/login/login.html',
                    controller: 'loginCtrl',
                    controllerAs: 'vm',
                    cache: false,
                    params: {
                        previousState: null
                    }
                })
        }])
}())
