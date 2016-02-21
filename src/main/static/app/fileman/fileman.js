'use strict';

angular.module('myApp.fileman', ['ui.router'])

    .config([
        '$stateProvider',
        function ($stateProvider) {

            $stateProvider.state('fileman', {
                url: "/fileman",
                views: {
                    leftChooserView: {
                        templateUrl: "chooser/chooser.html",
                        controller: "ChooserCtrl"
                    },
                    rightChooserView: {
                        templateUrl: "chooser/chooser.html",
                        controller: "ChooserCtrl"
                    }
                }
            });

        }
    ])
    .run([
        '$state',
        '$log',
        function ($state, $log) {
            $log.info('FilemanCtrl run()');
            $state.go('fileman');
        }])
    .controller('FilemanCtrl', [
        '$log',
        function ($log) {
            $log.info('FilemanCtrl');
        }]);

