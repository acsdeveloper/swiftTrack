(function() {
    // 'use strict';

    function statusCtrl($state, $ionicModal, $scope, $http, $location, $cookieStore, LoginService, storageFactory) {

        var vm = this;
        vm.showloader = false;
        vm.localDB = new PouchDB("Swifttrack",{revs_limit: 2});
        if (storageFactory.islogin()) {
            $state.go('dashboard')
            return;
        }
        vm.shouldBeOpen = true;
        vm.login = function() {
            vm.errormessage = "";
            vm.object = {};
            // 220318ck
            if (vm.isNull(vm.organisation) && vm.isNull(vm.username) && vm.isNull(vm.password)) {
                vm.errormessage = "Please Enter Your Login Credentials"
            }
            //end
            else if (vm.isNull(vm.organisation)) {
                vm.errormessage = "Please Enter Organisation Name"
            }
            else if (vm.isNull(vm.username)) {
                vm.errormessage = "Please Enter Username"
            }
            else if (vm.isNull(vm.password)) {
                vm.errormessage = "Please Enter Password"
            }
            else {
                vm.object["org"] = vm.organisation;
                vm.object["username"] = vm.username;
                vm.object["password"] = vm.password;
                console.log(vm.object, "ref length");
                // vm.showloader = true;
                LoginService.loginAjax(vm.object).then(function(resp) {
                    console.log(resp)
                    // console.log("ttrr", resp, typeof resp, resp.length, Array.isArray(resp))
                    if (resp.status == "success") {
                        // storageFactory.putService(resp);
                        storageFactory.login(true)
                        storageFactory.setuserdetails(resp.result[Object.keys(resp.result)]);
                        console.log(storageFactory.getuserdetails())
                        $cookieStore.put('loginAuth', true);
                        localStorage.setItem("loginAuth", true);
                        localStorage.setItem("first_name", resp.result[Object.keys(resp.result)].first_name);
                        localStorage.setItem("images", resp.result[Object.keys(resp.result)].images);
                        localStorage.setItem("job_role_ids", resp.result[Object.keys(resp.result)].job_role_ids);
                        localStorage.setItem("limited_to_people", resp.result[Object.keys(resp.result)].limited_to_people);
                        localStorage.setItem("limited_to_mods", resp.result[Object.keys(resp.result)].limited_to_mods);
                        localStorage.setItem("login_type", Object.keys(resp.result));
                        localStorage.setItem("fullname", resp.result[Object.keys(resp.result)].username);
                        localStorage.setItem("signoff_level", resp.result[Object.keys(resp.result)].signoff_level);
                        //call user details api and put storage factory service 
                        vm.putDataPouch(resp.result[Object.keys(resp.result)],'localdata').then(function(){
                            vm.fetchfulldataAPI(resp);
                        })
                    }
                    else {
                        vm.errormessage = resp.result;
                    }
                    // vm.showloader = false;

                })

            }
        }
        vm.fetchfulldataAPI = function(resp){
            console.log(resp,"resp")
            vm.obj = {};
            vm.obj.org_usr = vm.object["org"];
            vm.obj.login_user = resp.result[Object.keys(resp.result)].username;
            vm.obj.login_type = Object.keys(resp.result)[0];
            vm.putDataPouch(vm.obj,'post_jsonobject').then(function(){
                LoginService.fetchfulldata(vm.obj).then(function(resp) {
                    vm.putDataPouch(resp,'detailed_document').then(function(){
                        $state.go('dashboard')
                    })
                });
            })
        }
        vm.putDataPouch = function(data,doc_name){
            return new Promise(function(resolve, reject) {
                // Do async job
               function detailedDocfunc(doc) {
                    doc=data;
                    return doc;
                  }
                  
                  vm.localDB.upsert(doc_name, detailedDocfunc).then(function () {
                    resolve('success')
                  }).catch(function (err) {
                    reject(err)
                  });
            })
            
        }
        vm.myFunct = function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                vm.login();
            }
        }
        vm.isNull = function(value) {
            return typeof value == 'undefined' || value == null || value == '';
        }

    }

    angular.module('swiftTrack.login')
        .controller('loginCtrl', statusCtrl);
    statusCtrl.$inject = ['$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'LoginService', 'storageFactory'];
}());
