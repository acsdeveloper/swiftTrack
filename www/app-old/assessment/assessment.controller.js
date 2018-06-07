(function() {
    // 'use strict';
    function assessmentCtrl($ionicPopup,NetworkInformation,Constants,pdf,$sce,$state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, ModuleService,$filter) {
        //console.log("after ctrl");
        var vm = this;
        vm.localfilemediaarray =[];
        vm.localDB = new PouchDB("Swifttrack", {
            revs_limit: 2
        });
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
                ModuleService.ReportdetailsPouch(vm.jobroleandmod).then(function(resp1) {
                    console.log(resp1,"assessment controller response");
                    vm.reportdetail_response = resp1;
                });
            });
           
            });
            
        }
        vm.assessmentdetails();
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
                   //console.log(assesskey,personid,document.querySelector('[data-attribute-value="person_'+assesskey+'_'+personid+'"]'))
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
                    //console.log(assesskey,personid,document.querySelector('[data-attribute-value="person_'+assesskey+'_'+personid+'"]'))
                    document.querySelector('[data-attribute-value="person_'+assesskey+'_'+personid+'"]').setAttribute("data-level-set", parseInt(level)-1)

                }
                
            }
            // vm.getRandomstr = function(){
            //     // return Math.random().toString(36).substring(1);
            //     var text = "";
            //     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            //     for (var i = 0; i < 10; i++)
            //     text += possible.charAt(Math.floor(Math.random() * possible.length));
            //     //console.log(text)
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


            // //console.log("aa", a);
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
            // vm.withoutsave = true;
            // vm.assesscancelsavepopup =false;
            $state.go('dashboard')

        }
        // vm.retdashboard = function()
        // {
        //     vm.withoutsave = false;
        //        $state.go('dashboard')
        // }

        // vm.contsection = function()
        // {
        //     vm.withoutsave = false;

        // }

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
                    // console.log(vm.jobroleandmod);
                    // console.log(doc);
                    // console.log(data)
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
                console.log("asssessment ends");
                console.log(NetworkInformation.isOnline(),"isonline")
                vm.saveuploadpouch(vm.localfilemediaarray,'saveuploadfiles').then(function() {   
                if(NetworkInformation.isOnline()==true){
                    // Loader.startLoading();
                    ModuleService.saveAPIOnline().then(function(res){
                        // Loader.stopLoading();
                        console.log("confirm save vm.localfilemediaarray",vm.localfilemediaarray);
                        vm.localfilemediaarray.map(function(a){
                           vm.filetoserver(a);
                        });
                        console.log(res,'response data from assesmemr');
                        ModuleService.fetchfulldata().then(function(){
                            $state.go('dashboard');
                        })
                    })
                }
                else{
                    $cookieStore.put("ChangesBoolean", true);
                    $ionicPopup.alert({
                        title: 'No Internet',
                        template: 'You are Offline. Your data will sync once you are online'
                    }).then(function(res) {
                        $state.go('dashboard');
                    });
                   
                }
            })
                
                
            })
        }
        vm.savefunction = function() {
            return new Promise(function(resolve, reject) {
            //save functionality
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

                    var evCamStr = ($(this).find('.ev-cam').attr('data-ev'))
                    var evCamidStr = ($(this).find('.ev-cam').attr('data-ev-ids'))
                    var evCamauthStr = ($(this).find('.ev-cam').attr('data-auth'))

                    var evPDFStr = ($(this).find('.ev-pdf').attr('data-ev'))
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
            //


            //save in main DATA
                                                              
            var localdatavalue=vm.assessmentdetail_response.people;
            var localreportvalue=vm.reportdetail_response;
            console.log(localreportvalue,"process data value");
            //console.log(localdatavalue,personIDsArr.length,"finaldata")
            for(i=0;i<=personIDsArr.length-1;i++){
                console.log(localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id],"v1 test")
                console.log(localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]],"v2 test")
                console.log(localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].color,levelsArr[i],"v3 test")
                localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].color=levelsArr[i]==1?'255,180,0':levelsArr[i]==2?'61,169,224':levelsArr[i]==3?'71,180,117':null;
                
                localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].levels[1].level_achieved=levelsArr[i]<1?false:true;
                localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].levels[2].level_achieved=levelsArr[i]<2?false:true;
                localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].levels[3].level_achieved=levelsArr[i]<3?false:true;
                // if(vm.deletemedia==true){
                    console.log('deletemedia get inside')
                    if(evCamArr[i]!=''){

                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.media.data_ev=evCamArr[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.media.data_ev_ids=camevid[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.media.data_auth=camauth[i];
                        var objmedia=[];
                        console.log(evCamArr,"test v1 new")
                        evCamArr[i].split(',').map((val,ind)=>{
                            // objmedia=[];
                            var valueobj={
                                'datatype':vm.findfiletype(val),
                                'media_url':val,
                                'img_src':val
                            }
                            objmedia.push(valueobj)
                        })
                        console.log(evCamArr,objmedia,"test v1 new")
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].media=objmedia;
                        
                        // localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].type_ref.media.data_ev_ids=camevid[i];
                        // localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].type_ref.media.data_auth=camauth[i];
                    }
                    else{
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].media=[];
                    }
               // }
                // if(vm.deletepdf==true){
                    if(evPDFArr[i]!==''){
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.pdf.data_ev=evPDFArr[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.pdf.data_ev_ids=pdfevid[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.pdf.data_auth=pdfauth[i];
                        
                        // localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].type_ref.pdf.data_ev=evPDFArr[i];
                        // localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].type_ref.pdf.data_ev_ids=pdfevid[i];
                        // localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].type_ref.pdf.data_auth=pdfauth[i];
                        var objmedia=[];
                        console.log(evPDFArr,"test v1 new")
                        evPDFArr[i].split(',').map((val,ind)=>{
                            // objmedia=[];
                            var valueobj={
                                'datatype':vm.findfiletype(val),
                                'media_url':val,
                                'img_src':val
                            }
                            objmedia.push(valueobj)
                        })
                        console.log(evPDFArr,objmedia,"test v1 new")
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].pdf=objmedia;
                        
                    }
                    else{
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].pdf=[];
                    }
                // }
                // if(vm.deletenotes==true){
                    if(evNoteArr[i]!==''){
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.notes.data_ev=evNoteArr[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.notes.data_ev_ids=notesevid[i];
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.notes.data_auth=notesauth[i];

                        // localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].type_ref.notes.data_ev=evNoteArr[i];
                        // localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].type_ref.notes.data_ev_ids=notesevid[i];
                        // localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].type_ref.notes.data_auth=notesauth[i];
                        var objmedia=[];
                        console.log(evNoteArr,"test v1 new")
                        evNoteArr[i].split(',').map((val,ind)=>{
                            // objmedia=[];
                            var valueobj={
                                'value':val,
                                'auth':notesauth[ind],
                            }
                            objmedia.push(valueobj)
                        })
                        console.log(evNoteArr,objmedia,"test v1 new")
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].notes=objmedia;
                        
                        
                    }
                    else{
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].notes=[];
                    }
                // }
                // if(vm.deleteques==true){
                    if(evQuesArr[i]!==''){
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.question.data_ev=evQuesArr[i];                    
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.question.data_ev_ids=quesevid[i];                    
                        localdatavalue[personIDsArr[i]]['indicators'][indicatorIDsArr[i]].type_ref.question.data_auth=quesauth[i];  
                        
                        // localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].type_ref.question.data_ev=evQuesArr[i];                    
                        // localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].type_ref.question.data_ev_ids=quesevid[i];                    
                        // localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].type_ref.question.data_auth=quesauth[i];  
                        var objmedia=[];
                        console.log(evNoteArr,"test v1 new")
                        evQuesArr[i].split(',').map((val,ind)=>{
                            // objmedia=[];
                            var valueobj={
                                'value':val,
                                'auth':notesauth[ind],
                            }
                            objmedia.push(valueobj)
                        })
                        console.log(evQuesArr,objmedia,"test v1 new")
                        localreportvalue[personIDsArr[i]]['detailedReport'][vm.jobroleandmod.comp_id]['modules'][vm.jobroleandmod.m_id]['indicators'][indicatorIDsArr[i]].notes=objmedia;
                        
                        
                    }
                // }
                
            }
            console.log(localreportvalue,'ck changes')
            vm.putDataPouchDetailedDoc(localdatavalue,'detailed_document');

            vm.objSave = {	person_ids:personIDs,
                ind_ids:indIDs,
                levels:levels,
                cams:camStr,
                pdfs:pdfStr,
                notes:noteStr,
                ques:quesStr,
                del:deleteEvStr};
                console.log(vm.objSave,"objsave");
                //save as api passing data
              
                vm.pouchSaveApiData(vm.objSave).then(function(){
                   resolve('success')
                }).catch(function(err) {
                    reject(err)
                    console.log(err)
                })

            });
        }
        vm.pouchSaveApiData = function(objSave){
            return new Promise(function(resolve, reject) {
            function detailedDocfunc1(doc) {
                console.log(doc,"entry");
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
                console.log('success')
            }).catch(function(err) {
                reject(err)
                console.log(err)
            });
        });
        }

        vm.cancel_savesession = function() {
            vm.assessoksavepopup = false;
            angular.element('.assessment-page header #saveSession').css('color', 'rgb(229, 229, 229)');
        }


        vm.assess_popupfun = function(key,assessdetails,$event) {
           console.log("key",key); 
           console.log("assessdetails",assessdetails); 
           console.log("event",$event); 
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
            //console.log(angular.element($event.target).closest('.panel-row')[0].attributes['data-attribute-value'].value)
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
           //console.log(finalarrquestion,"finalArr")
           vm.galleryquestionArr=finalarrquestion;

           vm.finalarrcamEv_id=finalarrcamEv_id;
           vm.finalarrpdfEv_id=finalarrpdfEv_id;
           vm.finalarrnotesEv_id=finalarrnotesEv_id;
           vm.finalarrquestionEv_id=finalarrquestionEv_id;

           vm.finalarrcamAuth=finalarrcamAuth;
           vm.finalarrpdfAuth=finalarrpdfAuth;
           vm.finalarrnotesAuth=finalarrnotesAuth;
           vm.finalarrquestionAuth=finalarrquestionAuth;

           console.log(" vm.gallerycamArr", vm.gallerycamArr);
           
            
        //console.log(" vm.datapath", vm.datapath);
        //console.log(" vm.gallerycamArr", vm.gallerycamArr);
        //console.log("vm.gallerypdfArr",vm.gallerypdfArr);
        //console.log(" vm.finalarrcamEv_id", vm.finalarrcamEv_id);
        //console.log("vm.finalarrcamAuth",vm.finalarrcamAuth);    

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
            //console.log(value,document.getElementsByClassName('q-answer'))
            vm.changemodel=value;
            // document.getElementsByClassName('q-answer')[0].value=value;
        }
        vm.updateques = function(){
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-ev'].value=vm.changemodel
            angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-ev-ids'].value='new'
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
            //console.log(value,document.getElementsByClassName('q-answer'))
            vm.changemodel=value;
            // document.getElementsByClassName('q-answer')[0].value=value;
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
            //console.log(vm.gallerynotesArr,vm.finalarrnotesAuth)
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
            angular.element('.del-media').addClass('ng-hide');
        }

        vm.resourcefunct = function(value) {
            //console.log("resou this value", value);
            //console.log("resou name", value.resource_name);
            vm.resouobj = value;
            vm.assessreport = !vm.assessreport;
            // angular.element('body').addClass('locked-page hidden-main');
        }
        vm.bdycampanel = true;
        //console.log("temp check");

        vm.assesscam = function() {
            vm.bdycampanel = true;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = false;
            // angular.element('.del-media').addClass('ng-hide');
            
        }
        vm.assesspdf = function() {
            
            vm.bdycampanel = false;
            vm.bdypdfpanel = true;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = false;
            // angular.element('.del-media').addClass('ng-hide');

        }
        vm.assessnotes = function() {
            vm.bdycampanel = false;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = true;
            vm.bdyquestpanel = false;
            // angular.element('.del-media').addClass('ng-hide');

        }
        vm.assessquest = function(value) {
            console.log("question value ",value);
            vm.bdycampanel = false;
            vm.bdypdfpanel = false;
            vm.bdynotespanel = false;
            vm.bdyquestpanel = true;
            // angular.element('.del-media').addClass('ng-hide');

        }


        vm.filetoserver = function(a)
        {
            console.log(a);
            var sourcepath = a;
            var fname = sourcepath.substring(sourcepath.lastIndexOf('/')+1);
            var ftypedum = fname.substring(fname.lastIndexOf('.')+1);
            var ftype = ftypedum == 'mp4' ? 'video/mp4': ftypedum == 'jpeg' || ftypedum == 'jpg' ? 'image/jpeg' : ftypedum == 'pdf' ? "application/pdf":'' ;
           
            console.log("file type",ftypedum);
            var win = function (r) {
                console.log("*****win function r",r);
                //console.log("Code = " + r.responseCode);
                //console.log("Response = " + r.response);
                //console.log("Sent = " + r.bytesSent);
            }
            
            var fail = function (error) {
                console.log("**************** fail function error ",error)
                alert("An error has occurred: Code = " + error.code);
                //console.log("upload error source " + error.source);
                //console.log("upload error target " + error.target);
            }

            var options = new FileUploadOptions();
            options.fileKey = fname;
            options.fileName =fname; 
            options.mimeType = ftype;
            
            var params = {};
            params.value1 = "test";
            params.value2 = "param";

            options.params = params;

                var encodeuri="https://swifttrack-agilexcyber.c9users.io/swiftMobile/api/uploadFiles.php";
                //console.log("encodeuri",encodeuri);
                var ft = new FileTransfer();
                ft.upload(sourcepath, encodeURI(encodeuri),win,fail,options);
      
        }


        vm.evidenceupload = function(datatype) {
            
            fileChooser.open(
                function fcSuccess(file){
                    vm.filename=file.name;
                    vm.movefile(file.uri,file.name,file.mime_type,datatype);
                    console.log(" from filechooser",file.mime_type);
                    },
                  function fcError(e){console.log(e);}
           );   
           
            }
            vm.findfiletype=function(name){
                console.log(name)
                var filename;
                
                var type=name.split('.')[name.split('.').length-1];
                //console.log(datatype,type,name)
                if(type=='pdf'){filename='pdf'}
                else if(type=='jpg' || type=='jpeg' ||type=='png' ||type=='svg'||type=='gif'){
                    filename='image';
                }else if( type=='mp4' || type=='avi' || type=='flv' || type=='wmv' || type=='mov' ||type=='mkv'){
                    filename='movie'
                }
                return filename;
                //console.log(datatype,type,name,filename)
                
            }
            vm.movefile=function(uri,name,ftype,datatype){
                var filename;
                
                console.log("movefile uri",uri);
                console.log("movefile name",name);
                
                var type=name.split('.')[name.split('.').length-1];
                //console.log(datatype,type,name)
                if(type=='pdf'){filename='pdf'};
                if(type=='jpg' || type=='jpeg' || type=='mp4' || type=='avi' || type=='png' ||type=='svg'||type=='gif'||type=='flv' || type=='wmv' || type=='mov' ||type=='mkv'){
                    filename='cam';
                }
                //console.log(datatype,type,name,filename)
                if(filename!=datatype){

                    alert('error file type');
                    return;
                }
               
                var ft = new FileTransfer();
                var time = new Date();
                var newfilename=name.split('.')[0]+'_'+time.getTime()+'.'+name.split('.')[name.split('.').length-1]

                console.log("newfilename ",newfilename);
                var targetPath = cordova.file.externalApplicationStorageDirectory +"files/" + newfilename;
                vm.videolocallocation = targetPath;
                console.log("file download success uri",uri);
                console.log("file download success targetPath",targetPath);
                ft.download(uri,targetPath,downloadsuccess,downloadfailed)
                    function downloadsuccess(entry) {



                       
                        vm.localfilemediaarray.push(targetPath);
                        // console.log("file download success uri",uri);
                        // console.log("file download success targetPath",targetPath);
                        console.log(" vm.localfilearray check array", vm.localfilearray);
                        
                        
                        
                        var evidence=angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'')[0].attributes['data-ev'].value;

                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'')[0].attributes['data-ev'].value=evidence==''?newfilename:evidence+','+newfilename;
                        
                        var evidenceid=angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'')[0].attributes['data-ev-ids'].value;
                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'')[0].attributes['data-ev-ids'].value=evidenceid==''?'new':evidenceid+',new';
                        // angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'')[0].attributes['data-auth'].value+=','+vm.currentUser;
                       if(datatype =='cam'){
                        vm.gallerycamArr.push(newfilename);
                        vm.finalarrcamEv_id.push('new')
                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'').removeClass("hidden");
                       }
                       else{
                        //    console.log("$$$$$$pdf");
                        vm.finalarrpdfAuth.push(vm.currentUser);
                        vm.gallerypdfArr.push(newfilename);
                        vm.finalarrpdfEv_id.push('new')
                        angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-'+datatype+'').removeClass("hidden");
                       }
                        // vm.galleryquestionArr=vm.changemodel.split('_*_');
                        // vm.finalarrquestionAuth=vm.currentUser.split('_*_')


                        $scope.$apply(function () {
                            //console.log("file type ..----------------.",typeof ftype);
                            //console.log("file type ..-----###--------.",ftype);
                            vm.playvideo = true;
                            vm.filetype = ftype;
                        });
                        
                
                
                    }
                    function downloadfailed(error){
                        console.log(error,error.code)
                    }
                // ##########################################
                    // file upload to server 
    
            
            }
            vm.fileuploadfunction = function(){

    
                var win = function (r) {
                    console.log("*****win function r",r);
                    //console.log("Code = " + r.responseCode);
                    //console.log("Response = " + r.response);
                    //console.log("Sent = " + r.bytesSent);
                }
                
                var fail = function (error) {
                    console.log("**************** fail function error ",error)
                    alert("An error has occurred: Code = " + error.code);
                    //console.log("upload error source " + error.source);
                    //console.log("upload error target " + error.target);
                }
    
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName =name; 
                options.mimeType = ftype;
                //console.log("option obj",options);
                //console.log("targetPath",targetPath);
                var params = {};
                params.value1 = "test";
                params.value2 = "param";
    
                options.params = params;
    
                    var encodeuri="https://swifttrack-agilexcyber.c9users.io/swiftMobile/api/uploadFiles.php";
                    //console.log("encodeuri",encodeuri);
                    var ft = new FileTransfer();
                    ft.upload(targetPath, encodeURI(encodeuri),win,fail,options);
          
            // #######################################
            // ----------end-------
            
            
            }

        vm.assessvideoplay = function(filetype,value)
        {
            console.log(" assessvideoplay function value ",value);
            angular.element('.del-media').addClass('ng-hide');
            vm.videolocallocation = value;
            //console.log("assess video function");
            //console.log("assess filetype",filetype);
            //console.log("assess value",value);
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
            //console.log("icon class $event",$event);
        }

        vm.removeMedia = function(i,value,$event)
        {
            
            angular.element('.del-media').addClass('ng-hide');
            // console.log("deletemedia angular element", angular.element($event.target).parent().children('.del-media'));
            // console.log(" angular.element($event.target).parent().children('.del-media').removeClass('ng-hide')");
            angular.element($event.target).parent().children('.del-media').removeClass('ng-hide');
           
            
            console.log("question remove media");
            console.log("media remove function i",i);
            console.log("media remove function value",value);
            console.log("media remove function event",$event);
        
        }
        vm.deleteconf = function(type,i,value,$event)
        {
            console.log(type,i,value,$event,"type-----");
            //console.log("vm.gallerynotesArr",vm.gallerynotesArr);
             vm.localfilemediaarray.map(function(a){
             var fileurl = cordova.file.externalApplicationStorageDirectory +"files/"+value; 
            if(a == fileurl){
                vm.localfilemediaarray.splice(fileurl,1);
                console.log(" deleted fileurl ",fileurl);
                console.log(" array ",vm.localfilemediaarray);
            }
        })

            angular.element('.del-media').addClass('ng-hide');

            if(type == 'cam'){
                vm.deleteEvArr.push(vm.finalarrcamEv_id.splice(i,1)[0]);
               vm.gallerycamArr.splice(i,1);
              if(vm.gallerycamArr.length == 0){
                 angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-cam').addClass('hidden');
              }
               
            //    vm.finalarrcamEv_id.splice(i,1);
               angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-cam')[0].attributes['data-ev'].value=vm.gallerycamArr.join(',')
               angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-cam')[0].attributes['data-ev-ids'].value = vm.finalarrcamEv_id.join(',')
               //    vm.finalarrcamAuth.splice(i,1);
               

            }
            else if(type == 'pdf'){
                //console.log("its pdf ");
                vm.deleteEvArr.push(vm.finalarrpdfEv_id.splice(i,1)[0]);
                vm.gallerypdfArr.splice(i,1);
                // vm.finalarrpdfEv_id.splice(i,1);
                if(vm.gallerypdfArr.length == 0){
                    angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-pdf').addClass('hidden');
                 }
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-pdf')[0].attributes['data-ev'].value = vm.gallerypdfArr.join(',')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-pdf')[0].attributes['data-ev-ids'].value = vm.finalarrpdfEv_id.join(',')
                // vm.finalarrpdfAuth.splice(i,1);


            }
            else if(type == 'notes'){
                vm.deleteEvArr.push(vm.finalarrnotesEv_id.splice(i,1)[0]);
                vm.gallerynotesArr.splice(i,1);
                // vm.finalarrnotesEv_id.splice(i,1);
                vm.finalarrnotesAuth.splice(i,1);
                
                if(vm.gallerynotesArr.length == 0){
                    angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes').addClass('hidden');
                 }
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev'].value = vm.gallerynotesArr.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-ev-ids'].value =  vm.finalarrnotesEv_id.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-notes')[0].attributes['data-auth'].value =  vm.finalarrnotesAuth.join('_*_')
                //console.log("its notes");


            }
            else if(type == 'question'){
                console.log('question');
                vm.deleteEvArr.push(vm.finalarrquestionEv_id.splice(i,1)[0]);
                // vm.finalarrquestionEv_id.splice(i,1);
                vm.galleryquestionArr.splice(i,1);
                vm.finalarrquestionAuth.splice(i,1);
                
                if(vm.galleryquestionArr.length == 0){
                    angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question').addClass('hidden');
                }
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-ev'].value = vm.galleryquestionArr.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-ev-ids'].value = vm.finalarrquestionEv_id.join('_*_')
                angular.element('[data-attribute-value="'+vm.datapath+'"] .ev-question')[0].attributes['data-auth'].value = vm.finalarrquestionAuth.join('_*_')
            }

//console.log(vm.deleteEvArr,"delete evidence arr")
            angular.element('.del-media').addClass('ng-hide');
            



            //console.log("delete confirm",$event);
            //console.log("delete confirm index",i);
            //console.log("delete confirm value",value);


        }
        vm.cancelconf = function($event)
        {
            angular.element($event.target).parent().addClass('ng-hide');
            //console.log("cancel confirm",$event);
        }



        vm.resourcevideosectionclose = function($event)
        {
            // //console.log(" resourcevideosectionclose id",id);
         
                var srcele = $event.target.parentElement.nextElementSibling.children[1].children[0].children[0];
            video = angular.element(srcele);
           //console.log("video function",video,"src",srcele.tagName);
            if(srcele.tagName == 'VIDEO'){video[0].pause();}

            
            
            vm.assessreport = false;
            vm.assesstray = true;

        }
        
        // vm.pdfevidence = function()
        // {
        //     //console.log("pdf evidence");
        //     fileChooser.open(
        //         function fcSuccess(file){
        //             vm.filename=file.name;
        //             //console.log("file uri",file.uri,"file name",file.name,"file type",file.mime_type);
        //             downloadPdf(file.uri,file.name,file.mime_type);
        //             },
        //           function fcError(e){//console.log(e);}
        //    );


        //    function downloadPdf(uri,name,ftype){
           
        //     var ft = new FileTransfer();
        //     var targetPath = cordova.file.externalRootDirectory +"Uploadfolder/" + name;

        //     //console.log(" *****targetPath",targetPath);
        //     vm.pdflocallocation = targetPath;
        //     ft.download(
        //         uri,
        //         targetPath,
        //         function(entry) {

        //             $scope.$apply(function () {
        //                 //console.log("file type ...",ftype);
        //                 vm.pdficon = true;
        //             });
                    
        //             //console.log(entry);
        //             //console.log("download complete: " + entry.fullPath);
    
        //         },
        //         function(error) {
        //             //console.log("error");
        //             //console.log(error);
        //             //console.log("download error" + error.code);
        //         }
        //     );
            

        
        
        // }





        // }

        vm.pdfopen =function(url,datatype)
        {
            //console.log("pdf open function...........---");
            vm.assesspdfpopup = true;
            // vm.reportvideoimagepdfpopup = true;
            vm.data_type = datatype;
            
            vm.targetPath = cordova.file.externalApplicationStorageDirectory +"files/"+url.substring(url.lastIndexOf('/')+1)
            
        
     
        }



        // #################pdf

    vm.viewer = pdf.Instance("viewer");

	vm.nextPage = function() {
        // console.log("vm.currentPage",vm.currentPage);
        // console.log("vm.totalPages",vm.totalPages);
     vm.viewer.nextPage();
    if(vm.currentPage > 1){ vm.prevpage = true; }
      
	};

	vm.prevPage = function() {
        // console.log("vm.currentPage",vm.currentPage);
        // console.log("vm.totalPages",vm.totalPages);
        
        vm.viewer.prevPage();
       
        
	};

	vm.pageLoaded = function(curPage, totalPages) {
        // console.log("current page",curPage,"total pages",totalPages);
        vm.nextpage = true;
        vm.prevpage = true;
		vm.currentPage = curPage;
        vm.totalPages = totalPages;
       if(vm.currentPage == 1 ){vm.prevpage = false;}
       else if(totalPages == curPage  ){ vm.nextpage = false;}

    
    };


   
    
    // END###############





        vm.assesspdfpopupclose = function($event){
            //console.log("pdf close fun-----");
            vm.assesspdfpopup = false;
        }

       
        

        // var url = "file:///storage/emulated/0/360/sample.pdf";


        vm.updateok = function(){
            //console.log("update ok....");
            var a = vm.myValue;
            vm.upVal = a;
            vm.myValue = "";
            vm.noterow =true;
            vm.delnotemedia=false;
        }



    
    }


    


    angular.module('swiftTrack.assessment')
        .controller('assessmentCtrl', assessmentCtrl);
    assessmentCtrl.$inject = ['$ionicPopup','NetworkInformation','Constants','PDFViewerService','$sce','$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory', 'ModuleService','$filter'];
}());
