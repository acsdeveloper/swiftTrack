(function() {
    // 'use strict';

    function peopleCtrl(SyncService,$state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, reportService,$filter) {
        //console.log('people coi=ntroller')
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
            reportService.LocaldatadetailsPouch().then(function(response){
                vm.localdatadetails=response;
                vm.reportobj = storageFactory.getuserreportid();
                cordova.file.externalApplicationStorageDirectory +'files/'
                // vm.targetPath = cordova.file.externalRootDirectory +"Uploadfolder";
                //console.log(vm.reportobj)
                reportService.ReportdetailsPouch(vm.reportobj).then(function(resp) {
                    //console.log("assessrepes", resp);
                    vm.report_response = resp;
    
                });
            })
           
        }
        vm.assessmentdetails();
        vm.openimageModal = function(image) {
                }
        //header

        vm.headerimagefunction = function() {
            if (vm.userdetails !== undefined && vm.userdetails !== null) {
                vm.userImageUrl = vm.userdetails.images;
                //console.log(vm.userImageUrl);
                vm.userFirstName = vm.userdetails.first_name;
            }
            // else {
            //     vm.userImageUrl = vm.localdatadetails.images;
            // }
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
            $cookieStore.remove('loginAupercentage');
            localStorage.setItem("loginAupercentage", false);
            // localStorage.removeItem("first_name");
            // localStorage.removeItem("images");
            vm.logoutpopup = false;
            
        }
        
        vm.reportvideoimagepdf = function(datatype,url)
        {
            //console.log("datatype",datatype,"url",url);
            vm.reportvideoimagepdfpopup = true;
            vm.data_type = datatype;
            // cordova.file.externalApplicationStorageDirectory +'files/'
            vm.targetPath = cordova.file.externalApplicationStorageDirectory +"files/"+url.substring(url.lastIndexOf('/')+1)
            // //console.log(vm.targetPath,"88888tagettt");
        }
        vm.reportmediaclose = function(path,$event)
        {
            var srcelement=$event.target.nextElementSibling.children[0];
            vm.reportvideoimagepdfpopup =false;
            if(path.substring(path.lastIndexOf('.')+1) == 'mp4'){
                video = angular.element(srcelement);
                video[0].pause();
            }
            //console.log("%%%%%%%%%%%%%%path",path);
            //console.log("report media event",event);
            //console.log("%%%%%%%%%%%%%%srcelement",srcelement);
            // //console.log("report media event",event.substring(event.lastIndexOf('.')+1));
        }
   
    
    
    }
    

    angular.module('swiftTrack.progressreport')
        .controller('peopleCtrl', peopleCtrl);
    peopleCtrl.$inject = ['SyncService','$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory', 'reportService', '$filter'];

    

 }());
