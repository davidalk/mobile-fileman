'use strict';

angular.module('myApp.chooser', ['ui.bootstrap'])


    .controller('ChooserCtrl', [
        '$scope',
        '$uibModal',
        '$log',
        function ($scope, $uibModal, $log) {
            console.log('ChooserCtrl');

            $scope.$on('chooser:directorySelected', function (event, selectedDirectory) {
                $scope.selectedDirectory = selectedDirectory;
            });

            $scope.open = function (size) {

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "chooserModal.html",
                    controller: "ChooserModalCtrl",
                    scope: $scope,
                    size: size
                });

                modalInstance.result.then(function () {
                    $log.info('modal instance selected');
                }, function () {
                    $log.info('modal instance dismissed');
                });
            };

        }])

    .controller('ChooserModalCtrl', [
        '$scope',
        '$http',
        '$uibModalInstance',
        '$log',
        function ($scope, $http, $uibModalInstance, $log) {
            $log.info('ChooserModalCtrl');
            var dirRestUrl = 'http://localhost:8080/webapp/directories/';
            $scope.currentPath = '';

            $scope.getDirectories = function (startPath) {
                var callUrl = dirRestUrl;

                if (typeof startPath === 'string') {
                    callUrl += '?startPath=';
                    if (startPath === '/') {
                        callUrl += '/'
                    } else {
                        callUrl += $scope.currentPath + startPath + '/'
                    }

                }

                $http.get(callUrl)
                    .then(function successCallback(response) {
                            if (startPath === undefined) {
                                //noinspection JSUnresolvedVariable
                                $scope.directories = response.data.subDirectories;
                            } else {
                                //noinspection JSUnresolvedVariable
                                $scope.directories = response.data.subDirectories[0].subDirectories;
                                $scope.currentPath += startPath === '/' ? '/' : startPath + '/';
                            }
                        },
                        function errorCallback(response) {
                            if (typeof callUrl === 'string') {
                                $scope.getDirectories();
                            } else {
                                $log.info(response);
                            }
                        });
            };

            $scope.getParentDirectories = function () {
                var newStartPath;

                if ($scope.currentPath === '/' || $scope.currentPath === '') {
                    $scope.currentPath = '';
                    $scope.getDirectories();
                } else {
                    newStartPath = $scope.currentPath.split(/\//);
                    newStartPath = newStartPath[newStartPath.length - 3];
                    $scope.currentPath = $scope.currentPath.replace(/[^\/]+\/$/g, '');
                    $scope.getDirectories(newStartPath);
                }
            };

            $scope.getDirectories();


            $scope.ok = function () {
                $scope.$emit('chooser:directorySelected', $scope.currentPath);
                $uibModalInstance.close('ok');
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel')
            };
        }

    ]);