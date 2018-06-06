(function() {
    // 'use strict';

    function signoffCtrl(SyncService,NetworkInformation,SignoffService,$state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, $filter) {
        console.log('signoff controller')
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
                            $cookieStore.put("ChangesBoolean", true);
                            angular.element($event.target).parents('.textbox').find('.report').html(templateoffline);
                            angular.element($event.target).hide();
                        }

                    })
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
                console.log(vm.userImageUrl);
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