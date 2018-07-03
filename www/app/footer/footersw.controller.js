(function() {
    // 'use strict';

    function footerCtrl(SignoffService,$cordovaNetwork,$interval,SyncService,Loader, $timeout, $state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, dashboardService, $ionicPlatform) {
   
   vm.testclick  = function (){
       console.log("footer test calling@@@@");
   }
    }

    angular.module('swiftTrack.footer')
        .controller('footerCtrl', footerCtrl);
    footerCtrl.$inject = ['SignoffService','$cordovaNetwork','$interval','SyncService','Loader', '$timeout', '$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory', 'dashboardService', '$ionicPlatform'];
}());