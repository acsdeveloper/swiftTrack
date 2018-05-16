(function() {
    'use strict';

    function storageFactory() {
        var loginValue = null,
            userdetails = null,
            usrdtl = null,
            JobAndMod = null,
            userId = null,
            userdetailsresponse = null;


        return {

            islogin: function() {
                return loginValue;
            },
            login: function(object) {
                console.log('login ', object);
                loginValue = object;
            },
            clearlogin: function() {
                loginValue = null;
            },
            getuserdetails: function() {
                return userdetails;
            },
            setuserdetails: function(object) {
                userdetails = object;
            },
            clearuserdetails: function() {
                userdetails = null;
            },
            getJobAndMod: function() {
                return JobAndMod;
            },
            setJobAndMod: function(object) {
                JobAndMod = object;
            },
            clearJobAndMod: function() {
                JobAndMod = null;
            },
            getuserreportid: function() {
                return userId;
            },
            setuserreportid: function(object) {
                userId = object;
            },
            clearuserresportid: function() {
                userId = null;
            },
            setuserdetailsresponse: function(object) {
                userdetailsresponse = object;
            },
            getuserdetailsresponse: function() {
                return userdetailsresponse;
            },
            clearAllStorage: function() {
                loginValue = null;
                userdetails = null;
                usrdtl = null;
                JobAndMod = null;
                userId = null;
                userdetailsresponse = null;
                
            }

        };
    }

    angular.module('swiftTrack.storageFactory', [])
        .factory('storageFactory', storageFactory);
    storageFactory.$inject = [];

}())
