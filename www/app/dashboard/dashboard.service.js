(function() {
    function dashboardService(Request, Constants, $q) {
        var vm = this;
        vm.data = {};


        vm.UserdetailsAjax = function(obj) {
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/api/dashboardapi.php';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }

            vm.object=obj;

            return Request.post(vm.url,vm.object).then(function(resp) {
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });
        };
        // vm.logintestapi = function(object) {
        //     if (Constants.productionServer) {
        //         vm.url = Constants.baseUrl + 'loginorg.php';
        //     }
        //     else {
        //         console.log('api call json');
        //         vm.url = 'json/job.json';
        //     }

        //     vm.data["params"] = object;

        //     return Request.post(vm.url, vm.data).then(function(resp) {
        //         vm.defered = $q.defer();
        //         vm.defered.resolve(resp);
        //         return vm.defered.promise;
        //     });
        // };

    }

    angular.module('swiftTrack.dashboard')
        .service('dashboardService', dashboardService)
    dashboardService.$inject = ['Request', 'Constants', '$q'];
}())
