(function() {
    // 'use strict';

    function signoffCtrl(SyncService,NetworkInformation,SignoffService,$state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, $filter) {
        //console.log('signoff controller')
        var vm = this;

//page functionality

            vm.localDB = new PouchDB("Swifttrack", {
                revs_limit: 2
            });


            vm.responsedata=storageFactory.getSignoffData();
            vm.names_pplArr= vm.responsedata.names_ppl.split(',');
            vm.ids_compsArr=vm.responsedata.ids_comps.split(',');
            vm.names_comps=vm.responsedata.names_comps.split(',');
            vm.ids_pplArr=vm.responsedata.ids_ppl.split(',');

            vm.signoffnow = function(ids_comps,ids_ppl,$event){
                storageFactory.setchangessignoff(true);
                $cookieStore.put("ChangesBoolean", true);
                var templateonline='<span><i class="icon-checkmark"></i> Signed off successfully</span>'
                var templateoffline='<span><i class="icon-checkmark"></i>You are in offline, Signed off saved in local</span>'
                var value=angular.element($event.target).parents('.textbox').find('textarea')[0].value;
                var idObj = new Object();
                idObj['comp_id']=ids_comps;
                idObj['ppl_id']=ids_ppl;
                idObj['msg']=value;
                SignoffService.getpost_jsonobject().then(function(data){
                    vm.putPouchsignoffDoc(data,idObj,'signoffdata').then(function(fetchdata){
                        if(NetworkInformation.isOnline()==true){
                            SignoffService.sendsignoffdata().then(function(){
                                angular.element($event.target).parents('.textbox').find('.report').html(templateonline);
                                angular.element($event.target).hide();

                            })
                        }else{
                            vm.putDataPouchDetailedDoc(idObj,'detailed_document');
                            $cookieStore.put("ChangesBoolean", true);
                            angular.element($event.target).parents('.textbox').find('.report').html(templateoffline);
                            angular.element($event.target).hide();
                        }

                    })
                })


            }
            vm.putDataPouchDetailedDoc = function(data,doc_name){
                return new Promise(function(resolve, reject) {
                    // Do async job
                    function detailedDocfunc(doc) {
                        // console.log(vm.jobroleandmod);
                        // console.log(doc);
                        // console.log(data)
                        var ids_comps=doc['dashboard']['signoffstatus']['ids_comps'].split(',') ;
                        var ids_ppl=doc['dashboard']['signoffstatus']['ids_ppl'].split(',')
                        var names_comps=doc['dashboard']['signoffstatus']['names_comps'].split(',')
                        var names_ppl=doc['dashboard']['signoffstatus']['names_ppl'].split(',');

                        
                        var index = ids_comps.indexOf(data.comp_id);
                        var index2 = ids_ppl.indexOf(data.ppl_id);
                        var indexval;
                        if(index==index2){
                            indexval=index;
                        }
                        else if(data.comp_id==ids_comps[index2]){
                            indexval=index2;
                        }
                        else{
                            indexval=index;
                        }
                        if (index > -1) {
                            ids_comps.splice(index, 1);
                            ids_ppl.splice(index, 1);
                            names_comps.splice(index, 1);
                            names_ppl.splice(index, 1);

                        }
                        var count=ids_comps.length;
                       console.log(ids_comps,ids_ppl,names_comps,names_ppl,"signoff");
                       doc['dashboard']['signoffstatus']['ids_comps']=ids_comps.join();
                       doc['dashboard']['signoffstatus']['ids_ppl']=ids_ppl.join(',')
                       doc['dashboard']['signoffstatus']['names_comps']=names_comps.join(',');
                       doc['dashboard']['signoffstatus']['names_ppl']=names_ppl.join(',');
                       doc['dashboard']['signoffstatus']['comps_count']=count;
                        return doc;
                    }
    
                    vm.localDB.upsert(doc_name, detailedDocfunc).then(function() {
                        resolve('success')
                    }).catch(function(err) {
                        reject(err)
                    });
                })
    
            }
            vm.isEmpty = function(obj) {
                for(var key in obj) {
                    if(obj.hasOwnProperty(key))
                        return false;
                }
                return true;
            }
            vm.putPouchsignoffDoc = function(data,idObj,doc_name){
                return new Promise(function(resolve, reject) {
                    vm.localDB = new PouchDB("Swifttrack", {
                        revs_limit: 2
                    });
                    // Do async job
                    function detailedDocfunc(doc) {

                        if(vm.isEmpty(doc)){
                            var doc={
                                "org_usr": data.org_usr,
                                "login_user": data.login_user,
                                "login_type": data.login_type,
                                "competencies":new Object(),
                               }        
                        }

                        doc.competencies[idObj.comp_id]={
                            "p_id":idObj.ppl_id,
                            "c_id":idObj.comp_id,
                            "msg":idObj.msg
                            }
                        // doc = obj;
                        return doc;
                    }
    
                    vm.localDB.upsert(doc_name, detailedDocfunc).then(function() {
                        resolve('success')
                    }).catch(function(err) {
                        reject(err)
                    });
                })
            }
    

//header function start here

        vm.headerimagefunction = function() {
            if (vm.userdetails !== undefined && vm.userdetails !== null) {
                vm.userImageUrl = vm.userdetails.images;
                //console.log(vm.userImageUrl);
                vm.userFirstName = vm.userdetails.first_name;
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
    }

    angular.module('swiftTrack.signoff')
        .controller('signoffCtrl', signoffCtrl);
        signoffCtrl.$inject = ['SyncService','NetworkInformation','SignoffService','$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory', '$filter'];

    

 }());