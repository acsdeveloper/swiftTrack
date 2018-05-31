(function() {
    // 'use strict';
    function assessmentCtrl(Constants,pdf,$sce,$state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, ModuleService,$filter) {
        console.log("after ctrl");
        var vm = this;
         
        vm.localUrl=cordova.file.externalApplicationStorageDirectory +'files/';
        vm.popupdata = null;
        vm.showupdatbtn=false;
        vm.updatebtn=false;
        vm.deleteEvArr = new Array();
        if (!storageFactory.getJobAndMod()) { 
            $state.go('dashboard')
        }
        vm.assessmentdetails = function() {
            ModuleService.LocaldatadetailsPouch().then(function(response){
                vm.localdatadetails=response;
                vm.jobroleandmod = storageFactory.getJobAndMod();
            vm.currentUser=vm.localdatadetails.username;
            ModuleService.ModuledetailsPouch(vm.jobroleandmod).then(function(resp) {
                console.log(resp,"assessment controller response");
                vm.assessmentdetail_response = resp;
            });
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
            // else {
            //     vm.userImageUrl = vm.localdatadetails.images;
            // }
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
                   console.log(assesskey,personid,document.querySelector('[data-attribute-value="person_'+assesskey+'_'+personid+'"]'))
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
                    console.log(assesskey,personid,document.querySelector('[data-attribute-value="person_'+assesskey+'_'+personid+'"]'))
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
            //save functionality
            var personIDsArr = new Array();
            var indicatorIDsArr = new Array();
            var levelsArr = new Array();
            var evCamArr = new Array();
            var evPDFArr = new Array();
            var evNoteArr = new Array();
            var evQuesArr = new Array();
            $('.person-panel').each(function(){
                var panelID = $(this).attr('id');
                var personID = $(this).attr('data-newid');

                $('#'+panelID+" .panel-row").each(function(){
                    var indID = $(this).attr('data-id');
                    var levelSet = $(this).attr('data-level-set');
                    var evCamStr = ($(this).find('.ev-cam').attr('data-ev')).replace(/\,/g, '_*_');
                    var evPDFStr = ($(this).find('.ev-pdf').attr('data-ev')).replace(/\,/g, '_*_');
                    var evNoteStr = $(this).find('.ev-notes').attr('data-ev');
                    var evQuesStr = $(this).find('.ev-question').attr('data-ev');

                    personIDsArr.push(personID);
                    indicatorIDsArr.push(indID);
                    levelsArr.push(levelSet);
                    evCamArr.push(evCamStr);
                    evPDFArr.push(evPDFStr);
                    evNoteArr.push(evNoteStr);
                    evQuesArr.push(evQuesStr);
                })
            })
            var personIDs = personIDsArr+"";
            var indIDs = indicatorIDsArr+"";
            var levels = levelsArr+"";
            var camStr = evCamArr+"";
            var pdfStr = evPDFArr+"";
            var noteStr = evNoteArr+"";
            var quesStr = evQuesArr+"";
            var deleteEvStr = vm.deleteEvArr+"";
            //

            var objSave = {	person_ids:personIDs,
                ind_ids:indIDs,
                levels:levels,
                cams:camStr,
                pdfs:pdfStr,
                notes:noteStr,
                ques:quesStr,
                del:deleteEvStr};
                console.log(objSave,"objsave")
            $state.go('dashboard')
        }
        vm.cancel_savesession = function() {
            vm.assessoksavepopup = false;
            angular.element('.assessment-page header #saveSession').css('color', 'rgb(229, 229, 229)');
        }


        vm.assess_popupfun = function(key,assessdetails,$event) {
            vm.popupdata = key;
            if (key.ind_is_q) {
                    vm.questpanelicon=true;
                    vm.bdycampanel = false;
                    vm.bdypdfpanel = false;
                    vm.bdynotespanel = false;
                    vm.bdyquestpanel = true;
                    vm.assessmentpopup = true;
            }
            else {
                    vm.questpanelicon=false;
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
            vm.datapath=datapath;
            console.log("***********datapath",datapath);
            var datacam=angular.element('[data-attribute-value="'+datapath+'"] .ev-cam')[0].attributes['data-ev'].value;
            console.log("datacam---");
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
           console.log(finalarrquestion,"finalArr")
           vm.galleryquestionArr=finalarrquestion;

           vm.finalarrcamEv_id=finalarrcamEv_id;
           vm.finalarrpdfEv_id=finalarrpdfEv_id;
           vm.finalarrnotesEv_id=finalarrnotesEv_id;
           vm.finalarrquestionEv_id=finalarrquestionEv_id;

           vm.finalarrcamAuth=finalarrcamAuth;
           vm.finalarrpdfAuth=finalarrpdfAuth;
           vm.finalarrnotesAuth=finalarrnotesAuth;
           vm.finalarrquestionAuth=finalarrquestionAuth;
           
            
        console.log(" vm.datapath", vm.datapath);
        console.log(" vm.gallerycamArr", vm.gallerycamArr);
        console.log("vm.gallerypdfArr",vm.gallerypdfArr);
        console.log(" vm.finalarrcamEv_id", vm.finalarrcamEv_id);
        console.log("vm.finalarrcamAuth",vm.finalarrcamAuth);    

        }
        vm.showupdatebtn = function(){
            vm.showupdatbtn=true;
        }
        vm.editquestions = function(value,$event){
            console.log(value,document.getElementsByClassName('q-answer'))
            vm.changemodel=value;
            // document.getElementsByClassName('q-answer')[0].value=value;
        }
        vm.updateques = function(){
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-ev'].value=vm.changemodel
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-auth'].value=vm.currentUser
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question').removeClass("hidden");
            vm.galleryquestionArr=vm.changemodel.split('_*_');
            vm.finalarrquestionAuth=vm.currentUser.split('_*_')
            vm.showupdatbtn=false;
            vm.changemodel='';

        }

        //for notes
        vm.change_notes = function(){
            vm.updatebtn=true;
        }
        vm.editnotes = function(value,$event){
            console.log(value,document.getElementsByClassName('q-answer'))
            vm.changemodel=value;
            // document.getElementsByClassName('q-answer')[0].value=value;
        }
        vm.addnotes = function(){
            var val=angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev'].value
           if(vm.change_note!=''){
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev'].value=val+'_*_'+vm.change_note
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-auth'].value+='_*_'+vm.currentUser
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes').removeClass("hidden");
            vm.gallerynotesArr.push(vm.change_note);
            vm.finalarrnotesAuth.push(vm.currentUser);
            vm.updatebtn=false;
            vm.change_note='';
           }
            

        }

        vm.assesspopclose = function() {
            vm.assessmentpopup = false;
            vm.bdycampanel = false;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = false; 
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


        vm.evidenceupload = function(datatype) {
            
            fileChooser.open(
                function fcSuccess(file){
                    vm.filename=file.name;
                    vm.movefile(file.uri,file.name,file.mime_type,datatype);
                    },
                  function fcError(e){console.log(e);}
           );   
           
            }
            vm.movefile=function(uri,name,ftype,datatype){
                var filename;
                
                var type=name.split('.')[name.split('.').length-1];
                console.log(datatype,type,name)
                if(type=='pdf'){filename='pdf'};
                if(type=='jpg' || type=='jpeg' || type=='mp4' || type=='avi' || type=='png' ||type=='svg'||type=='gif'||type=='flv' || type=='wmv' || type=='mov' ||type=='mkv'){
                    filename='cam';
                }
                console.log(datatype,type,name,filename)
                if(filename!=datatype){

                    alert('error file type');
                    return;
                }
               
                var ft = new FileTransfer();
                var targetPath = cordova.file.externalApplicationStorageDirectory +"files/" + name;
                vm.videolocallocation = targetPath;
                ft.download(uri,targetPath,downloadsuccess,downloadfailed)
                    function downloadsuccess(entry) {

                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'')[0].attributes['data-ev'].value+=','+name
                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'')[0].attributes['data-auth'].value+=','+vm.currentUser;
                       if(datatype='cam'){
                        vm.gallerycamArr.push(name);
                        vm.finalarrcamEv_id.push('new')
                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'').removeClass("hidden");
                       }
                       else{
                        vm.finalarrpdfAuth.push(vm.currentUser);
                        vm.gallerypdfArr.push(name);
                        vm.finalarrpdfEv_id.push('new')
                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'').removeClass("hidden");
                       }
                        // vm.galleryquestionArr=vm.changemodel.split('_*_');
                        // vm.finalarrquestionAuth=vm.currentUser.split('_*_')


                        $scope.$apply(function () {
                            console.log("file type ..----------------.",typeof ftype);
                            console.log("file type ..-----###--------.",ftype);
                            vm.playvideo = true;
                            vm.filetype = ftype;
                        });
                        
                
                
                    }
                    function downloadfailed(error){
                        console.log(error,error.code)
                    }
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
    
                    var encodeuri="https://swifttrack-agilexcyber.c9users.io/swiftMobile/api/uploadFiles.php";
                    console.log("encodeuri",encodeuri);
                    var ft = new FileTransfer();
                    ft.upload(targetPath, encodeURI(encodeuri),win,fail,options);
          
            // #######################################
            // ----------end-------
            
            
            
            }

        vm.assessvideoplay = function(filetype,value)
        {
            angular.element('.del-media').addClass('ng-hide');
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
        vm.iconclass = function($event)
        {
            console.log("icon class $event",$event);
        }

        vm.removeMedia = function(i,value,$event)
        {
            angular.element('.del-media').addClass('ng-hide');
            angular.element($event.target).parent().children('.del-media').removeClass('ng-hide');
            console.log("media remove function i",i);
            console.log("media remove function value",value);
            console.log("media remove function event",$event);
        
        }
        vm.deleteconf = function(type,i,value,$event)
        {
            console.log(type,i,value,$event,"type-----");
            console.log("vm.gallerynotesArr",vm.gallerynotesArr);
            angular.element('.del-media').addClass('ng-hide');

            if(type == 'cam'){
           
              console.log(vm.gallerycamArr,"test1")
               vm.gallerycamArr.splice(i,1);
               console.log("delete agllery array length", vm.gallerycamArr.length);
              if(vm.gallerycamArr.length == 0){
                 angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-cam').addClass('hidden');
              }
               console.log(vm.gallerycamArr,"test2")
               vm.finalarrcamEv_id.splice(i,1);
               angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-cam')[0].attributes['data-ev'].value=vm.gallerycamArr.join(',')
               angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-cam')[0].attributes['data-ev-ids'].value = vm.finalarrcamEv_id.join(',')
               //    vm.finalarrcamAuth.splice(i,1);
               

            }
            else if(type == 'pdf'){
                console.log("its pdf ");
                vm.gallerypdfArr.splice(i,1);
                vm.finalarrpdfEv_id.splice(i,1);
                if(vm.gallerypdfArr.length == 0){
                    angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-pdf').addClass('hidden');
                 }
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-pdf')[0].attributes['data-ev'].value = vm.gallerypdfArr.join(',')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-pdf')[0].attributes['data-ev-ids'].value = vm.finalarrpdfEv_id.join(',')
                // vm.finalarrpdfAuth.splice(i,1);


            }
            else if(type == 'notes'){
                vm.gallerynotesArr.splice(i,1);
                vm.finalarrnotesEv_id.splice(i,1);
                vm.finalarrnotesAuth.splice(i,1);
                if(vm.gallerynotesArr.length == 0){
                    angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes').addClass('hidden');
                 }
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev'].value = vm.gallerynotesArr.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev-ids'].value =  vm.finalarrnotesEv_id.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-auth'].value =  vm.finalarrnotesAuth.join('_*_')
                console.log("its notes");




            }
            else if(type == 'question'){
                vm.galleryquestionArr.splice(i,1);
                vm.finalarrquestionEv_id.splice(i,1);
                vm.finalarrquestionAuth.splice(i,1);
                if(vm.galleryquestionArr.length == 0){
                    angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question').addClass('hidden');
                 }
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-ev'].value = vm.galleryquestionArr.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-ev-ids'].value = vm.finalarrquestionEv_id.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-auth'].value = vm.finalarrquestionAuth.join('_*_')
            }


            angular.element('.del-media').addClass('ng-hide');
            



            console.log("delete confirm",$event);
            console.log("delete confirm index",i);
            console.log("delete confirm value",value);


        }
        vm.cancelconf = function($event)
        {
            angular.element($event.target).parent().addClass('ng-hide');
            console.log("cancel confirm",$event);
        }



        vm.resourcevideosectionclose = function($event)
        {
            // console.log(" resourcevideosectionclose id",id);
         
                var srcele = $event.target.parentElement.nextElementSibling.children[1].children[0].children[0];
            video = angular.element(srcele);
           console.log("video function",video,"src",srcele.tagName);
            if(srcele.tagName == 'VIDEO'){video[0].pause();}

            
            
            vm.assessreport = false;

        }
        
        // vm.pdfevidence = function()
        // {
        //     console.log("pdf evidence");
        //     fileChooser.open(
        //         function fcSuccess(file){
        //             vm.filename=file.name;
        //             console.log("file uri",file.uri,"file name",file.name,"file type",file.mime_type);
        //             downloadPdf(file.uri,file.name,file.mime_type);
        //             },
        //           function fcError(e){console.log(e);}
        //    );


        //    function downloadPdf(uri,name,ftype){
           
        //     var ft = new FileTransfer();
        //     var targetPath = cordova.file.externalRootDirectory +"Uploadfolder/" + name;

        //     console.log(" *****targetPath",targetPath);
        //     vm.pdflocallocation = targetPath;
        //     ft.download(
        //         uri,
        //         targetPath,
        //         function(entry) {

        //             $scope.$apply(function () {
        //                 console.log("file type ...",ftype);
        //                 vm.pdficon = true;
        //             });
                    
        //             console.log(entry);
        //             console.log("download complete: " + entry.fullPath);
    
        //         },
        //         function(error) {
        //             console.log("error");
        //             console.log(error);
        //             console.log("download error" + error.code);
        //         }
        //     );
            

        
        
        // }





        // }

        vm.pdfopen =function(url,datatype)
        {
            console.log("pdf open function...........---");
            vm.assesspdfpopup = true;
            // vm.reportvideoimagepdfpopup = true;
            vm.data_type = datatype;
            
            vm.targetPath = cordova.file.externalApplicationStorageDirectory +"files/"+url.substring(url.lastIndexOf('/')+1)
            
        
     
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
