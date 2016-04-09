'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'myApp.fileman',
    'myApp.chooser',
    'myApp.explorer',
    'ui.router',
    'myApp.version'
]).config(['$urlRouterProvider', function ($urlRouterProvider) {

    $urlRouterProvider.otherwise('/fileman');

}]);
