'use strict';
var conduit = {};

// Import variables if present (from env.js)
if(window){
    Object.assign(conduit, window.conduit);
}
angular.module('iglue.conduit',['ngResource'])
    .constant('__env', conduit)
    .factory('$conduit', ['$resource','$window','$q','__env',function ($resource, $window, $q, __env) {
        var conduit =  {
            sessionStorage:function(name){
                return {
                    get:function () {
                        var storage = angular.fromJson(sessionStorage[name]);
                        if(!storage){
                            storage = {};
                        }
                        return storage;
                    },
                    save:function (data) {
                        sessionStorage[name] = angular.toJson(data);
                    },
                    remove:function () {
                        sessionStorage[name] = null;
                    }
                }
            },
            localStorage:function(name){
                return {
                    get:function () {
                        var storage = angular.fromJson($window.localStorage.getItem(name));
                        if(!storage){
                            storage = {};
                        }
                        return storage;
                    },
                    save:function (data) {
                        $window.localStorage.setItem(name,angular.toJson(data));
                    },
                    remove:function () {
                        $window.localStorage.removeItem(name);
                    }
                }
            },
            createMongoFlow:function(endpoint,database){
                var context = {
                    'template':'mongo_crud.json',
                    'databaseName':database,
                    'flowName':endpoint,
                    'collectionName':endpoint
                };
                var deferred = $q.defer();
                $resource( __env.base_url + 'conduit/flows/template', {}, {}).save(context,function(data){
                    deferred.resolve(conduit.collection(endpoint));
                });
                return deferred.promise;
            },
            collection:function(flowname,context){
                var endpoint = __env.base_url + 'conduit/rest/' + flowname ;
                if(context){
                    endpoint += "/action/" + context;
                }
                return {

                    get:function (params) {
                        if(!params){
                            params = {};
                        }
                        var deferred = $q.defer();
                        $resource( endpoint, {}, {}).get(params,function(data){
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    },
                    getById:function (id) {
                        var deferred = $q.defer();
                        $resource( endpoint + '/' + id + '/?', {}, {}).get({id: this.id},function(data){
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    },
                    post:function(params){
                        var deferred = $q.defer();
                        $resource( endpoint, {}, {}).save(params,function(data){
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    },
                    save:function (params) {
                        return this.post(params);
                    },
                    remove:function (id) {
                        var deferred = $q.defer();
                        $resource( endpoint +'/'  + id , {}, {}).remove({id: this.id},function(data){
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    }
                }
            }
        };
        return conduit;
}]);
