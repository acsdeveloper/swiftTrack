(function() {
    function LoginService(Loader,Request, Constants, $q,$cookieStore) {
        var vm = this;
        vm.data = {};

        vm.loginAjax = function(object) {
            if (Constants.productionServer) {
                vm.url = Constants.baseUrl + '/swiftMobile/api/loginorg.php';
            }
            else {
                //console.log('api call json');
                vm.url = '/json/job.json';
            }

            vm.data["params"] = object;
            Loader.startLoading();
            return Request.post(vm.url, vm.data).then(function(resp) {
                Loader.stopLoading();
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
                //console.log('api call json');
                vm.url = 'json/job.json';
            }
            obj.sessionkey=$cookieStore.get('sessionkey');
            vm.object=obj;
            Loader.startLoading();
            return Request.post(vm.url,vm.object).then(function(resp) {
                Loader.stopLoading();
                vm.defered = $q.defer();
                vm.defered.resolve(resp);
                return vm.defered.promise;
            });
        };

    }

    angular.module('swiftTrack.login')
        .service('LoginService', LoginService)
    LoginService.$inject = ['Loader','Request', 'Constants', '$q','$cookieStore'];
}())
