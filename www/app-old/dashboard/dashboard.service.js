(function() {
    function dashboardService(Pouchfactory,Request, Constants, $q) {
        var vm = this;
        vm.data = {};


        vm.DashboarddetailsPouch = function(obj) {
            if (Constants.productionServer) {
                vm.docname ='detailed_document';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.docname ='detailed_document';
            vm.data='dashboard'
            // vm.object=obj;

            return Pouchfactory.get(vm.docname,vm.data).then(function(resp) {
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
    dashboardService.$inject = ['Pouchfactory','Request', 'Constants', '$q'];
}())
