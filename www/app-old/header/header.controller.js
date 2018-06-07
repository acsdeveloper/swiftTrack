(function() {
    // 'use strict';

    function headerCtrl(SyncService,$state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory) {

        var vm = this;


        vm.init = function (){
            vm.logoutpopup = false;
            
        }
        vm.headerimagefunction = function() {
            if (vm.userdetails !== undefined && vm.userdetails !== null) {
                vm.userImageUrl = vm.userdetails.images;
                console.log(vm.userImageUrl);
                vm.userFirstName = vm.userdetails.first_name;
            }
            else {
                vm.userImageUrl = localStorage.getItem("images");
            }
        }
        $scope.$watch(
            function($scope) {
                vm.userdetails = storageFactory.getuserdetails();
                vm.headerimagefunction();
            });

        vm.logoutclick = function() {
            vm.logoutpopup = $scope.logoutpopup ? false : true;
        }
        vm.cancellogout = function() {
            vm.logoutpopup = false;

        }
        vm.confirmlogout = function(event) {
            SyncService.logout().then(function(){
                $state.go('login')
            })
            event.preventDefault(); 
            event.stopPropagation();
            storageFactory.login(null);
            $cookieStore.remove('loginAuth');
            localStorage.setItem("loginAuth", false);
            localStorage.removeItem("first_name");
            localStorage.removeItem("images");
            vm.logoutpopup = false;
           
        }
    }

    angular.module('swiftTrack.header')
        .controller('headerCtrl', headerCtrl);
    headerCtrl.$inject = ['SyncService','$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory'];
}());
