(function() {
    // 'use strict';

    function peopleCtrl(SyncService,$state, $ionicModal, $scope,pdf, $http, $location, $cookieStore, storageFactory, reportService,$filter) {
        //console.log('people coi=ntroller')
        var vm = this;

        vm.setProgressBarColor = function(percentage) {
            if (percentage == 100) { return "progressgreen"; }
            else if (99 >= percentage && percentage >= 36) { return "progressblue"; }
            else if (35 >= percentage && percentage >= 10) { return "progressorange"; }
            else if (9 >= percentage && percentage >= 0) { return "progressred"; }

        }

        vm.init = function()
        {
            reportService.get_org_config_report().then(function(resp){
                console.log("####@@@@ dashboard123 ",resp);
                vm.logourlreport =   resp.logo;
                console.log("vm.logourlassess",vm.logourlassess);
            })

            reportService.get_org_name_report().then(function(resp){
                vm.org_name =   resp;
            })

        }
        vm.init();
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
            vm.exitapp = $scope.exitapp ? false : true;
        }
        vm.confirmExit = function()
        {
            ionic.Platform.exitApp();
        }
        vm.cancelExit = function()
        {
            vm.exitapp = false;

        }

        // vm.cancellogout = function() {
        //     vm.logoutpopup = false;

        // }
        // vm.confirmlogout = function(event) {
        //     SyncService.logout().then(function(){
        //         $state.go('login')
        //     })
        //     event.preventDefault();
        //     event.stopPropagation();
        //     storageFactory.login(null);
        //     $cookieStore.remove('loginAupercentage');
        //     localStorage.setItem("loginAupercentage", false);
        //     // localStorage.removeItem("first_name");
        //     // localStorage.removeItem("images");
        //     vm.logoutpopup = false;
            
        // }
        
        vm.reportvideoimagepdf = function(datatype,url)
        {
            vm.data_type = datatype;
            vm.targetPath = cordova.file.externalApplicationStorageDirectory +"files/"+url.substring(url.lastIndexOf('/')+1)
            if(datatype == 'movie')
            {
                var urll =  vm.targetPath;
                var options = {
                successCallback: function(){
                    console.log("Video was closed without error.");
                },
                errorCallback: function(errMsg) {
                    console.log("Error! " + errMsg);
                },
                // orientation: 'landscape',
                    orientation: 'portrait',
                    shouldAutoClose: true,  // true(default)/false
                    controls: true // true(default)/false. Used to hide controls on fullscreen
                  };
                    console.log("window.plugins.streamingMedia",window.plugins.streamingMedia);
                window.plugins.streamingMedia.playVideo(urll, options);
            }
            else{
                vm.reportvideoimagepdfpopup = true;
            }
            
            console.log("datatype",datatype,"url",url);
            
            
            // cordova.file.externalApplicationStorageDirectory +'files/'
            
            // //console.log(vm.targetPath,"88888tagettt");
        }

    vm.viewer = pdf.Instance("viewer");

	vm.nextPage = function() {
    vm.viewer.nextPage();
    if(vm.currentPage > 1){
        vm.prevpage = true; 
        }
	};

	vm.prevPage = function() {
      vm.viewer.prevPage();
	};

	vm.pageLoaded = function(curPage, totalPages) {
        vm.nextpage1 = true;
        vm.prevpage = true;
		vm.currentPage = curPage;
        vm.totalPages = totalPages;
        if(vm.currentPage == 1){
           vm.prevpage = false;
        }
        if(vm.totalPages == vm.currentPage){
            vm.nextpage1 = false;
            }
    };

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
    peopleCtrl.$inject = ['SyncService','$state', '$ionicModal', '$scope','PDFViewerService', '$http', '$location', '$cookieStore', 'storageFactory', 'reportService', '$filter'];

    

 }());
