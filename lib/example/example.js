'use strict';

angular.module('myApp.example', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/example', {
    templateUrl: 'example/example.html',
    controller: 'ExampleCtrl'
  });
}])

.controller('ExampleCtrl', ['$conduit',function(conduit) {
    conduit.collection("doc").get().then(function(data){
      console.log(data);
    });
}]);