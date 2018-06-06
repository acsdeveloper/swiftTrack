(function() {
    function LoginService(Request, Constants, $q,$cookieStore) {
        var vm = this;
        vm.data = {};

        vm.loginAjax = function(object) {
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/swiftMobile/api/loginorg.php';
            }
            else {
                console.log('api call json');
                vm.url = '/json/job.json';
            }

            vm.data["params"] = object;

            return Request.post(vm.url, vm.data).then(function(resp) {
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });
        };
        vm.fetchfulldata = function(obj) {
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/swiftMobile/api/swiftTrackAll.php';
            }
            else {
                console.log('api call json');
                vm.url = 'json/job.json';
            }
            obj.sessionkey=$cookieStore.get('sessionkey');
            vm.object=obj;

            return Request.post(vm.url,vm.object).then(function(resp) {
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });
        };

    }

    angular.module('swiftTrack.login')
        .service('LoginService', LoginService)
    LoginService.$inject = ['Request', 'Constants', '$q','$cookieStore'];
}())
