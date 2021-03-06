(function() {
    // 'use strict';

    function statusCtrl(Loader,$ionicPopup,downloadfileService,$state, $ionicModal, $scope, $http, $location, $cookieStore, LoginService, storageFactory) {

        var vm = this;
        vm.showloader = false;
        if($cookieStore.get('org_name')){
            vm.organisation=$cookieStore.get('org_name');
        }
               
    
        // document.addEventListener("offline", onOffline, false);

        // function onOffline() {
        //     // Handle the offline event
        //     $ionicPopup.alert({
        //         title: 'No Internet',
        //         template: 'You are in offline'
        //     }).then(function(res) {
        //         // ionic.Platform.exitApp();
        //     });
            
        // }
        vm.localDB = new PouchDB("Swifttrack", {
            revs_limit: 2
        });
        if (storageFactory.islogin()) {
            // vm.localDB.get('detailed_document').then(function (doc) {
            //     //console.log("pouchdb document",doc);
            // });
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
            } else if (vm.isNull(vm.username)) {
                vm.errormessage = "Please Enter Username"
            } else if (vm.isNull(vm.password)) {
                vm.errormessage = "Please Enter Password"
            } else {
                vm.object["org"] = vm.organisation;
                vm.object["username"] = vm.username;
                vm.object["password"] = vm.password;
                //console.log(vm.object, "ref length");
                // vm.showloader = true;
                vm.localDB = new PouchDB("Swifttrack", {
                    revs_limit: 2
                });
                //start loader here
                Loader.startLoading();
                LoginService.loginAjax(vm.object).then(function(resp) {

                    //console.log(resp)
                    // //console.log("ttrr", resp, typeof resp, resp.length, Array.isArray(resp))
                    if (resp.status == "success") {
                        // storageFactory.putService(resp);
                        storageFactory.login(true)
                        storageFactory.setuserdetails(resp.result[Object.keys(resp.result)]);

                        //console.log(storageFactory.getuserdetails())
                        $cookieStore.put('org_name', vm.object["org"]);
                        $cookieStore.put('loginAuth', true);
                        $cookieStore.put('sessionkey', resp.result[Object.keys(resp.result)].sessionkey);
                        localStorage.setItem("loginAuth", true);
                       // localStorage.setItem("first_name", resp.result[Object.keys(resp.result)].first_name);
                        // localStorage.setItem("images", resp.result[Object.keys(resp.result)].images);
                        // localStorage.setItem("job_role_ids", resp.result[Object.keys(resp.result)].job_role_ids);
                        // localStorage.setItem("limited_to_people", resp.result[Object.keys(resp.result)].limited_to_people);
                        // localStorage.setItem("limited_to_mods", resp.result[Object.keys(resp.result)].limited_to_mods);
                        // localStorage.setItem("login_type", Object.keys(resp.result));
                        // localStorage.setItem("fullname", resp.result[Object.keys(resp.result)].username);
                        // localStorage.setItem("signoff_level", resp.result[Object.keys(resp.result)].signoff_level);
                        //call user details api and put storage factory service 
                        LoginService.putDataPouch(resp.result[Object.keys(resp.result)], 'localdata').then(function() {
                            vm.fetchfulldataAPI(resp);
                        })
                    } else {
                        Loader.stopLoading();
                        vm.errormessage = resp.result;
                        // vm.errormessage = "Wrong Username/Password";
                    }
                    // vm.showloader = false;

                })

            }
        }
        vm.fetchfulldataAPI = function(resp) {
            //console.log(resp, "resp")
            vm.obj = {};
            vm.obj.org_usr = vm.object["org"];
            vm.obj.login_user = resp.result[Object.keys(resp.result)].username;
            vm.obj.login_type = Object.keys(resp.result)[0];
            LoginService.putDataPouch(vm.obj, 'post_jsonobject').then(function() {
                LoginService.fetchfulldata(vm.obj).then(function(resp) {
                    console.log("*********full response",resp);
                    storageFactory.setOrgLogo(resp.org_config.logo)
                    downloadfileService.assessmentmediadownload(resp)
                    //stop loading here
                    // Loader.stopLoading();
                    LoginService.putDataPouch(resp, 'detailed_document').then(function() {
                        $state.go('dashboard')
                    })
                });
            })
        }
    //     vm.assessmentmediadownload = function(response) {
    //         //console.log("*********** assess userImageUrl",storageFactory.getuserdetails());
    //         //console.log("*********** assess userImageUrl",storageFactory.getuserdetails().images);
    //         var furl = storageFactory.getuserdetails().images;
    //         var fn = furl.substring(furl.lastIndexOf('/')+1);
    //         var encodurl = encodeURI(furl); 
    //         vm.downloadImage( furl,fn);
    //             var reportpage = response.report;
    //             Object.keys(reportpage).map(function(key, index) {
    //                 //console.log(reportpage[key].image);
    //                 var mediafullurl = reportpage[key].image;
    //                 var filename = mediafullurl.substring(mediafullurl.lastIndexOf('/')+1);
    //                 var encodedmediaurl = encodeURI(mediafullurl); 
    //                 vm.downloadImage(encodedmediaurl,filename);
    //             })
    //             //console.log("assessment media reportpage respo",reportpage);
    //             var resourcesection = response.assessment[Object.keys(response.assessment)[0]][Object.keys(response.assessment[Object.keys(response.assessment)[0]])[0]].resources;
    //             Object.keys(resourcesection).map(function(key, index) {
    //             Object.keys(resourcesection[key].resource_sections).map(function(key1, index1) {
    //             var mediafullurl = resourcesection[key].resource_sections[key1].item_media;
    //             var filename = mediafullurl.substring(mediafullurl.lastIndexOf('/')+1);
    //             vm.downloadImage(mediafullurl,filename)
    //             // //console.log("filename testing",filename);
    //         })
    //             })
            
    //         // //console.log("myresources section for loop",resourcesection);
    //             Object.keys(response.assessment).map(function(key, index) {
    //             Object.keys(response.assessment[key]).map(function(key1, index1) {
    //             Object.keys(response.assessment[key][key1]).map(function(key2, index2) {
                
    //             if(key2 == 'people' || key2 == 'resources'){
    //             if(key2 == 'people'){
    //             Object.keys(response.assessment[key][key1][key2]).map(function(key3, index3) {
    //             Object.keys(response.assessment[key][key1][key2][key3].indicators).map(function(key3a, index3a){ 
    //             Object.keys(response.assessment[key][key1][key2][key3].indicators[key3a]).map(function(key3b, index3b){ 
    //             if(key3b == 'type_ref'){
    //             Object.keys(response.assessment[key][key1][key2][key3].indicators[key3a][key3b]).map(function(key3c, index3c){
                
    // //             if(key3c == 'media' || key3c == 'pdf'){
    // //             Object.keys(response.assessment[key][key1][key2][key3].indicators[key3a][key3b][key3c]).map(function(key3d, index3d){
               
    // //             response.assessment[key][key1][key2][key3].indicators[key3a][key3b][key3c].data_ev.split(',').map(function (a) { return vm.mediares(a); })
               

    // //             })
            
    // //             }
    // //              })
    // //             }
                
                
    // //             })
    // //             })
    // //             })
    // //             }
                
               
    //             }
    //             })
    //             })
    //             })
    //     }



    //  vm.mediares = function(a)
    //     {
    //         //console.log("mediapeople------------",a);
    //         var comfileurl = "https://swifttrack-updated-version-agilexcyber.c9users.io/orgs/foo-3094kf304fk30kafskjfk3493ja0324r"+a;
    //         var encodedmediaurl = encodeURI(comfileurl); 
    //         var filename = comfileurl.substring(comfileurl.lastIndexOf('/')+1);
    //         vm.downloadImage(encodedmediaurl,filename);
            

    //     }

    // vm.downloadImage = function(uri,name){
           
    //         var ft = new FileTransfer();
    //         var targetPath = cordova.file.externalApplicationStorageDirectory +"files/" + name;
    //         var path = cordova.file.externalApplicationStorageDirectory +"files/";
    //         vm.videolocallocation = targetPath;
    //         var filename = name;
    //         window.resolveLocalFileSystemURL(path + filename, onSuccess, onFail);
    //         function onSuccess() {
    //             //console.log("------------Great! This file exists");
    //                             }
    //         function onFail() {
    //                 ft.download(uri,targetPath,function(entry) {
    //                     //console.log(entry);
    //                     //console.log("download complete: " + entry.fullPath);
    //                 },
    //                 function(error) {
    //                     //console.log("error");
    //                     //console.log(error);
    //                     //console.log("download error" + error.code);
    //                 }
    //             );
    //                 //console.log('----------Sorry! File not Found');
    //             }    

    //     }

       


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
    statusCtrl.$inject = ['Loader','$ionicPopup','downloadfileService','$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'LoginService', 'storageFactory'];
}());