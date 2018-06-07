(function() {
    function ModuleService(LoginService,Loader,downloadfileService,Pouchfactory,Request, Constants, $q,$cookieStore) {
        var vm = this;
        vm.data = {};

        vm.localDB = new PouchDB("Swifttrack", {
            revs_limit: 2
        });
        vm.saveAPIOnline = function() {
            vm.localDB = new PouchDB("Swifttrack", {
                revs_limit: 2
            });
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/swiftMobile/api/save-session-data.php';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }

            return vm.localDB.get('saveAPIdata').then(function(resp1){
                return vm.localDB.get('post_jsonobject').then(function(resp2){
                    console.log(resp2);
                    resp2.indicators=resp1.indicators;
                    resp2.sessionkey=$cookieStore.get('sessionkey')
                    Loader.startLoading();
                    return Request.post(vm.url, resp2).then(function(resp) {
                        Loader.stopLoading();
                        console.log(resp,"response from assessment service")
                        vm.defered = $q.defer();
                        vm.defered.resolve(resp);
                        return vm.defered.promise;
                    });
                });
            })
            
        };
        vm.fetchfulldata = function() {
            
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/swiftMobile/api/swiftTrackAll.php';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.docname ='post_jsonobject';
            vm.data=''
            // vm.object=obj;

             return Pouchfactory.get(vm.docname,vm.data).then(function(data) {
                 console.log(data);
                 data.sessionkey=$cookieStore.get('sessionkey');
                 Loader.startLoading();
                return Request.post(vm.url,data).then(function(resp) {
                    return LoginService.putDataPouch(resp,'detailed_document').then(function(){
                    Loader.stopLoading();
                    downloadfileService.assessmentmediadownload(resp);
                    console.log(resp)
                    vm.defered = $q.defer();
                    vm.defered.resolve(resp);
                    return vm.defered.promise;

                    });
                });

            });
        };
        vm.ModuledetailsPouch = function(obj) {
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/api/assessment_api.php';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.object = obj;
            vm.docname ='detailed_document';
            vm.data='assessment'
            return Pouchfactory.get(vm.docname,vm.data).then(function(resp) {
                console.log(resp)
                vm.defered = $q.defer();
                vm.defered.resolve(resp[vm.object.jr_id][vm.object.m_id]);
                return vm.defered.promise;
            });
        };
        vm.ReportdetailsPouch = function(obj) {
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/api/assessment_api.php';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.object = obj;
            vm.docname ='detailed_document';
            vm.data='report'
            return Pouchfactory.get(vm.docname,vm.data).then(function(resp) {
                console.log(resp)
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });
        };
        vm.LocaldatadetailsPouch = function(obj) {
            if (Constants.productionServer) {
                vm.docname ='detailed_document';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.docname ='localdata';
            vm.data=''
            // vm.object=obj;

            return Pouchfactory.get(vm.docname,vm.data).then(function(resp) {
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });
        };

        vm.callpouch = function() {
            
            vm.defered = $q.defer();
            vm.defered.resolve();
            return vm.defered.promise;
        }

    }

    angular.module('swiftTrack.assessment')
        .service('ModuleService', ModuleService)
    ModuleService.$inject = ['LoginService','Loader','downloadfileService','Pouchfactory','Request', 'Constants', '$q','$cookieStore'];
}())
