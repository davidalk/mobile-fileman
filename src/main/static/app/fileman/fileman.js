'use strict';

angular.module('myApp.fileman', ['ui.router'])

    .config([
        '$stateProvider',
        function ($stateProvider) {

            $stateProvider.state('fileman', {
                url: "/fileman",
                templateUrl: 'fileman/fileman.html',
                controller: 'FilemanCtrl'
            });

        }
    ])

    .controller('FilemanCtrl', [
        '$log',
        function ($log) {
            $log.info('FilemanCtrl');
        }])

    .directive('directoryChooser', function () {
        return {
            restrict: 'E',
            scope: {},
            controller: 'ChooserCtrl',
            templateUrl: 'chooser/chooser.html'
        };
    });

