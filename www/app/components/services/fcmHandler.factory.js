(function () {
	'use strict';
	angular.module('swiftTrack.fcmhandler', [])
		.factory('FCMHandler', function (Constants,Request,$state,$rootScope) {
				return {
					getFCMToken : function(){
						var self = this;
						FCMPlugin.getToken(function(token){
							console.log("token",token);
								if(null === token || 'null' === token || '' === token){
									self.getFCMToken(function () {
										// do nothing
									});
								}else{
									self.sendFCMTokenToServer(token);
								}
							},function(err){
							//	console.log('error retrieving token: ' + err);
								self.getFCMToken(function () {
									// do nothing
								});
							}
						);
					},

					handleNotification : function(){
						FCMPlugin.onNotification(
							function(data){
								console.log("notification data",data);
								var notificationData = JSON.parse(localStorage.getItem("notifications"));
								if(null === notificationData || 'null' === notificationData){
									notificationData = [];
								}
								if(ionic.Platform.platform().match(/ios/)){
									var content = {
										title : data.aps.alert.title,
										body : data.aps.alert.body,
										time : new Date().getTime()
									}
								}else{
									var content = {
										title : data.title,
										body : data.body,
										time : new Date().getTime()
									}
								}
								notificationData.push(content);
								localStorage.setItem("notifications", JSON.stringify(notificationData));
								if(data.wasTapped){
									//Notification was received on device tray and tapped by the user.
									console.log("received");
									$state.go('app.notifications');
								}else{
									//Notification was received in foreground. Maybe the user needs to be notified.
									$rootScope.$broadcast('NOTIFICATION_RECEIVED');
									console.log("foreground");
								}
							},
							function(msg){
								console.log('onNotification callback successfully registered: ' + msg);
							},
							function(err){
								console.log('Error registering onNotification callback: ' + err);
							}
						);
					},

					sendFCMTokenToServer : function (fcmtoken) {
						var url = Constants.baseUrl + 'device/updatetoken';
						var data = {token: fcmtoken};
						return Request.post(url, data).then(function (resp) {
							// do nothing
						});
					}
				};
			}
		);
})();
