'use strict';

angular.module('myApp.explorer', [])

    .directive('explorer', [
        '$http',
        '$log',
        function ($http, $log) {
            return {
                restrict: 'E',
                scope: {
                    side: '@'
                },
                link: explorerLinkFunction
            };

            function explorerLinkFunction(scope, element) {
                var url = '/rest/files';
                var svgWidth = 1024, svgHeight = 768;
                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight)
                    .append('g');


                scope.$on('chooser:updateDirectory', function (event, side, directory) {
                    if (side === scope.side) {
                        listDirectory(directory);
                    }
                });

                function listDirectory(directory) {
                    $http.get(url + directory)
                        .then(function (response) {
                            d3DataJoin(response.data.files);
                        }, function (response) {
                            $log.error('Failed contacting files service ' + response);
                        })
                }

                function d3DataJoin(data) {
                    var files = _.filter(data, {'isDirectory': false});
                    var directories = _.filter(data, {'isDirectory': true});

                    svg.selectAll('.directories')
                        .data(directories, function (d) {
                            return d.name;
                        })
                        .enter()
                        .append('path')
                        .attr('d', "M 118.222 24 h -62.222 v -6.222 c 0 -5.4 -4.378 -9.778 -9.778 -9.778 h -36.444 c -5.4 0 -9.778 4.378 -9.778 9.778 v 100.445 c 0 5.4 4.378 9.77801 9.778 9.77801 h 108.445 c 5.4 0 9.77801 -4.378 9.77801 -9.778 v -84.445 c 0 -5.4 -4.378 -9.778 -9.778 -9.778 Z")
                        .attr('stroke', 'black')
                        .attr('fill', 'dodgerblue')
                        .style({"vector-effect": "non-scaling-stroke", "stroke-width": "1px"})
                        .attr('transform', function (d, i) {
                            var x, y, oneDimPos, graphicWidth = 150, graphicHeight = 150;

                            oneDimPos = i * graphicWidth;

                            if (oneDimPos > svgWidth) {
                                x = oneDimPos % svgWidth;
                                y = Number.parseInt((oneDimPos / svgWidth)) * graphicHeight;
                            } else {
                                x = oneDimPos;
                                y = 0;
                            }

                            return 'translate(' + x + ',' + y + ')';
                        })

                }

            }

        }]);
