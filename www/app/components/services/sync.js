(function() {
    function ModuleService(Pouchfactory,Request, Constants, $q,$cookieStore) {
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
                console.log('api call json');
                vm.url = 'json/job.json';
            }

            return vm.localDB.get('saveAPIdata').then(function(resp1){//--getting pouch assessment save data
                return vm.localDB.get('post_jsonobject').then(function(resp2){//--gettting pouch config data
                    console.log(resp2);
                    resp2.indicators=resp1.indicators;
                    resp2.sessionkey=$cookieStore.get('sessionkey')
                    return Request.post(vm.saveassessAPIurl, resp2).then(function(resp) {   //--sending assessment save data to server
                        SignoffService.sendsignoffdata().then(function(){           //sending signoff data
                            SignoffService.fetchfulldata().then(function(val){      //--fetching swifttrack full data
                                SignoffService.putDataPouch(val).then(function(){   //--saving full data in detailed document in pouch
                                    
                                })
                            })
                        })
                        console.log(resp,"response from assessment service")
                        vm.defered = $q.defer();
                        vm.defered.resolve(resp);
                        return vm.defered.promise;
                    });
                });
            })
            
        };
       
    }

    angular.module('swiftTrack.assessment')
        .service('ModuleService', ModuleService)
    ModuleService.$inject = ['Pouchfactory','Request', 'Constants', '$q','$cookieStore'];
}())
