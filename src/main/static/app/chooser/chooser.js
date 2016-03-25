'use strict';

angular.module('myApp.chooser', ['ui.bootstrap', 'ngMaterial'])


    .directive('directoryChooser', [
        '$mdSidenav',
        '$log',
        function ($mdSidenav, $log) {
            return {
                restrict: 'E',
                scope: {
                    side: '@'
                },
                link: chooserLinkFunction,
                templateUrl: 'chooser/chooser.html'
            };

            function chooserLinkFunction(scope, element) {

                scope.toggle = function () {
                    $mdSidenav(scope.side)
                        .toggle()
                        .then(function () {
                            $log.debug('toggle ' + scope.side + ' is done');
                        });
                };

                scope.close = function () {
                    $mdSidenav(scope.side)
                        .close()
                        .then(function () {
                            $log.debug('close ' + scope.side + ' is done');
                        });
                }

            }
        }])

    .directive('evalAttrAsExpr', function () {
        return {
            restrict: 'A',
            controller: ['$scope', '$attrs',
                function ($scope, $attrs) {
                    //noinspection JSUnresolvedVariable
                    var attrToEval = $attrs.evalAttrAsExpr;
                    $attrs[attrToEval] = $scope.$eval($attrs[attrToEval]);
                }]
        };
    });