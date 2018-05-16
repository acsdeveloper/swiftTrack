/**
 * Created by Agile deVeloperS on 30/03/201.
 */
(function() {
    'use strict';
    angular.module('swiftTrack.loader', [])
        .factory('Loader', function($ionicLoading) {
            return {
                startLoading: function() {
                    $ionicLoading.show({
                        template: '<div></div>'
                    });
                },
                stopLoading: function() {
                    $ionicLoading.hide();
                },

                startLoadingMessage: function(message) {
                    $ionicLoading.show({
                        template: message
                    });
                },

                stopLoadingMessage: function() {
                    $ionicLoading.hide();
                },

                showWithPercentage: function() {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="bubbles">aaa</ion-spinner> <br/> <p>0% Uploaded..</p>'
                    });
                },

                updatePercentage: function(value) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="bubbles">aaa</ion-spinner> <br/> <p>' + value + '% Uploaded..</p>'
                    });
                }
            };
        });
})();
