(function() {
    function footerService(Pouchfactory,Request, Constants, $q) {
        var vm = this;
    }
    angular.module('swiftTrack.footer')
    .service('footerService', footerService)
footerService.$inject = ['Pouchfactory','Request', 'Constants', '$q'];
}())