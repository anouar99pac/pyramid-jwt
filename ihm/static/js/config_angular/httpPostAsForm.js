//configuration par defaut de httpProvider
//permet de transformer la data envoyé en post comme ci envoyée à partir d'un formulaire
angular.module('httpPostAsForm', [])
.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  $httpProvider.defaults.transformRequest.unshift(function (obj) {
     var str = [];
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  });
}]);
