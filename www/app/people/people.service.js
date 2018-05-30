(function() {
    function reportService(Pouchfactory,Request, Constants, $q) {
        var vm = this;
        vm.data = {};


        vm.reportpageAjax = function(obj) {
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/api/reportapi.php';
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
        vm.ReportdetailsPouch = function(obj) {
            if (Constants.productionServer) {
                vm.docname ='detailed_document';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.docname ='detailed_document';
            vm.data='report'
            // vm.object=obj;
            vm.persondata=obj.person_id
            return Pouchfactory.get(vm.docname,vm.data).then(function(resp) {
                vm.defered = $q.defer();
                console.log(vm.persondata,resp,"data")
                vm.defered.resolve(resp[vm.persondata]);
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

    }

    angular.module('swiftTrack.progressreport')
        .service('reportService', reportService)
    reportService.$inject = ['Pouchfactory','Request', 'Constants', '$q'];
}())
