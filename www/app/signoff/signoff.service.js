(function() {
    function ModuleService(Pouchfactory,Request, Constants, $q) {
        var vm = this;
        vm.data = {};
   
   
    }

    angular.module('swiftTrack.signoffpage')
        .service('ModuleService', ModuleService)
    ModuleService.$inject = ['Pouchfactory','Request', 'Constants', '$q'];
}())
