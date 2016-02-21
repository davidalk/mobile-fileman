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
    .controller('FilemanCtrl', ['$state', function ($state) {
        $state.go('fileman');
    }]);

