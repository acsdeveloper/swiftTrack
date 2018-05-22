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
                vm.peoplemediadownload(resp);

            });
        }

        vm.peoplemediadownload = function(peopleresponse)
        {
            console.log("people media download ",peopleresponse);
            console.log("people media download ",peopleresponse.detailedReport);
            var reportres = peopleresponse.detailedReport;
            Object.keys(reportres).map(function(key, index) {
                Object.keys(reportres[key].modules).map(function(key1, index1) {
                Object.keys(reportres[key].modules[key1].indicators).map(function(key2, index2) {
                Object.keys(reportres[key].modules[key1].indicators[key2]).map(function(key3, index3) {
                if(key3 == 'media' || key3 == 'pdf'){
                Object.keys(reportres[key].modules[key1].indicators[key2][key3]).map(function(key4, index4) {
                // console.log('tttt'+key4+index4);
                console.log('tttt'+reportres[key].modules[key1].indicators[key2][key3][key4].media_url);
                });}
                });
                });
                });
                });
                var uri ="https://swifttrack-agilexcyber.c9users.io/orgs/foo-3094kf304fk30kafskjfk3493ja0324r/media/quote (6).jpg";
                var name = "quote (6).jpg";
                downloadImage(uri,name);
            // "https://swifttrack-agilexcyber.c9users.io/orgs/foo-3094kf304fk30kafskjfk3493ja0324r/media"
            // angular.forEach(peopleresponse.detailedReport, function(key, value) {
            //     console.log(key + ': ' + value);
            //   });
        }


        function downloadImage(uri,name){
            console.log("people download");
               
            var ft = new FileTransfer();
            var targetPath = cordova.file.externalRootDirectory +"Uploadfolder/" + name;
            vm.videolocallocation = targetPath;
            ft.download(
                uri,
                targetPath,
                function(entry) {
                    
                    console.log(entry);
                    console.log("download complete: " + entry.fullPath);
    
                },
                function(error) {
                    console.log("error");
                    console.log(error);
                    console.log("download error" + error.code);
                }
            );
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
