/*global angular*/
/*global localStorage*/
(function() {
    'use strict';
    angular.module('swiftTrack.pouchservice', [])
        .factory("Pouchfactory", function($http, $q, Loader, $ionicPopup) {
            
            return {
                get: function(docname,data,callback) {
                    var localDB = new PouchDB("Swifttrack",{revs_limit: 2});
                    var cb = callback || angular.noop;
                    var deferred = $q.defer();
                    localDB.get(docname).then(function(value){
                        Loader.stopLoading();
                        if(data!==undefined && data!=''){
                            deferred.resolve(value[data]);
                            return cb(value[data]);
                        }
                        else{
                            deferred.resolve(value);
                            return cb(value);
                        }
                       
                    })
                    return deferred.promise;
                },
            }
        })
    // .config(['$httpProvider', function($httpProvider) {
    //     $httpProvider.interceptors.push('AuthInterceptor');
    // }]).factory('AuthInterceptor', function(Constants, UserService) {
    //     return {
    //         request: function(config) {
    //             config.headers = config.headers || {};
    //             if (Constants.productionServer) {
    //                 /*config.headers.accountId = 1303;*/ //GIANNSSO
    //                 /*config.headers.accountId = 1617;*/ //Andrew Jose
    //                 /*config.headers.accountId = 2023;*/ //to get booking details
    //                 if (UserService.isLoggedIn()) {
    //                     var authDetails = JSON.parse(localStorage.getItem('authDetails'));
    //                     config.headers.authToken = authDetails.authToken;
    //                 }
    //                 config.headers.apiKey = Constants.apiKey;
    //                 config.headers.accountId = Constants.accountId;
    //             }
    //             config.headers['Content-Type'] = 'application/json';
    //             //config.timeout = 10000;
    //             return config;
    //         }
    //     };
    // });
}());
