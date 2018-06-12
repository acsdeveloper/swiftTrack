(function() {
    function reportService(Loader,Pouchfactory,Request, Constants, $q) {
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
            Loader.startLoading();
            return Request.post(vm.url, vm.object).then(function(resp) {
                Loader.stopLoading();
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });
        };
        vm.get_org_name_report = function(obj) {
            if (Constants.productionServer) {
                vm.docname ='localdata';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            vm.docname ='localdata';
            vm.data='org_name'
            // vm.object=obj;

            return Pouchfactory.get(vm.docname,vm.data).then(function(resp) {
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });
        };
        vm.get_org_config_report = function(obj) {
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
    reportService.$inject = ['Loader','Pouchfactory','Request', 'Constants', '$q'];
}())
