/*global angular*/
/*global UserService*/
(function() {
    'use strict';
    angular.module('swiftTrack.userService', [])
        .service("UserService", UserService)
    UserService.$inject = ['$cookieStore']

    function UserService($cookieStore) {
        this.isLoggedIn = function() {
            /*global localStorage:false*/
            return $cookieStore.get('loginAuth') ? true : false;
        };
    }
}());
