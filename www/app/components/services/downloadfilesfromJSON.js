(function() {
    function downloadfileService(storageFactory,Pouchfactory, Request, Constants, $q, $cookieStore) {
        var vm = this;

        vm.assessmentmediadownload = function(response) {

            var logofulurl = response.org_config.logo;
            var logfn = logofulurl.substring(logofulurl.lastIndexOf('/')+1);
            var encodlogourl = encodeURI(logofulurl); 
            vm.downloadImage( encodlogourl,logfn);
            //download assessor image
            var furl = storageFactory.getuserdetails().images;

            var fn = furl.substring(furl.lastIndexOf('/')+1);
            var encodurl = encodeURI(furl); 
            //console.log(furl,fn)
            vm.downloadImage( furl,fn);


            //people image from report api
            var reportpage = response.report;
            Object.keys(reportpage).map(function(key, index) {
                //console.log(reportpage[key].image);
                var mediafullurl = reportpage[key].image;
                var filename = mediafullurl.substring(mediafullurl.lastIndexOf('/')+1);
                var encodedmediaurl = encodeURI(mediafullurl); 
                vm.downloadImage(encodedmediaurl,filename);
            })

            //resource data from assessment API
            var resourcesection = response.assessment[Object.keys(response.assessment)[0]][Object.keys(response.assessment[Object.keys(response.assessment)[0]])[0]].resources;
            Object.keys(resourcesection).map(function(key, index) {
                Object.keys(resourcesection[key].resource_sections).map(function(key1, index1) {
                    var mediafullurl2 = resourcesection[key].resource_sections[key1].item_media;
                    var mediafullurl1=mediafullurl2.split('/')[mediafullurl2.split('/').length-1]
                    mediafullurl="https://swifttrack-agilexcyber.c9users.io/orgs/foo-3094kf304fk30kafskjfk3493ja0324r/media/resources/"+mediafullurl1
                    var filename = mediafullurl.substring(mediafullurl.lastIndexOf('/') + 1);
                    // console.log(mediafullurl,filename,"testers test")
                    vm.downloadImage(mediafullurl, filename)
                })
            })

            //media data from assessment API
            Object.keys(response.assessment).map(function(key, index) {
                Object.keys(response.assessment[key]).map(function(key1, index1) {
                    Object.keys(response.assessment[key][key1]).map(function(key2, index2) {
                        if (key2 == 'people' || key2 == 'resources') {
                            if (key2 == 'people') {
                                Object.keys(response.assessment[key][key1][key2]).map(function(key3, index3) {
                                    Object.keys(response.assessment[key][key1][key2][key3].indicators).map(function(key3a, index3a) {
                                        Object.keys(response.assessment[key][key1][key2][key3].indicators[key3a]).map(function(key3b, index3b) {
                                            if (key3b == 'type_ref') {
                                                Object.keys(response.assessment[key][key1][key2][key3].indicators[key3a][key3b]).map(function(key3c, index3c) {
                                                    if (key3c == 'media' || key3c == 'pdf') {
                                                        Object.keys(response.assessment[key][key1][key2][key3].indicators[key3a][key3b][key3c]).map(function(key3d, index3d) {
                                                            response.assessment[key][key1][key2][key3].indicators[key3a][key3b][key3c].data_ev.split(',').map(function(a) {
                                                                // console.log(a,"download test url")
                                                                return vm.mediares(a);
                                                            })
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    })
                                })
                            }
                        }
                    })
                })
            })
        }
        vm.mediares = function(a) {
            var name=a.split('/')[a.split('/').length-1];

            var comfileurl = "https://swifttrack-agilexcyber.c9users.io/orgs/foo-3094kf304fk30kafskjfk3493ja0324r/media/" + name;
            var encodedmediaurl = encodeURI(comfileurl);
            var filename = comfileurl.substring(comfileurl.lastIndexOf('/') + 1);
            vm.downloadImage(encodedmediaurl, filename);
        }

        vm.downloadImage = function(uri, name) {
            var ft = new FileTransfer();
            var targetPath = cordova.file.externalApplicationStorageDirectory + "files/" + name;
            var path = cordova.file.externalApplicationStorageDirectory + "files/";
            vm.videolocallocation = targetPath;
            var filename = name;
            window.resolveLocalFileSystemURL(path + filename, onSuccess, onFail);

            function onSuccess() {
                //console.log(" This file exists");
            }

            function onFail() {
                ft.download(uri, targetPath, function(entry) {
                        //console.log(entry);
                        //console.log("download complete: " + entry.fullPath);
                    },
                    function(error) {
                        //console.log("error");
                        //console.log(error);
                        //console.log("download error" + error.code);
                    }
                );
                //console.log('----------Sorry! File not Found');
            }

        }
    }

    angular.module('swiftTrack.controllers')
        .service('downloadfileService', downloadfileService)
        downloadfileService.$inject = ['storageFactory','Pouchfactory', 'Request', 'Constants', '$q', '$cookieStore'];
}())