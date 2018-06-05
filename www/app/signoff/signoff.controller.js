(function() {
    // 'use strict';

    function signoffCtrl($state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, reportService,$filter) {
        console.log('signoff controller')
        var vm = this;
    }

    angular.module('swiftTrack.signoffpage')
        .controller('signoffCtrl', signoffCtrl);
    peopleCtrl.$inject = ['$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory', 'reportService', '$filter'];

    

 }());