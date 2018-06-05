(function() {
    function signoffservice(Pouchfactory,Request, Constants, $q) {
        var vm = this;
        vm.localDB = new PouchDB("Swifttrack", {
            revs_limit: 2
        });
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
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/swiftMobile/api/signOff.php';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }

            return vm.localDB.get('signoffdata').then(function(data){
                return Request.post(vm.url, data).then(function(resp) {
                    vm.defered = $q.defer();
                    vm.defered.resolve(resp);
                    return vm.defered.promise;
                });
            })
        }

        vm.putDataPouch = function(data){
            return new Promise(function(resolve, reject) {
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
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.docname ='post_jsonobject';
            vm.data=''
            // vm.object=obj;

             return Pouchfactory.get(vm.docname,vm.data).then(function(data) {
                 console.log(data)
                return Request.post(vm.url,data).then(function(resp) {
                    console.log(resp)
                    vm.defered = $q.defer();
                    vm.defered.resolve(resp);
                    return vm.defered.promise;
                });

            });
        };
        
    }

    angular.module('swiftTrack.signoff')
        .service('SignoffService', signoffservice)
        signoffservice.$inject = ['Pouchfactory','Request', 'Constants', '$q'];
}())
