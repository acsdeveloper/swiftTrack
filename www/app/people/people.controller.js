(function() {
    // 'use strict';

    function peopleCtrl($state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, reportService) {
        console.log('people coi=ntroller')
        var vm = this;
        vm.setProgressBarColor = function(percentage) {
            if (percentage == 100) { return "progressgreen"; }
            else if (99 >= percentage && percentage >= 36) { return "progressblue"; }
            else if (35 >= percentage && percentage >= 10) { return "progressorange"; }
            else if (9 >= percentage && percentage >= 0) { return "progressred"; }

        }
        if (!storageFactory.getuserreportid()) {
            $state.go('dashboard')
        }
        vm.assessmentdetails = function() {
            vm.reportobj = storageFactory.getuserreportid();
            console.log(vm.reportobj)
            reportService.reportpageAjax(vm.reportobj).then(function(resp) {
                console.log("assessrepes", resp);
                vm.report_response = resp;

            });
        }
        vm.assessmentdetails();

        vm.openimageModal = function(image) {

        }


        //header

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
            $cookieStore.remove('loginAupercentage');
            localStorage.setItem("loginAupercentage", false);
            localStorage.removeItem("first_name");
            localStorage.removeItem("images");
            vm.logoutpopup = false;
            $state.go('login')
        }
    }





    angular.module('swiftTrack.progressreport')
        .controller('peopleCtrl', peopleCtrl);
    peopleCtrl.$inject = ['$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory', 'reportService'];
}());
