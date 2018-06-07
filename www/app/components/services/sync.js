(function() {
    function SyncService(Loader,Pouchfactory,Request, Constants, $q,$cookieStore) {
        var vm = this;
        vm.data = {};

        vm.localDB = new PouchDB("Swifttrack", {
            revs_limit: 2
        });
        vm.saveAPIOnline = function() {

            if (Constants.productionServer) {
                vm.saveassessAPIurl = Constants.baseUrl + '/swiftMobile/api/save-session-data.php';
            }
            else {
                //console.log('api call json');
                vm.url = 'json/job.json';
            }

            return vm.localDB.get('saveAPIdata').then(function(resp1){//--getting pouch assessment save data
                return vm.localDB.get('post_jsonobject').then(function(resp2){//--gettting pouch config data
                    //console.log(resp2);
                    resp2.indicators=resp1.indicators;
                    resp2.sessionkey=$cookieStore.get('sessionkey');
                    Loader.startLoading();
                    return Request.post(vm.saveassessAPIurl, resp2).then(function(resp) {   //--sending assessment save data to server
                        
                        SignoffService.sendsignoffdata().then(function(){           //sending signoff data
                            SignoffService.fetchfulldata().then(function(val){      //--fetching swifttrack full data
                                Loader.stopLoading();
                                SignoffService.putDataPouch(val).then(function(){   //--saving full data in detailed document in pouch
                                    
                                })
                            })
                        })
                        //console.log(resp,"response from assessment service")
                        vm.defered = $q.defer();
                        vm.defered.resolve(resp);
                        return vm.defered.promise;
                    });
                });
            })
            
        };
        vm.logout=function(){
            if (Constants.productionServer) {
                vm.logoutUrl = Constants.baseUrl + '/swiftMobile/api/logout.php';
            }
            else {
                //console.log('api call json');
                vm.url = 'json/job.json';
            }
           
            return vm.localDB.get('post_jsonobject').then(function(postobj){
                return vm.localDB.get('localdata').then(function(localobj){
                    postobj['id']=localobj.id;
                    postobj['sessionkey']=localobj.sessionkey;
                    Loader.startLoading();
                    return Request.post(vm.logoutUrl, postobj).then(function(resp) {   //--sending assessment save data to server
                        $cookieStore.remove('sessionkey');
                        console.log('removed session');
                        $cookieStore.remove('sessionkey');
                        Loader.stopLoading();
                        if(resp.status=='success'){
                            vm.localDB.allDocs().then(function (result) {
                                //console.log(result)
                                // Promise isn't supported by all browsers; you may want to use bluebird
                                return Promise.all(result.rows.map(function (row) {
                                  return vm.localDB.remove(row.id, row.value.rev);
                                }));
                              }).then(function () {
                                  //console.log('done')
                                // done!
                              }).catch(function (err) {
                                  //console.log(err)
                                // error!
                              });
                            // vm.localDB.destroy().then(function (response) {
                            //     //console.log(response)
                            //     // database destroyed
                            //   }).catch(function (err) {
                            //       //console.log(err)
                            //     // error occurred
                            //   })
                        }
                        //console.log(resp,"response from assessment service")
                        vm.defered = $q.defer();
                        vm.defered.resolve(resp);
                        return vm.defered.promise;
                    });
                })
                });
    
        }
       
    }

    angular.module('swiftTrack.controllers')
        .service('SyncService', SyncService)
        SyncService.$inject = ['Loader','Pouchfactory','Request', 'Constants', '$q','$cookieStore'];
}())
