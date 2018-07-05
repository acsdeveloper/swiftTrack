(function() {
    // 'use strict';

    function footerCtrl(footerService,SignoffService,$cordovaNetwork,$interval,SyncService,Loader, $timeout, $state, $ionicModal, $scope, $http, $location, $cookieStore, storageFactory, dashboardService, $ionicPlatform) {
   var vm=this;

   footerService.get_org_config_footer().then(function(resp){
    console.log("040718 footer ",resp);
    // vm.logourlassess =   resp.logo;
    vm.orgname  = resp.org_name;
    // console.log("vm.logourlassess",vm.logourlassess);
        })
   vm.testclick  = function (){
       console.log("footer test calling@@@@");
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

    angular.module('swiftTrack.footer')
        .controller('footerCtrl', footerCtrl);
    footerCtrl.$inject = ['footerService','SignoffService','$cordovaNetwork','$interval','SyncService','Loader', '$timeout', '$state', '$ionicModal', '$scope', '$http', '$location', '$cookieStore', 'storageFactory', 'dashboardService', '$ionicPlatform'];
}());