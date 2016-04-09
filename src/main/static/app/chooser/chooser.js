'use strict';

angular.module('myApp.chooser', ['ui.bootstrap', 'ngMaterial'])


    .directive('directoryChooser', [
        '$mdSidenav',
        '$log',
        '$http',
        '$rootScope',
        function ($mdSidenav, $log, $http, $rootScope) {
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
                broadcastSelectedDirectory();

                function bindDirectoriesToScope(root) {
                    getDirectories(root).then(function (data) {
                        scope.directories = data;
                    });
                }

                function getDirectories(parent) {
                    var url = '/rest/directories/';

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

                function broadcastSelectedDirectory() {
                    $rootScope.$broadcast('chooser:updateDirectory', scope.side, scope.selectedDirectory);
                }
                
                scope.selectDirectory = function (directory) {
                    scope.selectedDirectory += directory + '/';
                    bindDirectoriesToScope(scope.selectedDirectory)
                    broadcastSelectedDirectory();
                };

                scope.selectParentDirectory = function () {
                    var newSelectedDir = scope.selectedDirectory.replace(/[^\/]+?\/$/, '');
                    scope.selectedDirectory = newSelectedDir;
                    bindDirectoriesToScope(newSelectedDir);
                    broadcastSelectedDirectory();
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