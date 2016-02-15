'use strict';

angular.module('myApp.chooser', ['ui.bootstrap'])


    .controller('ChooserCtrl', [
        '$scope',
        '$uibModal',
        '$log',
        function ($scope, $uibModal, $log) {

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

            var directory = $http.get('http://localhost:8080/webapp/directories/')
                .then(function successCallback(response) {
                    //noinspection JSUnresolvedVariable
                        $scope.directories = response.data.subDirectories;
                },
                function errorCallback(response) {

                });


            $scope.ok = function () {
                $uibModalInstance.close('ok');
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel')
            };
        }

    ]);