(function() {
    // 'use strict';

    function headerCtrl($state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory) {

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
            event.preventDefault(); 
            event.stopPropagation();
            storageFactory.login(null);
            $cookieStore.remove('loginAuth');
            localStorage.setItem("loginAuth", false);
            localStorage.removeItem("first_name");
            localStorage.removeItem("images");
            vm.logoutpopup = false;
            $state.go('login')
        }
    }

    angular.module('swiftTrack.header')
        .controller('headerCtrl', headerCtrl);
    headerCtrl.$inject = ['$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory'];
}());
