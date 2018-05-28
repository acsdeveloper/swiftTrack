(function() {
    function ModuleService(Pouchfactory,Request, Constants, $q) {
        var vm = this;
        vm.data = {};


        vm.ModuledetailsPouch = function(obj) {
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/api/assessment_api.php';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.object = obj;

            return Request.post(vm.url, vm.object).then(function(resp) {
                console.log(resp,"response from assessment service")
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });
        };
        // vm.ModuledetailsPouch = function(obj) {
        //     if (Constants.productionServer) {
        //         vm.url = Constants.baseUrl + '/api/assessment_api.php';
        //     }
        //     else {
        //         console.log('api call json');
        //         vm.url = 'json/job.json';
        //     }
        //     vm.object = obj;
        //     vm.docname ='detailed_document';
        //     vm.data='assessment'
        //     return Pouchfactory.get(vm.docname,vm.data).then(function(resp) {
        //         console.log(resp)
        //         vm.defered = $q.defer();
        //         vm.defered.resolve(resp[vm.object.jr_id][vm.object.m_id]);
        //         return vm.defered.promise;
        //     });
        // };

    }

    angular.module('swiftTrack.assessment')
        .service('ModuleService', ModuleService)
    ModuleService.$inject = ['Pouchfactory','Request', 'Constants', '$q'];
}())
