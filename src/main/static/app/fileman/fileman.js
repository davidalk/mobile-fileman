'use strict';

angular.module('myApp.fileman', ['ui.router'])

    .config([
        '$stateProvider',
        function ($stateProvider) {

            $stateProvider.state('fileman', {
                url: "/fileman",
                templateUrl: 'fileman/fileman.html',
                controller: 'FilemanCtrl'
            });

        }
    ])

    .controller('FilemanCtrl', [
        '$window',
        '$document',
        '$scope',
        function ($window, $document, $scope) {
            $scope.explorerWidth = calculateExplorerWidth();

            function calculateExplorerWidth() {
                var xsSize = 600;
                var windowWidth = $window.innerWidth;

                var titleBars = _.find($document.find('div'), function (el) {
                    return el.classList.contains('TitleBackground');
                });
                var titleStyle = titleBars.currentStyle || $window.getComputedStyle(titleBars);
                var titleWidth = titleBars.offsetWidth + parseFloat(titleStyle.marginLeft) + parseFloat(titleStyle.marginRight);

                return windowWidth > xsSize ? (windowWidth - titleWidth) / 2 : windowWidth - titleWidth;
            }
        }]);

