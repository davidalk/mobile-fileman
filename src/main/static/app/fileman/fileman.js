'use strict';

var fileman = angular.module('myApp.fileman', ['ngRoute'])

fileman.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/fileman', {
        templateUrl: 'fileman/fileman.html',
        controller: 'FilemanCtrl'
    });
}]);

fileman.controller('FilemanCtrl', [function () {

}]);

