'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngResource',
  'ngRoute',
  'iglue.conduit',
  'myApp.example'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/example'});
  window.conduit.base_url = "http://bluntsoftware.com/glue/";
}]);
