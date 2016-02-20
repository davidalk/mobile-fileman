'use strict';

angular.module('myApp.chooser', ['ui.bootstrap'])


    .controller('ChooserCtrl', [
        '$scope',
        '$rootScope',
        '$uibModal',
        '$log',
        function ($scope, $rootScope, $uibModal, $log) {

            $rootScope.$on('directorySelected', function (event, selectedDirectory) {
                if ($scope.side === 'left') {
                    $scope.leftSelectedDirectory = selectedDirectory;
                } else {
                    $scope.rightSelectedDirectory = selectedDirectory;
                }
            });

            $scope.open = function (size) {

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "chooserModal.html",
                    controller: "ChooserModalCtrl",
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
        function ($scope, $http, $uibModalInstance) {
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
                                console.log(response);
                            }
                        });
            };

            $scope.getDirectories();


            $scope.ok = function () {
                $scope.$emit('directorySelected', $scope.currentPath);
                $uibModalInstance.close('ok');
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel')
            };
        }

    ]);