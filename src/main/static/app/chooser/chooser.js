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
                var sidenavInstance = $mdSidenav(scope.side);

                scope.selectedDirectory = '/';

                bindDirectoriesToScope(scope.selectedDirectory);

                function bindDirectoriesToScope(root) {
                    getDirectories(root).then(function (data) {
                        scope.directories = data;
                    });
                }

                function getDirectories(parent) {
                    var url = '/webapp/directories/';

                    if (parent) {
                        url += parent.replace(/^\//, '');
                    }

                    return $http.get(url)
                        .then(function success(response) {
                            $log.info('Directory service success');
                            //noinspection JSUnresolvedVariable
                            return response.data.subDirectories;
                        }, function error(response) {
                            $log.error('Failed contacting directory service: ' + response);
                            if (!parent || parent === '/') {
                                throw new Error(response);
                            } else {
                                return getDirectories();
                            }
                        });

                }
                
                scope.selectDirectory = function (directory) {
                    scope.selectedDirectory += directory + '/';
                    bindDirectoriesToScope(scope.selectedDirectory)
                };

                scope.open = function () {
                    sidenavInstance
                        .open()
                        .then(function () {
                            $log.debug('open ' + scope.side);
                        });
                };

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