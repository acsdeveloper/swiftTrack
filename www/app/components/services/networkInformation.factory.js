(function () {
    'use strict';
    angular.module('swiftTrack.networkInformation', [])
        .factory('NetworkInformation', function ($cordovaNetwork) {
            
            return {
                  isOnline: function () {
                    if (navigator.connection) {
                        var networkState = navigator.connection.type;
                        var isOnline = $cordovaNetwork.isOnline();
                        if (isOnline) {
                            return true;
                        } else {
                            // device has internet connection
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                    
                // getNetwork: function () {
                //     return navigator.connection.type;
                //   },
            
                //   isOnline: function () {
                //     var networkState = navigator.connection.type;
                //     console.log(networkState,"network");
                //     var s= true;
                //     return s;
                // },
            
                //   isOffline: function () {
                //     var networkState = navigator.connection.type;
                //     return networkState === Connection.UNKNOWN || networkState === Connection.NONE;
                //   }
            };
        
        });
}());

