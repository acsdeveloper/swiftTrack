(function() {
    'use strict';

    function MainCtrl($state, storageFactory, $cookieStore) {
        //console.log('test login',localStorage.getItem("loginAuth"))

        if (localStorage.getItem("loginAuth")=='true') {
            //console.log('err')
            //call api for verify auth
            storageFactory.login(true);
            $state.go('dashboard');
            // call user details api in success function
        }
        else {
            //console.log('succ')
            storageFactory.login(null);
            $state.go('login');
        }


    }
    angular.module('swiftTrack.controllers', [])
        .controller('MainCtrl', MainCtrl);
    MainCtrl.$inject = ['$state', 'storageFactory', '$cookieStore'];
}())
