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

            $stateProvider.state('leftchooser', {
                url: "/fileman/leftchooser",
                views: {
                    "leftChooserView": {templateUrl: "chooser/chooser.html"}
                }
            });

        }])

    .controller('FilemanCtrl', ['$state', function ($state) {
        $state.go('leftchooser');
    }]);

