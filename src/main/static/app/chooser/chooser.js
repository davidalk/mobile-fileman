'use strict';

angular.module('myApp.chooser', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/chooser', {
            templateUrl: 'chooser/chooser.html',
            controller: 'ChooserCtrl'
        });
    }])

    .controller('ChooserCtrl', [function() {

    }]);