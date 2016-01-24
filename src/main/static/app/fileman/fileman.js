'use strict';

angular.module('myApp.fileman', ['ngRoute', 'ui.router'])

    .config([
        '$routeProvider',
        '$stateProvider',
        function ($routeProvider, $stateProvider) {

            $routeProvider.when('/fileman', {
                templateUrl: "fileman/fileman.html",
                controller: "FilemanCtrl"
            });

            $stateProvider.state('fileman', {
                views: {
                    "leftChooserView": {
                        templateUrl: "chooser/chooser.html",
                        controller: "ChooserCtrl"
                    }
                }
            });

        }])

    .controller('FilemanCtrl', ['$state', function ($state) {
        $state.go('fileman');
    }]);

