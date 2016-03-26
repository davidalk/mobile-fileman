'use strict';

angular.module('myApp.chooser', ['ui.bootstrap', 'ngMaterial'])


    .directive('directoryChooser', [
        '$mdSidenav',
        '$http',
        '$q',
        '$log',
        function ($mdSidenav, $http, $q, $log) {
            return {
                restrict: 'E',
                scope: {
                    side: '@'
                },
                link: chooserLinkFunction,
                templateUrl: 'chooser/chooser.html'
            };

            function chooserLinkFunction(scope, element) {

                getDirectories().then(function (data) {
                    scope.directories = data;
                });


                function getDirectories(parent) {
                    var url = '/webapp/directories/';
                    var q = $q.defer();

                    if (parent) {
                        url += parent.replace(/^\//, '');
                    }

                    $http.get(url)
                        .then(function success(response) {
                            $log.info('Directory service success');
                            //noinspection JSUnresolvedVariable
                            q.resolve(response.data.subDirectories);
                        }, function error(response) {
                            $log.error('Failed contacting directory service: ' + response);
                            if (!parent || parent === '/') {
                                throw new Error(response);
                            } else {
                                return getDirectories();
                            }
                        });

                    return q.promise;
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