'use strict';

angular.module('myApp.explorer', [])

    .directive('explorer', [
        '$http',
        '$log',
        function ($http, $log) {
            return {
                restrict: 'E',
                scope: {
                    side: '@',
                    labelLength: '@'
                },
                link: explorerLinkFunction
            };

            function explorerLinkFunction(scope, element) {
                var url = '/rest/files';
                var svgWidth = 1024, svgHeight = 768,
                    tileWidth = 150, tileHeight = 175,
                    labelLength = parseInt(scope.labelLength), maxWidthForTiles = calcMaxWidthForTiles();

                var directorySvgPath = 'M 118.222 24 h -62.222 v -6.222 c 0 -5.4 -4.378 -9.778 -9.778 -9.778 h -36.444 c -5.4 0 -9.778 4.378 -9.778 9.778 v 100.445 c 0 5.4 4.378 9.77801 9.778 9.77801 h 108.445 c 5.4 0 9.77801 -4.378 9.77801 -9.778 v -84.445 c 0 -5.4 -4.378 -9.778 -9.778 -9.778 Z';
                var fileSvgPath = 'M17.778 0c-5.4 0-9.778 4.378-9.778 9.778v108.445c0 5.4 4.378 9.778 9.778 9.778h84.445c5.4 0 9.778-4.378 9.778-9.778v-86.222h-22.222c-5.4 0-9.778-4.378-9.778-9.778v-22.222h-62.222z';

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight)
                    .attr('class', scope.side + '-svg')
                    .append('g')
                    .attr('transform', 'translate(72, 80)');


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

                    var directoryTiles = svg.selectAll(".directories")
                        .data(directories, function (d) {
                            return d.name;
                        });

                    var g = directoryTiles.enter().append('g')
                        .attr('class', 'directories')
                        .attr('transform', gTranslate);

                    g.append('path')
                        .attr('d', directorySvgPath)
                        .attr('stroke', 'black')
                        .attr('fill', 'dodgerblue')
                        .style({"vector-effect": "non-scaling-stroke", "stroke-width": "1px"});

                    g.append('text')
                        .attr('x', '0')
                        .attr('y', textDeltaY)
                        .html(function (d) {
                            return generateTspans(d.name);
                        });

                    directoryTiles.exit().remove();

                }

                function gTranslate(d, i) {
                    var x, y, oneDimPos;

                    maxWidthForTiles = calcMaxWidthForTiles();
                    oneDimPos = i * tileWidth;

                    if ((oneDimPos + tileWidth) > maxWidthForTiles) {
                        x = oneDimPos % maxWidthForTiles;
                        y = Number.parseInt((oneDimPos / maxWidthForTiles)) * tileHeight * 1.2;
                    } else {
                        x = oneDimPos;
                        y = 0;
                    }

                    return 'translate(' + x + ',' + y + ')';
                }

                function textDeltaY(d) {
                    var name = d.name;
                    if (name.length > labelLength) {
                        var words = splitByDelim(name);
                        var lineCount = words.length === 1 ? Math.ceil(name.length / labelLength) : words.length;
                        return '-' + (lineCount * 1.2) + 'em';

                    } else {
                        return '-1.2em';
                    }
                }

                function calcMaxWidthForTiles() {
                    var maxTilesHorizontal;

                    maxTilesHorizontal = Number.parseInt(svgWidth / tileWidth);

                    return maxTilesHorizontal * tileWidth;

                }

                function generateTspans(text) {
                    var words, i, j, newWord, result = [],
                        textLength = labelLength;

                    if (text.length > textLength) {
                        words = splitByDelim(text);
                        for (i = 0; i < words.length; i++) {
                            if (words[i].length > textLength) {
                                newWord = '';
                                for (j = 0; j < words[i].length; j += textLength) {
                                    result.push(getTspanLeft());
                                    result.push(words[i].substr(j, textLength));
                                    result.push('</tspan>');
                                }
                            } else {
                                result.push(getTspanLeft());
                                result.push(words[i]);
                                result.push('</tspan>');
                            }
                        }

                        return result.join('');
                    }

                    return getTspanLeft() + text + '</tspan>';

                    function getTspanLeft() {
                        return '<tspan x="0" dy="1.2em">';
                    }
                }

                function splitByDelim(input) {
                    var delimiters = [' ', '-', '.'];
                    for (var i = 0; i < delimiters.length; i++) {
                        if (input.includes(delimiters[i])) {
                            return _.map(input.split(delimiters[i]), function (d, index, collection) {
                                return d + ((index < collection.length - 1) ? delimiters[i] : '');
                            });
                        }
                    }
                    return [input];
                }


            }

        }]);
