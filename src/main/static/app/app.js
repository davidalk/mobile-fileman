'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'myApp.fileman',
    'myApp.chooser',
    'ui.router',
    'myApp.version'
]).config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

        $stateProvider.state('main', {
            abstract: true,
            templateUrl: 'fileman/fileman.html',
            controller: 'FilemanCtrl'
        });

        $urlRouterProvider.otherwise('/fileman');

    }]);
