'use strict';

angular.module('myApp.chooser', ['ui.bootstrap', 'ngMaterial'])



    .directive('directoryChooser', function () {
        return {
            restrict: 'E',
            scope: {
                side: '@'
            },
            link: chooserLinkFunction,
            templateUrl: 'chooser/chooser.html'
        };

        function chooserLinkFunction(scope, element) {

        }
    });