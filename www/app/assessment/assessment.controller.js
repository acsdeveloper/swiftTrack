(function() {
    // 'use strict';
    function assessmentCtrl(Loader,$ionicPopup,NetworkInformation,Constants,pdf,$sce,$state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, ModuleService,$filter, $rootScope, $cordovaCapture) {
        var vm = this;
        vm.localfilemediaarray =[];
        vm.localDB = new PouchDB("Swifttrack", {
            revs_limit: 2
        });
        vm.init = function()
        {
            // Get dynamic logo,organization name and pouch directory name from assessment service
            ModuleService.get_org_config_assess().then(function(resp){
                vm.logourlassess =   resp.logo;
                vm.directoryname  = resp.dir;
            })
            ModuleService.get_org_name_access().then(function(res){
                vm.org_name = res;
            })
        }

        vm.init();

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
                vm.assessmentdetail_response = resp;
            ModuleService.ReportdetailsPouch(vm.jobroleandmod).then(function(resp1) {
                vm.reportdetail_response = resp1;
                });
            });
            });
        }
        vm.assessmentdetails();// Get assessment data from pouchdb

        vm.headerimagefunction = function() { 
            if (vm.userdetails !== undefined && vm.userdetails !== null) {
                vm.userImageUrl = vm.userdetails.images;
                vm.userFirstName = vm.userdetails.first_name;
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
                        if(chkLevel <= thisLevel){
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
            

        vm.assess_save = function($event) {
            vm.assessoksavepopup = !vm.assessoksavepopup;
            vm.assesscancelsavepopup = false;
            $event.preventDefault();
            $event.stopPropagation();
            var okbutcol = angular.element('.assessment-page header #saveSession').css('color');

            if (okbutcol == "rgb(229, 229, 229)") {
                angular.element('.assessment-page header #saveSession').css('color', 'rgb(71, 180, 117)');
                angular.element('.assessment-page header #cancelSession').css('color', 'rgb(229, 229, 229)');

            }
            else {
                angular.element('.assessment-page header #saveSession').css('color', 'rgb(229, 229, 229)');
                angular.element('.assessment-page header #cancelSession').css('color', 'rgb(229, 229, 229)');
                }
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
        
        vm.confirm_without_save = function(){
            vm.withoutsave = true;
            angular.element('.assessment-page header #cancelSession').css('color', 'rgb(229, 229, 229)');
            vm.assesscancelsavepopup =false;
            // $state.go('dashboard')
        }

        vm.retdashboard = function(){
            vm.withoutsave = false;
            $state.go('dashboard')
        }

        vm.contsection = function(){
            vm.withoutsave = false;
        }

        vm.cancel_without_save = function() {
            vm.assesscancelsavepopup = false;
            angular.element('.assessment-page header #cancelSession').css('color', 'rgb(229, 229, 229)');
        }
        
        vm.isEmpty = function(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }

        vm.putDataPouchDetailedDoc = function(data,doc_name){
            return new Promise(function(resolve, reject) {
                // Do async job
                function detailedDocfunc(doc) {
                    doc['assessment'][vm.jobroleandmod.jr_id][vm.jobroleandmod.m_id].people = data;
                    return doc;
                }

                vm.localDB.upsert(doc_name, detailedDocfunc).then(function() {
                    resolve('success')
                }).catch(function(err) {
                    reject(err)
                });
            })
        }
        vm.saveuploadpouch = function(data,doc_name){
            return new Promise(function(resolve, reject) {
                // Do async job
                function detailedDocfunc(doc) {
                    if(doc.val){
                        data.map(function(v){
                                doc.val.push(v)
                        })
                    }else{
                        doc.value = data;
                    }
                    return doc;
                }

                vm.localDB.upsert(doc_name, detailedDocfunc).then(function() {
                    resolve('success')
                }).catch(function(err) {
                    reject(err)
                });
            })

        }

        vm.confirm_savesession = function(){
            vm.savefunction().then(function(){
                vm.saveuploadpouch(vm.localfilemediaarray,'saveuploadfiles').then(function() {   
                if(NetworkInformation.isOnline()==true){
                    vm.assessoksavepopup = false;
                    vm.withsaveloader = true;
                    ModuleService.saveAPIOnline().then(function(res){
                        vm.localfilemediaarray.map(function(a){
                           vm.filetoserver(a);
                        });
                        ModuleService.fetchfulldata().then(function(){
                            vm.withsaveloader = false;
                            vm.withsave = true;
                            angular.element('.assessment-page header #saveSession').css('color', 'rgb(229, 229, 229)');
                        })
                    })
                }
                else{
                    
                    $scope.$apply(function() {
                        vm.withsaveoff = true;
                    })
                    $cookieStore.put("ChangesBoolean", true);
                }
            })
            })
        }

        $rootScope.$on("ASSESSMENT_BACK_PRESS", function () {
            
            $scope.$apply(function() {
            
                vm.withoutsave = true;
            })
            
        })

        vm.withsave_godashboard = function()
        {
            vm.withsaveoff = false;
            vm.withsave = false;
            $state.go('dashboard');
            

        }
        vm.savefunction = function() {
            return new Promise(function(resolve, reject) {
            
            var personIDsArr = new Array();
            var indicatorIDsArr = new Array();
            var levelsArr = new Array();
            var evCamArr = new Array();
            var evPDFArr = new Array();
            var evNoteArr = new Array();
            var evQuesArr = new Array();
            var camevid= new Array();
            var pdfevid= new Array();
            var notesevid= new Array();
            var quesevid=new Array();
            var camauth = new Array();
            var pdfauth = new Array();
            var notesauth = new Array();
            var quesauth = new Array();

            $('.person-panel').each(function(){
                var panelID = $(this).attr('id');
                var personID = $(this).attr('data-newid');

                $('#'+panelID+" .panel-row").each(function(){
                    var indID = $(this).attr('data-id');
                    var levelSet = $(this).attr('data-level-set');

                    var evCamStr = ($(this).find('.ev-cam').attr('data-ev')).replace(/\,/g, '_*_');
                    var evCamidStr = ($(this).find('.ev-cam').attr('data-ev-ids'))
                    var evCamauthStr = ($(this).find('.ev-cam').attr('data-auth'))

                    var evPDFStr = ($(this).find('.ev-pdf').attr('data-ev')).replace(/\,/g, '_*_');
                    var evPDFidStr = ($(this).find('.ev-pdf').attr('data-ev-ids'))
                    var evPDFauthStr = ($(this).find('.ev-pdf').attr('data-auth'))

                    var evNoteStr = $(this).find('.ev-notes').attr('data-ev');
                    var evNoteidStr = $(this).find('.ev-notes').attr('data-ev-ids');
                    var evNoteauthStr = $(this).find('.ev-notes').attr('data-auth');

                    var evQuesStr = $(this).find('.ev-question').attr('data-ev');
                    var evQuesAuthStr = $(this).find('.ev-question').attr('data-auth');
                    var evQuesidStr = $(this).find('.ev-question').attr('data-ev-ids');
                    
                    camevid.push(evCamidStr);
                    pdfevid.push(evPDFidStr);
                    notesevid.push(evNoteidStr);
                    quesevid.push(evQuesidStr);

                    camauth.push(evCamauthStr);
                    pdfauth.push(evPDFauthStr);
                    notesauth.push(evNoteauthStr);
                    quesauth.push(evQuesAuthStr);

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
            var localdatavalue=vm.assessmentdetail_response.people;
            var localreportvalue=vm.reportdetail_response;
            for(i=0;i<=personIDsArr.length-1;i++){
                localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].color=levelsArr[i]==1?'255,180,0':levelsArr[i]==2?'61,169,224':levelsArr[i]==3?'71,180,117':null;
                localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].levels[1].level_achieved=levelsArr[i]<1?false:true;
                localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].levels[2].level_achieved=levelsArr[i]<2?false:true;
                localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].levels[3].level_achieved=levelsArr[i]<3?false:true;
               
                    if(evCamArr[i]!=''){
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.media.data_ev=evCamArr[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.media.data_ev_ids=camevid[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.media.data_auth=camauth[i];
                        var objmedia=[];
               
                        evCamArr[i].split(',').map((val,ind)=>{
               
                            var valueobj={
                                'datatype':vm.findfiletype(val),
                                'media_url':val,
                                'img_src':val
                            }
                            objmedia.push(valueobj)
                        })
               
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].media=objmedia;
                        
                    }
                    else{
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].media=[];
                    }
               
                    if(evPDFArr[i]!==''){
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.pdf.data_ev=evPDFArr[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.pdf.data_ev_ids=pdfevid[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.pdf.data_auth=pdfauth[i];
                        
                        var objmedia=[];
             
                        evPDFArr[i].split(',').map((val,ind)=>{
             
                            var valueobj={
                                'datatype':vm.findfiletype(val),
                                'media_url':val,
                                'img_src':val
                            }
                            objmedia.push(valueobj)
                        })
             
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].pdf=objmedia;
                        
                    }
                    else{
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].pdf=[];
                    }
             
                    if(evNoteArr[i]!==''){
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.notes.data_ev=evNoteArr[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.notes.data_ev_ids=notesevid[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.notes.data_auth=notesauth[i];
                        var objmedia=[];
                        evNoteArr[i].split(',').map((val,ind)=>{
                            var valueobj={
                                'value':val,
                                'auth':notesauth[ind],
                            }
                            objmedia.push(valueobj)
                        })
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].notes=objmedia;
                        
                    }
                    else{
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].notes=[];
                    }
                    if(evQuesArr[i]!==''){
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.question.data_ev=evQuesArr[i];                    
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.question.data_ev_ids=quesevid[i];                    
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.question.data_auth=quesauth[i];  
                        
                        var objmedia=[];
                        evQuesArr[i].split(',').map((val,ind)=>{
                            var valueobj={
                                'value':val,
                                'auth':notesauth[ind],
                            }
                            objmedia.push(valueobj)
                        })
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].notes=objmedia;
                        
                        
                    }
                
            }
            vm.putDataPouchDetailedDoc(localdatavalue,'detailed_document');

            vm.objSave = {	person_ids:personIDs,
                ind_ids:indIDs,
                levels:levels,
                cams:camStr,
                pdfs:pdfStr,
                notes:noteStr,
                ques:quesStr,
                del:deleteEvStr};
                vm.pouchSaveApiData(vm.objSave).then(function(){
                   resolve('success')
                }).catch(function(err) {
                    reject(err)
                })
            });
        }
        vm.pouchSaveApiData = function(objSave){
            return new Promise(function(resolve, reject) {
            function detailedDocfunc1(doc) {
                if(vm.isEmpty(doc)){
                    var doc={
                        "indicators":{
                        }
                    }
                }
                var modobj=new Object();
                var subobj=new Object();
                var compobj=new Object();
                subobj.comp_id=vm.jobroleandmod.comp_id;
                subobj.mod_id=vm.jobroleandmod.m_id
                subobj.dept_id=vm.jobroleandmod.departmentid;
                subobj.dept_sub_id=vm.jobroleandmod.subDepartmentId;
                subobj.job_role_id=vm.jobroleandmod.jr_id;
                subobj.indicators=vm.objSave;
                if(doc.indicators[vm.jobroleandmod.jr_id]){
                   doc.indicators[vm.jobroleandmod.jr_id][vm.jobroleandmod.m_id]=subobj;
                }
                else{
                    modobj[vm.jobroleandmod.m_id]=subobj;
                    doc.indicators[vm.jobroleandmod.jr_id]=modobj;
                }
                return doc;
            }
            vm.localDB.upsert('saveAPIdata', detailedDocfunc1).then(function() {
                resolve('success')
            }).catch(function(err) {
                reject(err)
            });
        });
        }

        vm.cancel_savesession = function() {
            vm.assessoksavepopup = false;
            angular.element('.assessment-page header #saveSession').css('color', 'rgb(229, 229, 229)');
        }
        vm.multichoicefun = function($event)
        {
            // tem.substr(3,tem.length-1)
            
            // console.log("###multiple choice function $event",$event);
            // console.log("vm.myval",vm.myval);
        }
        vm.choicevalsep = function(val)
        {
            return  val.substr(3,val.length-1)
        }
        vm.assess_popupfun = function(key,assessdetails,$event) {
           if(key.ind_is_q == true ){
            if(key.orgcontent.indexOf("a)")>= 0)
            {
                vm.choiceans = true;
                var qStrFull = key.orgcontent;
                var qPrefArr = ["a)","b)","c)","d)","e)","f)","g)"];
                qPrefArr.forEach(function(item, i) { 
                qStrFull = qStrFull.replace(item,"_q*_"); 
                });
                var multiAnswerArr = qStrFull.split('_q*_');
                vm.assquestion = multiAnswerArr[0];
                vm.anschoice = multiAnswerArr.splice(1);
                vm.anschoicelabel = [];
                vm.anschoice.map((key,index)=>{
                    qPrefArr.map((key1,index1)=>{
                    if(index==index1){
                       var val=key1+' '+key;
                        vm.anschoicelabel.push(val)}
                });
                });
            }
            else {
                vm.choiceans = false;
                 vm.assquestion = key.orgcontent;
            }

           }
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
            var datapath=angular.element($event.target).closest('.panel-row')[0].attributes['data-attribute-value'].value;
            vm.datapath=datapath;
            var datacam=angular.element('[data-attribute-value="'+datapath+'"] .ev-cam')[0].attributes['data-ev'].value;
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

           vm.finalarrcamEv_id=finalarrcamEv_id;
           vm.finalarrpdfEv_id=finalarrpdfEv_id;
           vm.finalarrnotesEv_id=finalarrnotesEv_id;
           vm.finalarrquestionEv_id=finalarrquestionEv_id;

           vm.finalarrcamAuth=finalarrcamAuth;
           vm.finalarrpdfAuth=finalarrpdfAuth;
           vm.finalarrnotesAuth=finalarrnotesAuth;
           vm.finalarrquestionAuth=finalarrquestionAuth;

        }

        vm.answericon = function(obj)
        {
            if(obj.ind_is_q == true )
            {
                if(obj.type_ref.question.data_ev !== undefined){
                        return false;
                }
                return true;
            }
            return false;
        }
        vm.iconobjcheck = function(obj)
        {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;

        }
        vm.showupdatebtn = function(){
            vm.showupdatbtn=true;
        }
        vm.editquestions = function(value,$event){
            vm.changemodel=value;
        }
        vm.updateques = function(value,event){

            if(value == 'choice')
            {
                angular.element(document.querySelectorAll( 'input[type=radio]' )).removeClass('radiotick');
                angular.element(event.target).addClass('radiotick');
            }
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-ev'].value=vm.changemodel
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-ev-ids'].value='new'
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-auth'].value=vm.currentUser
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question').removeClass("hidden");
            angular.element('[data-attribute-value="'+vm.datapath+'"] .q-icon').addClass("anshide");
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
            vm.changemodel=value;
        }
        vm.addnotes = function(){
            var val=angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev'].value
           if(vm.change_note!=''){
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev'].value=val==''?vm.change_note:val+'_*_'+vm.change_note
            var authnew=angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-auth'].value;
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-auth'].value=authnew==''?vm.currentUser:authnew+'_*_'+vm.currentUser
            var evidnew=angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev-ids'].value;
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev-ids'].value=evidnew==''?'new':evidnew+'_*_'+'new';
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes').removeClass("hidden");
            vm.gallerynotesArr.push(vm.change_note);
            vm.finalarrnotesAuth.push(vm.currentUser);
            vm.updatebtn=false;
            vm.change_note='';
           }
            

        }

        vm.assesspopclose = function() {
            vm.assessmentpopup = false;
            vm.camcapture = false;
            vm.bdycampanel = false;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = false; 
            vm.assessmentpopup = false;
            vm.bdycampanel = false;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = false;
            angular.element('.del-media').addClass('ng-hide');
        }

        vm.resourcefunct = function(value) {
            vm.resouobj = value;
            vm.assessreport = !vm.assessreport;
        }
        vm.bdycampanel = true;

        vm.assesscam = function() {
            vm.bdycampanel = true;
            vm.camcapture = false;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = false;
            
        }
        vm.assesspdf = function() {
            
            vm.bdycampanel = false;
            vm.camcapture = false;
            vm.bdypdfpanel = true;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = false;

        }
        vm.assessnotes = function() {
            vm.bdycampanel = false;
            vm.camcapture = false;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = true;
            vm.bdyquestpanel = false;

        }
        vm.assessquest = function(value) {
            vm.bdycampanel = false;
            vm.camcapture = false;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = true;

        }


        vm.filetoserver = function(a)
        {
            var sourcepath = a;
            var fname = sourcepath.substring(sourcepath.lastIndexOf('/')+1);
            var ftypedum = fname.substring(fname.lastIndexOf('.')+1);
            var ftype = ftypedum == 'mp4' ? 'video/mp4': ftypedum == 'jpeg' || ftypedum == 'jpg' ? 'image/jpeg' : ftypedum == 'pdf' ? "application/pdf": ftypedum == '3gp' ? 'video/3gp':ftypedum == 'avi' ? 'video/avi':ftypedum == 'flv' ? 'video/flv':ftypedum == 'wmv' ? 'video/wmv':ftypedum == 'mkv' ? 'video/mkv':ftypedum == 'mov' ? 'video/mov':'';
           
            var win = function (r) {
            }
            
            var fail = function (error) {
                alert("An error has occurred: Code = " + error.code);
            }

            var options = new FileUploadOptions();
            options.fileKey = fname;
            options.fileName =fname; 
            options.mimeType = ftype;
            
            var params = {};
            params.dir = vm.directoryname;
            options.params = params;
                var encodeuri="https://swifttrack-updated-version-agilexcyber.c9users.io/swiftMobile/api/uploadFiles.php";
                var ft = new FileTransfer();
                ft.upload(sourcepath, encodeURI(encodeuri),win,fail,options);
      
        }
        vm.evidenceupload = function(datatype) {
        if(datatype == 'cam'){
            vm.camcapture = !vm.camcapture;
            }
            else if(datatype =='pdf'){
                vm.galclick('pdf');
            }
           }
            vm.camclick = function(datatype){
                var permissions = cordova.plugins.permissions;
                permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, success, error);
                function error() {
                }
                function success( status ) {
                  if( !status.hasPermission ) error();
                }
                permissions.requestPermission(permissions.READ_INTERNAL_STORAGE, success1, error1);
                function error1() {
                }
                function success1( status ) {
                  if( !status.hasPermission ) error();
                }


                var options = {
                    quality: 50, 
                    correctOrientation:true,
                    targetWidth:3120,
                    targetHeight:4100
                 };
                navigator.camera.getPicture(onSuccess, onError,options);
                function onSuccess(mediaFiles) {
                    var name, path, size, type;
                    name = mediaFiles.substring(mediaFiles.lastIndexOf('/')+1);
                    path = mediaFiles;
                    type = mediaFiles.substring(mediaFiles.lastIndexOf('.')+1) == 'jpg'?'image/jpeg':'image/jpg';
                    vm.movefile(path,name,type,datatype);
                    vm.camcapture = false;
                    }
              function onError(error) {
                 }
            }
            vm.vidclick = function(datatype){
                var permissions = cordova.plugins.permissions;
                permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, success, error);
                function error() {
                }
                 
                function success( status ) {
                  if( !status.hasPermission ) error();
                }
                permissions.requestPermission(permissions.READ_INTERNAL_STORAGE, success1, error1);
                function error1() {
                }
                 
                function success1( status ) {
                  if( !status.hasPermission ) error();
                }
                var options = {
                    limit: 1,
                    duration: 250,
                    type: "video/3gpp"
                 };
                navigator.device.capture.captureVideo(onSuccess, onError, options);
                function onSuccess(mediaFiles) {
                    var supvideoModes = navigator.device.capture.supportedVideoModes;
                    var supimageModes = navigator.device.capture.supportedImageModes;
                    var name, path, size, type;
                    path = mediaFiles[0].fullPath;
                    name = mediaFiles[0].name;
                    size = mediaFiles[0].size;
                    type = mediaFiles[0].type;
                    vm.movefile(path,name,type,datatype);
                    vm.camcapture = false;
                 }
                function onError(error) {
                 }
          }
        //   Gallery function to explore file 
            vm.galclick = function(datatype){
               fileChooser.open(
                    function fcSuccess(file){
                    vm.filename=file.name;
                    vm.camcapture = false;
                    vm.movefile(file.uri,file.name,file.mime_type,datatype);
                    },
                    function fcError(e){console.log(e);}
               );  
            
            }

            // End of gallery function to Explore file 
           
            vm.findfiletype=function(name){
                var filename;
                var type=name.split('.')[name.split('.').length-1];
                if(type=='pdf'){filename='pdf'}
                else if(type=='jpg' || type=='jpeg' ||type=='png' ||type=='svg'||type=='gif'){
                    filename='image';
                }else if( type=='mp4' || type=='avi'|| type=='3gp' || type=='flv' || type=='wmv' || type=='mov' ||type=='mkv'){
                    filename='movie'
                }
                return filename;
               }
            //    Move to files to cordova external file path
            vm.movefile=function(uri,name,ftype,datatype){
                var filename;
                var type=name.split('.')[name.split('.').length-1];
                if(type=='pdf'){filename='pdf'};
                if(type=='jpg' || type=='jpeg' || type=='mp4'|| type=='3gp'  || type=='avi' || type=='png' ||type=='svg'||type=='gif'||type=='flv' || type=='wmv' || type=='mov' ||type=='mkv'){
                    filename='cam';
                }
                if(filename!=datatype){
                    var datatypeuppcase = "";
                    if(datatype == 'pdf'){datatypeuppcase = datatype.toUpperCase();}
                    else{ datatypeuppcase = "MEDIA"}
                    $ionicPopup.alert({
                        title: 'Incorrect File Type',
                        template: 'Please choose a '+datatypeuppcase+' file to attach.'
                    })
                    return;
                }
               var ft = new FileTransfer();
                var time = new Date();
                var newfilename=name.split('.')[0]+'_'+time.getTime()+'.'+name.split('.')[name.split('.').length-1]
                var targetPath = cordova.file.externalApplicationStorageDirectory +"files/" + newfilename;
                vm.videolocallocation = targetPath;
                ft.download(uri,targetPath,downloadsuccess,downloadfailed)
                    function downloadsuccess(entry) {
                        vm.localfilemediaarray.push(targetPath);
                       var evidence=angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'')[0].attributes['data-ev'].value;
                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'')[0].attributes['data-ev'].value=evidence==''?newfilename:evidence+','+newfilename;
                        var evidenceid=angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'')[0].attributes['data-ev-ids'].value;
                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'')[0].attributes['data-ev-ids'].value=evidenceid==''?'new':evidenceid+',new';
                       if(datatype =='cam'){
                        vm.gallerycamArr.push(newfilename);
                        vm.finalarrcamEv_id.push('new')
                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'').removeClass("hidden");
                       }
                       else{
                        vm.finalarrpdfAuth.push(vm.currentUser);
                        vm.gallerypdfArr.push(newfilename);
                        vm.finalarrpdfEv_id.push('new')
                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'').removeClass("hidden");
                       }


                        $scope.$apply(function () {
                            vm.playvideo = true;
                            vm.filetype = ftype;
                        });
                    }
                    function downloadfailed(error){
                        console.log(error,error.code)
                    }
            
            }
            // File upload function to server 
            vm.fileuploadfunction = function(){
                var win = function (r) {
                    console.log("*****win function r",r);
                }
                
                var fail = function (error) {
                    alert("An error has occurred: Code = " + error.code);
                }
    
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName =name; 
                options.mimeType = ftype;
                options.chunkMode = true;
                var params = {};
                params.value1 = "test";
                params.value2 = "param";
                options.params = params;
                    var encodeuri="https://swifttrack-updated-version-agilexcyber.c9users.io/swiftMobile/api/uploadFiles.php";
                    var ft = new FileTransfer();
                    ft.upload(targetPath, encodeURI(encodeuri),win,fail,options);
          
            // #######################################
            // ----------end-------
            }
            // Assessment section video play via streming media plugin
        vm.assessvideoplay = function(filetype,value){
            console.log("assessvideoplayt fun param value",value);
            vm.videolocallocation = value;
            if(filetype == "movie"){
            //    stream code start
                var targetPath = cordova.file.externalApplicationStorageDirectory +"files/";
                var filename = value.substring(value.lastIndexOf('/')+1);
                var urll = targetPath+filename;
                var options = {
                successCallback: function(){
                    console.log("Video was closed without error.");
                },
                errorCallback: function(errMsg) {
                    console.log("Error! " + errMsg);
                },
                    orientation: 'portrait',
                    shouldAutoClose: true,  // true(default)/false
                    controls: true // true(default)/false. Used to hide controls on fullscreen
                  };
                window.plugins.streamingMedia.playVideo(urll, options);
                //  code for ios
                // StreamingMedia.playiOS('url')
                // StreamingMedia.playLocaliOS("local file path")
              

 //    stream code end
            }
            else if(filetype == "image"){
                vm.assessimagepopup=true;
               }
        }
        vm.assessvideopopupclose = function(videourl,$event){
            var srcelement=$event.target.nextElementSibling.children[0];
            video = angular.element(srcelement);
            video[0].pause();
            vm.assessvideopopup=false;
            vm.bdycampanel = true;
        }
        vm.iconclass = function($event){
        }
        vm.removeMedia = function(i,value,$event){
            angular.element('.del-media').addClass('ng-hide');
            angular.element($event.target).parent().children('.del-media').removeClass('ng-hide');
        }
        vm.deleteconf = function(type,i,value,$event){
            console.log("delete confirm");
            angular.element(document.querySelectorAll( 'input[type=radio]' )).removeClass('radiotick');
            vm.localfilemediaarray.map(function(a){
            var fileurl = cordova.file.externalApplicationStorageDirectory +"files/"+value; 
            if(a == fileurl){
                vm.localfilemediaarray.splice(fileurl,1);
            }
        })
            angular.element('.del-media').addClass('ng-hide');
            if(type == 'cam'){
                vm.deleteEvArr.push(vm.finalarrcamEv_id.splice(i,1)[0]);
                vm.gallerycamArr.splice(i,1);
                if(vm.gallerycamArr.length == 0){
                    angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-cam').addClass('hidden');
                }
               angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-cam')[0].attributes['data-ev'].value=vm.gallerycamArr.join(',')
               angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-cam')[0].attributes['data-ev-ids'].value = vm.finalarrcamEv_id.join(',')
            }
            else if(type == 'pdf'){
                vm.deleteEvArr.push(vm.finalarrpdfEv_id.splice(i,1)[0]);
                vm.gallerypdfArr.splice(i,1);
                if(vm.gallerypdfArr.length == 0){
                    angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-pdf').addClass('hidden');
                 }
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-pdf')[0].attributes['data-ev'].value = vm.gallerypdfArr.join(',')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-pdf')[0].attributes['data-ev-ids'].value = vm.finalarrpdfEv_id.join(',')
            }
            else if(type == 'notes'){
                vm.deleteEvArr.push(vm.finalarrnotesEv_id.splice(i,1)[0]);
                vm.gallerynotesArr.splice(i,1);
                vm.finalarrnotesAuth.splice(i,1);
                if(vm.gallerynotesArr.length == 0){
                    angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes').addClass('hidden');
                 }
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev'].value = vm.gallerynotesArr.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev-ids'].value =  vm.finalarrnotesEv_id.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-auth'].value =  vm.finalarrnotesAuth.join('_*_')

            }
            else if(type == 'question'){
                console.log('question');
                vm.deleteEvArr.push(vm.finalarrquestionEv_id.splice(i,1)[0]);
                vm.galleryquestionArr.splice(i,1);
                vm.finalarrquestionAuth.splice(i,1);
                if(vm.galleryquestionArr.length == 0){
                    angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question').addClass('hidden');
                    angular.element('[data-attribute-value="'+vm.datapath+'"] .q-icon').removeClass('anshide');
                }
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-ev'].value = vm.galleryquestionArr.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-ev-ids'].value = vm.finalarrquestionEv_id.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-auth'].value = vm.finalarrquestionAuth.join('_*_')
            }
            angular.element('.del-media').addClass('ng-hide');
        }
        vm.cancelconf = function($event)
        {
            angular.element($event.target).parent().addClass('ng-hide');
        }
        vm.resourcevideosectionclose = function($event)
        {
        var ck=angular.element($event.target).parents('.mdl-full-page').find('video');
        ck.map((a)=>ck[a].pause());
            vm.assessreport = false;
            vm.assesstray = true;
        }

        vm.videoclick = function($event){
            if( $event.target.nextElementSibling.paused == true){
                var ck1=angular.element($event.target).parents('.mdl-full-page').find('video');
                    ck1.map((a)=>ck1[a].pause());
                console.log("condi",$event.target.nextElementSibling.paused)
                $event.target.nextElementSibling.play()
            }
            else {
                 $event.target.nextElementSibling.pause()
                }
        }

        vm.pdfopen =function(url,datatype){
            vm.assesspdfpopup = true;
            vm.data_type = datatype;
            vm.targetPath = cordova.file.externalApplicationStorageDirectory +"files/"+url.substring(url.lastIndexOf('/')+1)
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
    // END###############
        vm.assesspdfpopupclose = function($event){
            vm.assesspdfpopup = false;
        }
        vm.updateok = function(){
            var a = vm.myValue;
            vm.upVal = a;
            vm.myValue = "";
            vm.noterow =true;
            vm.delnotemedia=false;
        }
    
    }


    angular.module('swiftTrack.assessment')
        .controller('assessmentCtrl', assessmentCtrl);
    assessmentCtrl.$inject = ['Loader','$ionicPopup','NetworkInformation','Constants','PDFViewerService','$sce','$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory', 'ModuleService','$filter', '$rootScope', '$cordovaCapture'];
}());
