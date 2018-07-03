(function() {
    'use strict';

    angular.module('swiftTrack.footer', ['ui.router'])
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider
            .state('footer', {
                url: '/footer',
                templateUrl: 'app/dashboard/footer.html',
                controller: 'footerCtrl',
                controllerAs: 'vm',
                cache: false,
                
            })
              
        }])


}())