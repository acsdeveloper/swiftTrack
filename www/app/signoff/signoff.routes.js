<<<<<<< HEAD
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
=======
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
>>>>>>> 7a559af5b185d2df101df4afb5706d26a15085c8
