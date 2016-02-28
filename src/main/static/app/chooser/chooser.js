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
            var dirRestUrl = 'http://localhost:8080/webapp/directories';

            $scope.currentPath = '';

            $scope.getDirectories = function (startPath) {
                var pathPart;

                if ($scope.currentPath === '') {
                    pathPart = startPath;
                } else if ($scope.currentPath === '/') {
                    pathPart = $scope.currentPath + startPath;
                } else {
                    pathPart = $scope.currentPath + '/' + startPath;
                }

                var callUrl = dirRestUrl + pathPart;

                $http.get(callUrl)
                    .then(function successCallback(response) {
                            //noinspection JSUnresolvedVariable
                            $scope.directories = response.data.subDirectories;
                            $scope.currentPath = pathPart;
                        },
                        function errorCallback(response) {
                            $log.error(response);
                        });
            };

            $scope.getParentDirectories = function () {
                var newStartPath;

                if ($scope.currentPath === '/' || $scope.currentPath === '') {
                    $scope.currentPath = '';
                    $scope.getDirectories('/');
                } else {
                    newStartPath = $scope.currentPath.replace(/(.+)\/.+?$/, '$1');
                    $scope.currentPath = '';
                    $scope.getDirectories(newStartPath);
                }
            };

            $scope.directories = ['/'];

            $scope.ok = function () {
                $scope.$emit('chooser:directorySelected', $scope.currentPath);
                $uibModalInstance.close('ok');
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel')
            };
        }

    ]);