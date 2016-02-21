'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'myApp.fileman',
    'myApp.chooser',
    'ngRoute',
    'myApp.version'
]).config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/fileman', {
        templateUrl: "fileman/fileman.html",
        controller: "FilemanCtrl"
    }).otherwise('/fileman');

}]);
