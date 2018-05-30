(function() {
    // 'use strict';
    function assessmentCtrl(Constants,pdf,$sce,$state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, ModuleService,$filter) {
        console.log("after ctrl");
        var vm = this;
         
        vm.localUrl=cordova.file.externalRootDirectory +'Uploadfolder/';
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
            ModuleService.ModuledetailsPouch(vm.jobroleandmod).then(function(resp) {
                console.log(resp,"assessment controller response");
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
        vm.changelocalurl = function(url,type){
             if(type=='image'){return vm.localUrl+url.split('/')[url.split('/').length-1];}
             if(type=='movie'){return './img/icon-movie.jpg'}
        }
        vm.findfiletype = function(url){
            var fileName=(vm.localUrl+url.split('/')[url.split('/').length-1]);
                var ft = "";
                if(fileName.indexOf(".MOV") > 0 || fileName.indexOf(".mov") > 0 || fileName.indexOf(".m4v") > 0 || fileName.indexOf(".M4V") > 0 || fileName.indexOf(".mp4") > 0 || fileName.indexOf(".MP4") > 0 )
                {
                    ft = "movie";
                }
                else if(fileName.indexOf(".pdf") > 0 || fileName.indexOf(".pdf") > 0 )
                {
                    ft = "pdf";
                }
                else {
                    ft = "image";
                }
                return ft;
            
            
        }
        $scope.$watch(
            function($scope) {
                vm.userdetails = storageFactory.getuserdetails();
                vm.headerimagefunction();
            });

            vm.setlevel = function (value){
                var returnvalue= 0;
                Object.keys(value.levels).map(function(key, index) {
                    if(value.levels[key].level_achieved==true){
                        returnvalue= key;
                    }
                 });
                 return returnvalue;
            }
            vm.setdatalevel = function(level,personid,assesskey,$event){
	            var thisLevel = parseInt(level);
                if(angular.element($event.target).hasClass('unchecked')){
                    angular.forEach(angular.element('[data-attribute-value="person_'+assesskey+'_'+personid+'"] .btn-check'), function(value, key){
                        var chkLevel = parseInt(value.attributes['data-level'].value);
                        if(chkLevel <= thisLevel)
                        {
                            angular.element(value).removeClass('unchecked');
                        } else  {
                            angular.element(value).addClass('unchecked');
                        }
                   });
                    document.querySelector('[data-attribute-value="person_'+assesskey+'_'+personid+'"]').setAttribute("data-level-set", level)
                }
                else{
                    angular.forEach(angular.element('[data-attribute-value="person_'+assesskey+'_'+personid+'"] .btn-check'), function(value, key){
                        var chkLevel = parseInt(value.attributes['data-level'].value);
                        if(chkLevel >= thisLevel)
                        {
                            angular.element(value).addClass('unchecked');
                        } else  {
                            angular.element(value).removeClass('unchecked');
                        }
                    })
                    document.querySelector('[data-attribute-value="person_'+assesskey+'_'+personid+'"]').setAttribute("data-level-set", parseInt(level)-1)

                }
                
            }
            // vm.getRandomstr = function(){
            //     // return Math.random().toString(36).substring(1);
            //     var text = "";
            //     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            //     for (var i = 0; i < 10; i++)
            //     text += possible.charAt(Math.floor(Math.random() * possible.length));
            //     console.log(text)
            //     return text;
            // }
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


        vm.assess_popupfun = function(key,assessdetails,$event) {
            vm.popupdata = key;
            if (key.ind_is_q) {
                    vm.bdycampanel = false;
                    vm.bdypdfpanel = false;
                    vm.bdynotespanel = false;
                    vm.bdyquestpanel = true;
                    vm.assessmentpopup = true;
            }
            else {
                    vm.bdycampanel = true;
                    vm.bdypdfpanel = false;
                    vm.bdynotespanel = false;
                    vm.bdyquestpanel = false;
                    vm.assessmentpopup = true;
            }
            
            vm.indicatorname=key.final_content;
            vm.userimage=assessdetails.image;
            vm.username=assessdetails.name;
            console.log(angular.element($event.target).closest('.panel-row')[0].attributes['data-attribute-value'].value)
            var datapath=angular.element($event.target).closest('.panel-row')[0].attributes['data-attribute-value'].value;
            
            var datacam=angular.element('[data-attribute-value="'+datapath+'"] .ev-cam')[0].attributes['data-ev'].value
            var datapdf=angular.element('[data-attribute-value="'+datapath+'"] .ev-pdf')[0].attributes['data-ev'].value
            var datanotes=angular.element('[data-attribute-value="'+datapath+'"] .ev-notes')[0].attributes['data-ev'].value
            var dataques=angular.element('[data-attribute-value="'+datapath+'"] .ev-question')[0].attributes['data-ev'].value
            
            var datacamAuth=angular.element('[data-attribute-value="'+datapath+'"] .ev-cam')[0].attributes['data-auth'].value
            var datapdfAuth=angular.element('[data-attribute-value="'+datapath+'"] .ev-pdf')[0].attributes['data-auth'].value
            var datanotesAuth=angular.element('[data-attribute-value="'+datapath+'"] .ev-notes')[0].attributes['data-auth'].value
            var dataquesAuth=angular.element('[data-attribute-value="'+datapath+'"] .ev-question')[0].attributes['data-auth'].value
            
            var datacamEv_id=angular.element('[data-attribute-value="'+datapath+'"] .ev-cam')[0].attributes['data-ev-ids'].value
            var datapdfEv_id=angular.element('[data-attribute-value="'+datapath+'"] .ev-pdf')[0].attributes['data-ev-ids'].value
            var datanotesEv_id=angular.element('[data-attribute-value="'+datapath+'"] .ev-notes')[0].attributes['data-ev-ids'].value
            var dataquesEv_id=angular.element('[data-attribute-value="'+datapath+'"] .ev-question')[0].attributes['data-ev-ids'].value
            

           var finalarrcamAuth =datacamAuth.split(',')[0]==''?[]:datacamAuth.split(',');
           var finalarrpdfAuth =datapdfAuth.split(',')[0]==''?[]:datapdfAuth.split(',');
           var finalarrnotesAuth =datanotesAuth.split('_*_')[0]==''?[]:datanotesAuth.split('_*_');
           var finalarrquestionAuth =dataquesAuth.split('_*_')[0]==''?[]:dataquesAuth.split('_*_');

           var finalarrcamEv_id =datacamEv_id.split(',')[0]==''?[]:datacamEv_id.split(',');
           var finalarrpdfEv_id =datapdfEv_id.split(',')[0]==''?[]:datapdfEv_id.split(',');
           var finalarrnotesEv_id =datanotesEv_id.split('_*_')[0]==''?[]:datanotesEv_id.split('_*_');
           var finalarrquestionEv_id =dataquesEv_id.split('_*_')[0]==''?[]:dataquesEv_id.split('_*_');

           var finalarrcam =datacam.split(',')[0]==''?[]:datacam.split(',');
           var finalarrpdf =datapdf.split(',')[0]==''?[]:datapdf.split(',');
           var finalarrnotes =datanotes.split('_*_')[0]==''?[]:datanotes.split('_*_');
           var finalarrquestion =dataques.split('_*_')[0]==''?[]:dataques.split('_*_');

           vm.gallerycamArr=finalarrcam;
           vm.gallerypdfArr=finalarrpdf;
           vm.gallerynotesArr=finalarrnotes;
           vm.galleryquestionArr=finalarrquestion;
           
            
            console.log(vm.gallerycamArr,finalarrcam)
            

        }


        vm.assesspopclose = function() {
            vm.assessmentpopup = false;
            vm.bdycampanel = false;
                    vm.bdypdfpanel = false;
                    vm.bdynotespanel = false;
                    vm.bdyquestpanel = false;
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
        // vm.videolocallocation='tempurl/filenname'
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

            console.log("****file chooser");
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
                            console.log("file type ..----------------.",typeof ftype);
                            console.log("file type ..-----###--------.",ftype);
                            vm.playvideo = true;
                            vm.filetype = ftype;
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

        vm.assessvideoplay = function(filetype,value)
        {
            vm.videolocallocation = value;
            console.log("assess video function");
            console.log("assess filetype",filetype);
            console.log("assess value",value);
            if(filetype == "movie"){
                vm.assessvideopopup=true;
            }
            else if(filetype == "image"){
                vm.assessimagepopup=true;
               }
            vm.bdycampanel = false;
        }
        vm.assessvideopopupclose = function(videourl,$event)
        {
            
           
            var srcelement=$event.target.nextElementSibling.children[0];

            video = angular.element(srcelement);
            video[0].pause();
            vm.assessvideopopup=false;
            vm.bdycampanel = true;
            
        }
        vm.resourcevideosectionclose = function($event)
        {
            var srcele = $event.target.parentElement.nextElementSibling.children[1].children[0].children[0];
            video = angular.element(srcele);
            video[0].pause();
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

            console.log(" *****targetPath",targetPath);
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

        vm.myFunc12 = function()
        {
            console.log("testing-------");
            console.log("myValue",vm.myValue);
            if(vm.myValue == ""){
                console.log("nullll");
                vm.updatebtn=false;

                
            }else{vm.updatebtn=true;}
        }

        vm.updateok = function(){
            console.log("update ok....");
            var a = vm.myValue;
            vm.upVal = a;
            vm.myValue = "";
            vm.noterow =true;
            vm.delnotemedia=false;
        }



    
    }





    angular.module('swiftTrack.assessment')
        .controller('assessmentCtrl', assessmentCtrl);
    assessmentCtrl.$inject = ['Constants','PDFViewerService','$sce','$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory', 'ModuleService','$filter'];
}());
