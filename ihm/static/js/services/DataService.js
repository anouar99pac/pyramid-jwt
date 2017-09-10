/*
GetDataService
get data from URL
abort current request
We use this service if we need an HTTP synchrounous request
*/
angular.module("DataService",[]).service(
"GetDataService",["$http","$q",
function( $http, $q ) {

    // -----récupération de la data à partir de l'url
    function getData(url, data) {

        // The timeout property of the http request takes a deferred value
        // that will abort the underying AJAX request if / when the deferred
        // value is resolved.
        var deferredAbort = $q.defer();

        // Initiate the AJAX request.
        var request = $http({
            method: "get",
            url: url,
            params: data,
            headers: {
                   'Content-Type': 'json'
                },
            timeout: deferredAbort.promise
        });

        // Rather than returning the http-promise object, we want to pipe it
        // through another promise so that we can "unwrap" the response
        // without letting the http-transport mechansim leak out of the
        // service layer.
        var promise = request.then(
            function(response) {

                return(response);

            },
            function(data) {
            	//switch data.status 0, 403,404
               //message send in case request error ( we return the request status)
               //console.log(data)
               switch (data.status) {

                case 0 : {
                     return ($q.reject("concelled"));
                }break;

                // case 404: {
                //     return ($q.reject("404")) ;
                // }break;

                default: {
                    return ($q.reject("error"))
                }

               }

            }
        );
        // Now that we have the promise that we're going to return to the
        // calling context, let's augment it with the abort method. Since
        // the $http service uses a deferred value for the timeout, then
        // all we have to do here is resolve the value and AngularJS will
        // abort the underlying AJAX request.
        promise.abort = function() {

            deferredAbort.resolve();
            //console.log(deferredAbort)

        };

        // Since we're creating functions and passing them out of scope,
        // we're creating object references that may be hard to garbage
        // collect. As such, we can perform some clean-up once we know
        // that the requests has finished.
        /*promise.finally(
            function() {

                console.info( "Cleaning up object references." );

                promise.abort = angular.noop;

                //deferredAbort = request = promise = null;
                deferredAbort =request = null;

            }
        );*/

        return( promise );

    }

    // Return the public API.
    return({
        getData : getData
    });

}]);
