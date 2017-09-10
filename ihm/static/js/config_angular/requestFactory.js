//requetes pouvant etre avortée
angular.module("RequestsFactory",[]).factory("RequestManager", function($http, $q){
 
    var getData = function(url){
        var canceller = $q.defer();
 
        var cancel = function(reason){
            canceller.resolve(reason);
        };
 
        var promise =
            $http.get(url, { timeout: canceller.promise})
                .then(function(response){
                   return response.data;
                });
 
        return {
            promise: promise,
            cancel: cancel
        };
    };
 
    return {
        getData: getData
    };
 
});