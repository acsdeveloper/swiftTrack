(function() {
    function footerService(Pouchfactory,Request, Constants, $q) {
        var vm = this;

        vm.get_org_config_footer = function(obj) {
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
        };
    }
    angular.module('swiftTrack.footer',[])
    .service('footerService', footerService)
footerService.$inject = ['Pouchfactory','Request', 'Constants', '$q'];
}())