'use strict';

angular.module('myApp.chooser', ['ui.bootstrap', 'ngMaterial'])


    .directive('directoryChooser', [
        '$mdSidenav',
        '$http',
        '$log',
        function ($mdSidenav, $http, $log) {
            return {
                restrict: 'E',
                scope: {
                    side: '@'
                },
                link: chooserLinkFunction,
                templateUrl: 'chooser/chooser.html'
            };

            function chooserLinkFunction(scope, element) {
                
                scope.directories = getDirectories();

                function getDirectories(parent) {
                    var url = '/webapp/directories/';
                    if (parent) {
                        url += parent.replace(/^\//, '');
                    }

                    $http.get(url)
                        .then(function success(response) {
                            $log.info('Directory service success');
                            return response.data.subDirectories
                        }, function error(response) {
                            $log.error('Failed contacting directory service: ' + response)
                        });
                }
                
                scope.toggle = function () {
                    $mdSidenav(scope.side)
                        .toggle()
                        .then(function () {
                            $log.debug('toggle ' + scope.side);
                        });
                };

                scope.close = function () {
                    $mdSidenav(scope.side)
                        .close()
                        .then(function () {
                            $log.debug('close ' + scope.side);
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