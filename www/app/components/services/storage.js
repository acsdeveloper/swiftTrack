(function() {
    'use strict';

    function storageFactory() {
        var loginValue = null,
            userdetails = null,
            usrdtl = null,
            JobAndMod = null,
            userId = null,
            signoffdata=null,
            changesinsignoff=null,
            dashboarddetailsresponse = null;


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
            setdashboarddetailsresponse: function(object) {
                dashboarddetailsresponse = object;
            },
            getdashboarddetailsresponse: function() {
                return dashboarddetailsresponse;
            },
            setSignoffData:function(data){
                signoffdata=data;
            },
            getSignoffData : function(){
                return signoffdata;
            },
            getchangessignoff:function(){
                return changesinsignoff;
            },
            setchangessignoff:function(data){
                changesinsignoff=data
            },
            clearAllStorage: function() {
                loginValue = null;
                userdetails = null;
                usrdtl = null;
                JobAndMod = null;
                userId = null;
                changesinsignoff=null;
                dashboarddetailsresponse = null;
                signoffdata = null;
                
            }

        };
    }

    angular.module('swiftTrack.storageFactory', [])
        .factory('storageFactory', storageFactory);
    storageFactory.$inject = [];

}())
