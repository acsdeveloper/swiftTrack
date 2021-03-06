(function() {
    function signoffservice(LoginService,Loader,downloadfileService,Pouchfactory,Request, Constants, $q,$cookieStore) {
        var vm = this;
        vm.localDB = new PouchDB("Swifttrack", {
            revs_limit: 2
        });

        vm.get_org_config_signoff = function(obj)
        {
            if (Constants.productionServer) {
                vm.docname ='detailed_document';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.docname ='detailed_document';
            vm.data='org_config'
            // vm.object=obj;

            return Pouchfactory.get(vm.docname,vm.data).then(function(resp) {
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });

        }




        vm.getpost_jsonobject=function(){
            vm.docname ='post_jsonobject';
            vm.data=''
            // vm.object=obj;

            return Pouchfactory.get(vm.docname,vm.data).then(function(resp) {
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });
        }
        vm.sendsignoffdata=function(){
            console.log('track3')
            vm.localDB = new PouchDB("Swifttrack", {
                revs_limit: 2
            });
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/swiftMobile/api/signOff.php';
            }
            else {
                //console.log('api call json');
                vm.url = 'json/job.json';
            }
            Loader.startLoading();
            return vm.localDB.get('signoffdata').then(function(data){
                data.sessionkey=$cookieStore.get('sessionkey')
                return Request.post(vm.url, data).then(function(resp) {
                    Loader.stopLoading();
                    vm.defered = $q.defer();
                    vm.defered.resolve(resp);
                    return vm.defered.promise;
                });
            })
        }

        vm.putDataPouch = function(data){
            return new Promise(function(resolve, reject) {
                vm.localDB = new PouchDB("Swifttrack", {
                    revs_limit: 2
                });
                // Do async job
                function detailedDocfunc(doc) {
                    doc = data;
                    return doc;
                }

                vm.localDB.upsert('detailed_document', detailedDocfunc).then(function() {
                    resolve('success')
                }).catch(function(err) {
                    reject(err)
                });
            })

        }
                
        vm.fetchfulldata = function() {
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/swiftMobile/api/swiftTrackAll.php';
            }
            else {
                //console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.docname ='post_jsonobject';
            vm.data=''
            // vm.object=obj;
           console.log('last cahance')
             return Pouchfactory.get(vm.docname,vm.data).then(function(data) {
                 //console.log(data);
                 data.sessionkey=$cookieStore.get('sessionkey');
                //  Loader.startLoading();
                return Request.post(vm.url,data).then(function(resp) {
                    return LoginService.putDataPouch(resp,'detailed_document').then(function(){
                        console.log(resp)
                        // Loader.stopLoading();
                        downloadfileService.assessmentmediadownload(resp)
                        //console.log(resp)
                        vm.defered = $q.defer();
                        vm.defered.resolve(resp);
                        return vm.defered.promise;
                    })
 
                });

            });
        };
        
    }

    angular.module('swiftTrack.signoff')
        .service('SignoffService', signoffservice)
        signoffservice.$inject = ['LoginService','Loader','downloadfileService','Pouchfactory','Request', 'Constants', '$q','$cookieStore'];
}())
