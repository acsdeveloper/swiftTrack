(function() {
    // 'use strict';

    function statusCtrl($interval,SyncService,Loader, $timeout, $state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, dashboardService, $ionicPlatform) {

        var vm = this;
        Loader.startLoading();
        vm.init = function() {
            dashboardService.LocaldatadetailsPouch().then(function(resp){
                // Loader.stopLoading();
                vm.localdatadetails=resp;
            })

            if (!storageFactory.islogin()) {
                $state.go('login')
                return;
            }
           

            vm.usrNotBar = true;
            vm.logoutpopup = false;
            vm.competencypane = true;
            vm.peoplepane = false;
        }
        vm.init();

        vm.continuousfunction=function(){
            dashboardService.LocaldatadetailsPouch().then(function(resp){
                // Loader.stopLoading();
                vm.localdatadetails=resp;
            })
        }
        $interval(function () {
            vm.dashboardAPIcall();
        }, 60000);

        vm.goSignofPage = function(data){
            // console.log(data)
            storageFactory.setSignoffData(data);
            $state.go('signoff')
        }
        // vm.headerimagefunction = function() {
            
        //     if (vm.userdetails !== undefined && vm.userdetails !== null) {
        //         vm.userImageUrl = vm.userdetails.images;
        //         vm.userFirstName = vm.userdetails.first_name;
        //         vm.full_name = vm.userdetails.first_name + ' ' + vm.userdetails.last_name;
        //     }
        //     else {
        //         vm.userFirstName = vm.localdatadetails.first_name;
        //         vm.full_name = vm.localdatadetails.username;
        //     }

        // }
        // $scope.$watch(
        //     function($scope) {
        //         vm.userdetails = storageFactory.getuserdetails();
        //         vm.headerimagefunction();
        //     });

        vm.goreportpage = function(val) {
            vm.object = {};
            vm.object["person_id"] = val;
            storageFactory.setuserreportid(vm.object);
            $state.go('progressreport')
        }

        vm.goassessmentpage = function(jobrole, mod_id,departmentid,subDepartmentId,comp_id) {
            vm.object = {};
            vm.object["m_id"] = mod_id;
            vm.object['jr_id'] = jobrole;
            vm.object['departmentid'] = departmentid;
            vm.object['subDepartmentId'] = subDepartmentId;
            console.log(comp_id,"comp id");
            vm.object['comp_id']=comp_id;
            storageFactory.setJobAndMod(vm.object);
            $state.go('assessment');

        }
        
        vm.dashboardAPIcall = function() {
            vm.object = {};
            // vm.object["jobroleids"] = localStorage.getItem('job_role_ids');
            // vm.login_type = localStorage.getItem('login_type');
            dashboardService.DashboarddetailsPouch().then(function(resp) {
                storageFactory.setdashboarddetailsresponse(resp);
                // console.log(resp)
                vm.fullresponseData = resp;
                vm.signoffstatus = resp.signoffstatus.comps_count;
               
                if(vm.signoffstatus !== 0)
                {
                    console.log("signoff conditions ",vm.signoffstatus);
                    vm.signoffnotif = true;
                    vm.personnot = false;

                }
                else{vm.personnot = true;}
            });
        }
        vm.getlength = function(mt) {
            // console.log(mt)
            return Object.keys(mt).length;
        }

        vm.closeUsrNoti = function() {
            vm.usrNotBar = false;
        }

        vm.competencyBtn = function(key) {
            // console.log(key)
            angular.element(document.querySelector("#competencies" + key)).show();
            angular.element(document.querySelector("#people" + key)).hide();
            angular.element(event.target).parents('li').addClass('active');
            angular.element(event.target).parents('li').siblings().removeClass('active')
        }

        vm.peopleBtn = function(key) {
            // console.log(key)
            angular.element(document.querySelector("#competencies" + key)).hide();
            angular.element(document.querySelector("#people" + key)).show();
            angular.element(event.target).parents('li').addClass("active");
            angular.element(event.target).parents('li').siblings('li').removeClass("active");

        }
        vm.progressreport = function(key) {
            angular.element(document.querySelector("#competencies" + key)).hide();
            angular.element(document.querySelector("#myprogressreport" + key)).show();
            angular.element(event.target).parents('li').addClass("active");
            angular.element(event.target).parents('li').siblings('li').removeClass("active");
        }
        vm.clearspace = function(key) {
            return key.split(' ').join('')
        }

        angular.element(document).ready(function() {
            dashboardService.LocaldatadetailsPouch().then(function(resp){
                vm.localdatadetails=resp;
                storageFactory.setuserdetails(resp);
                // console.log("ck test ",resp);
                vm.login_type = vm.localdatadetails.login_type;
                // console.log(vm.login_type,"login type test")
                $timeout(function() {
                    vm.dashboardAPIcall();
                }, 300);
            })
            // console.log(storageFactory.getdashboarddetailsresponse(), "null")
            // if (storageFactory.getdashboarddetailsresponse() == null) {
               
            // }
            // else {
            //     vm.fullresponseData = storageFactory.getdashboarddetailsresponse();
            //     Loader.stopLoading();
            // }

        });

        //header
        vm.headerimagefunction = function() {
            if (vm.userdetails !== undefined && vm.userdetails !== null) {
                vm.userImageUrl = vm.userdetails.images; 
                // console.log(vm.userImageUrl);
                vm.userFirstName = vm.userdetails.first_name;
            }
            else{

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
            vm.logoutpopup = $scope.logoutpopup ? false : true;
        }
        vm.cancellogout = function() {
            vm.logoutpopup = false;

        }
       
        vm.confirmlogout = function(event) {
            SyncService.logout().then(function(){
                $state.go('login')
            })
            storageFactory.clearAllStorage()
            event.preventDefault();
            event.stopPropagation();
            storageFactory.login(null);
            $cookieStore.remove('loginAuth');
            localStorage.setItem("loginAuth", false);

            // localStorage.removeItem("first_name");
            // localStorage.removeItem("images");
            vm.logoutpopup = false;
           
        }

    }





    angular.module('swiftTrack.dashboard')
        .controller('dashboardCtrl', statusCtrl);
    statusCtrl.$inject = ['$interval','SyncService','Loader', '$timeout', '$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory', 'dashboardService', '$ionicPlatform'];
}());
