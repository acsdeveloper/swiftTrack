(function() {
    // 'use strict karthik';
    function assessmentCtrl(pdf,$sce,$state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, ModuleService) {
        console.log("after ctrl");
        var vm = this;
        

        vm.popupdata = null;
        if (!storageFactory.getJobAndMod()) {
            $state.go('dashboard')
        }
        vm.assessmentdetails = function() {
            vm.jobroleandmod = storageFactory.getJobAndMod();
            vm.jobroleandmod['login_type'] = localStorage.getItem('login_type');
            vm.jobroleandmod['login_user'] = localStorage.getItem('fullname');
            vm.jobroleandmod['signoff_level'] = localStorage.getItem('signoff_level');

            console.log(vm.jobroleandmod)
            ModuleService.ModuledetailsAjax(vm.jobroleandmod).then(function(resp) {
                console.log(resp);
                vm.assessmentdetail_response = resp;
            });
        }
        vm.assessmentdetails();
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

        // vm.logoutclick = function() {
        //     vm.logoutpopup = $scope.logoutpopup ? false : true;
        // }
        // vm.cancellogout = function() {
        //     vm.logoutpopup = false;

        // }
        // vm.confirmlogout = function(event) {
        //     event.preventDefault();
        //     event.stopPropagation();
        //     storageFactory.login(null);
        //     $cookieStore.remove('loginAuth');
        //     localStorage.setItem("loginAuth", false);
        //     localStorage.removeItem("first_name");
        //     localStorage.removeItem("images");
        //     vm.logoutpopup = false;
        //     $state.go('login')
        // }

        vm.assess_save = function($event) {

            vm.assessoksavepopup = !vm.assessoksavepopup;
            vm.assesscancelsavepopup = false;
            $event.preventDefault();
            $event.stopPropagation();

            // angular.element('.assessment-page header #saveSession').css('color', 'rgb(71, 180, 117)');
            var okbutcol = angular.element('.assessment-page header #saveSession').css('color');

            if (okbutcol == "rgb(229, 229, 229)") {
                angular.element('.assessment-page header #saveSession').css('color', 'rgb(71, 180, 117)');
                angular.element('.assessment-page header #cancelSession').css('color', 'rgb(229, 229, 229)');

            }
            else {
                angular.element('.assessment-page header #saveSession').css('color', 'rgb(229, 229, 229)');
                angular.element('.assessment-page header #cancelSession').css('color', 'rgb(229, 229, 229)');
            }


            // console.log("aa", a);
        }

        vm.assess_cancel = function($event) {

            vm.assesscancelsavepopup = !vm.assesscancelsavepopup;
            vm.assessoksavepopup = false;
            $event.preventDefault();
            $event.stopPropagation();
            var canbutcol = angular.element('.assessment-page header #cancelSession').css('color');

            if (canbutcol == "rgb(229, 229, 229)") {
                angular.element('.assessment-page header #cancelSession').css('color', '#d54d4d');
                angular.element('.assessment-page header #saveSession').css('color', 'rgb(229, 229, 229)');

            }
            else {
                angular.element('.assessment-page header #cancelSession').css('color', 'rgb(229, 229, 229)');
                angular.element('.assessment-page header #saveSession').css('color', 'rgb(229, 229, 229)');
            }

        }
        vm.confirm_without_save = function() {
            $state.go('dashboard')

        }
        vm.cancel_without_save = function() {
            vm.assesscancelsavepopup = false;
            angular.element('.assessment-page header #cancelSession').css('color', 'rgb(229, 229, 229)');


        }
        vm.confirm_savesession = function() {
            $state.go('dashboard')
        }
        vm.cancel_savesession = function() {
            vm.assessoksavepopup = false;
            angular.element('.assessment-page header #saveSession').css('color', 'rgb(229, 229, 229)');
        }


        vm.assess_popupfun = function(key,image,name) {

                // ############ auto storage permission
                // var permissions = cordova.plugins.permissions;
                // // console.log("permission",permission);
                // permissions.hasPermission(permissions.CAMERA, function( status ){
                //     console.log("status---",status);
                //     if ( status.hasPermission ) {
                //       console.log("Yes------------- :D ");
                //     }
                //     else {
                //       console.warn("No------------ :( ");
                //     }
                //   });

        //         var permissions = cordova.plugins.permissions;
        //         vm.androidPermissions.hasPermission(vm.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        // .then(status => {
        //     console.log("storage permission------------",vm.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
        //   if (status.hasPermission) {
        //     vm.captureVideo();
        //   } else {
        //     vm.androidPermissions.requestPermission(vm.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        //     .then(status =>{
        //       if(status.hasPermission) vm.captureVideo();
        //     });
        //   }
        // })




                // End ############################

              
        
                console.log("assresp------",key);
                console.log("assimage------",image);
                console.log("assname------",name);
            vm.indicatorname=key.final_content;
            vm.userimage=image;
            vm.username=name;

                
            vm.popupdata = key;
            if (key.ind_is_q) {
                vm.bdycampanel = false;
                vm.bdypdfpanel = false;
                vm.bdynotespanel = false;
                vm.bdyquestpanel = true;
            }
            else {
                vm.bdycampanel = true;
                vm.bdypdfpanel = false;
                vm.bdynotespanel = false;
                vm.bdyquestpanel = false;
            }
            vm.assessmentpopup = true;

            console.log("keydata", key);

        }


        vm.assesspopclose = function() {
            vm.assessmentpopup = false;
        }

        vm.resourcefunct = function(value) {
            console.log("resou this value", value);
            console.log("resou name", value.resource_name);
            vm.resouobj = value;
            vm.assessreport = !vm.assessreport;
            // angular.element('body').addClass('locked-page hidden-main');
        }
        vm.bdycampanel = true;
        console.log("temp check");

        vm.assesscam = function() {
            vm.bdycampanel = true;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = false;
        }

        vm.assesspdf = function() {
            // console.log("mycam", vm.popupdata.type_ref.cam);
            // if (vm.popupdata.type_ref.pdf != undefined) {
            //     console.log("pdf okay");
            //     vm.pdffile = vm.popupdata.type_ref.pdf;
            // }

            vm.bdycampanel = false;
            vm.bdypdfpanel = true;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = false;

        }
        vm.assessnotes = function() {
            vm.bdycampanel = false;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = true;
            vm.bdyquestpanel = false;

        }
        vm.assessquest = function() {
            vm.bdycampanel = false;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = true;

        }


        vm.evidenceupload = function() {

            
        fileChooser.open(
            function fcSuccess(file){
                vm.filename=file.name;
                downloadImage(file.uri,file.name,file.mime_type);
                },
              function fcError(e){console.log(e);}
       );


        function downloadImage(uri,name,ftype){
           
            var ft = new FileTransfer();
            var targetPath = cordova.file.externalRootDirectory +"Uploadfolder/" + name;
            vm.videolocallocation = targetPath;
            ft.download(
                uri,
                targetPath,
                function(entry) {

                    $scope.$apply(function () {
                        console.log("file type ..----------------.",ftype);
                        vm.playvideo = true;
                    });
                    
                    console.log(entry);
                    console.log("download complete: " + entry.fullPath);
    
                },
                function(error) {
                    console.log("error");
                    console.log(error);
                    console.log("download error" + error.code);
                }
            );
            


            // ##########################################
                // file upload to server 


            var win = function (r) {
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
            }
            
            var fail = function (error) {
                alert("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
            }

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName =name; 
            options.mimeType = ftype;
            console.log("option obj",options);
            console.log("targetPath",targetPath);
            var params = {};
            params.value1 = "test";
            params.value2 = "param";

            options.params = params;

                var encodeuri="https://swifttrack-agilexcyber.c9users.io/ionic/fileupload.php";
                console.log("encodeuri",encodeuri);
                var ft = new FileTransfer();
                ft.upload(targetPath, encodeURI(encodeuri),win,fail,options);
      
        // #######################################
        // ----------end-------
        
        
        
        }

           
       
        }

        vm.assessvideoplay = function()
        {
            // vm.videolocallocation= "https://app.swifttrack.co.uk/orgs/wor-pf834j3894mqf348l3489d384fsfoj67/media/resources/manual-handling-8-basic-steps-to-correct-lifting-technique_1.mp4";
            console.log("assess video function");
            vm.assessvideopopup=true;
            vm.bdycampanel = false;
        }
        vm.assessvideopopupclose = function(videourl,$event)
        {
            
           
            var srcelement=$event.target.nextElementSibling.children[0];
                console.log("tttttrp", $event.target.nextElementSibling);
                console.log("child111", $event.target.nextElementSibling.children[0]);
                console.log("child222", $event.target.nextElementSibling.children[0].outerHTML);
                console.log( document.querySelectorAll('.mv-content video')[0]);
            
            video = angular.element(srcelement);
            // console.log("myvideo ",video);

            video[0].pause();
            // console.log("video url",videourl);
            // console.log("$eventrrrr",$event);
            // vm.url = videourl;  
           
            // console.log("assess video close  function");

            vm.assessvideopopup=false;
            vm.bdycampanel = true;
            
        }
        vm.resourcevideosectionclose = function($event)
        {
            var srcele = $event.target.parentElement.nextElementSibling.children[1].children[0].children[0];
            video = angular.element(srcele);
            video[0].pause();
            // console.log("resourcevideosectionclose function");
            // console.log($event);
            // console.log("parent---",$event.target);
            vm.assessreport = !vm.assessreport;

        }
        
        vm.pdfevidence = function()
        {
            console.log("pdf evidence");
            fileChooser.open(
                function fcSuccess(file){
                    vm.filename=file.name;
                    console.log("file uri",file.uri,"file name",file.name,"file type",file.mime_type);
                    downloadPdf(file.uri,file.name,file.mime_type);
                    },
                  function fcError(e){console.log(e);}
           );


           function downloadPdf(uri,name,ftype){
           
            var ft = new FileTransfer();
            var targetPath = cordova.file.externalRootDirectory +"Uploadfolder/" + name;
            vm.pdflocallocation = targetPath;
            ft.download(
                uri,
                targetPath,
                function(entry) {

                    $scope.$apply(function () {
                        console.log("file type ...",ftype);
                        vm.pdficon = true;
                    });
                    
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





        }

        vm.pdfopen =function()
        {
            console.log("pdf open function...........---");
            vm.assesspdfpopup = true;

        
       
    //     var url = "file:///storage/emulated/0/360/sample.pdf";
    //    var mimeType ="application/pdf";
    //    var options = {
    //     title: "pdf viewer",
    //     documentView : {
    //         closeLabel : "close"
    //     },
    //     navigationView : {
    //         closeLabel : "nav"
    //     },
    //     email : {
    //         enabled : true
    //     },
    //     print : {
    //         enabled : false
    //     },
    //     openWith : {
    //         enabled : true
    //     },
    //     bookmarks : {
    //         enabled : false
    //     },
    //     search : {
    //         enabled : true
    //     },
    //     autoClose: {
    //         onPause : false
    //     }
    // }
        
    //       function onShow(){
    //         window.console.log('document shown');
    //         //e.g. track document usage
    //       }
    //       function onClose(){
    //         window.console.log('document closed');
    //         //e.g. remove temp files
    //       }
    //       function onMissingApp(appId, installer){
    //         if(confirm("Do you want to install the free PDF Viewer App "
    //                 + appId + " for Android?"))
    //         {
    //             installer();
    //         }
    //     } 
    //     function onError(error){
    //         window.console.log(error);
    //         alert("Sorry! Cannot view document.");
    //     }
    
    //     cordova.plugins.SitewaertsDocumentViewer.viewDocument(url, mimeType, options, onShow, onClose, onMissingApp, onError);
    
    }



        // #################pdf
        vm.viewer = pdf.Instance("viewer");

	vm.nextPage = function() {
		vm.viewer.nextPage();
	};

	vm.prevPage = function() {
		vm.viewer.prevPage();
	};

	vm.pageLoaded = function(curPage, totalPages) {
		vm.currentPage = curPage;
		vm.totalPages = totalPages;
    };
    
    // END###############





        vm.assesspdfpopupclose = function($event){
            console.log("pdf close fun-----");
            vm.assesspdfpopup = false;
        }
        

        // var url = "file:///storage/emulated/0/360/sample.pdf";





    
    }





    angular.module('swiftTrack.assessment')
        .controller('assessmentCtrl', assessmentCtrl);
    assessmentCtrl.$inject = ['PDFViewerService','$sce','$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory', 'ModuleService'];
}());
