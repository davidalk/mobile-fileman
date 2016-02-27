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
        '$scope',
        function ($log, $scope) {
            $log.info('FilemanCtrl');
            $scope.left = 'leftChooser';
            $scope.right = 'rightChooser';
        }])

    .directive('directoryChooser', function () {
        return {
            restrict: 'E',
            scope: {
                side: '='
            },
            controller: 'ChooserCtrl',
            templateUrl: 'chooser/chooser.html'
        };
    });

