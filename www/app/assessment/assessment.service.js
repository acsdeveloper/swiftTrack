(function() {
    function ModuleService(Request, Constants, $q) {
        var vm = this;
        vm.data = {};


        vm.ModuledetailsAjax = function(obj) {
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/api/assessment_api.php';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.object = obj;

            return Request.post(vm.url, vm.object).then(function(resp) {
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });
        };

    }

    angular.module('swiftTrack.assessment')
        .service('ModuleService', ModuleService)
    ModuleService.$inject = ['Request', 'Constants', '$q'];
}())
