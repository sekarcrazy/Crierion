(function () {
    angular.module('metrics.dashboard.controller')
        .controller('dashboardCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings', 'routehelper', '$route', '$document','metricsDashboardService',
            function ($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document, metricsDashboardService) {
                var vm = this, log = logger.getInstance('Dashboard Control');
                log.log('Initializing shell control');
                var story_id = routehelper.getStateParams('story_id'), lang = routehelper.getStateParams('lang');
                if (!story_id) {
                    return;
                }
                var seriesCollection = [
                    { key: "LineOfCode", value:"loc", values: [] },
                    { key: "Function",value:'totalFunction', values: [] },
                    { key: "Cyclomatic", value: 'cyclomatic', values: [] }];
                vm.kFormatter= function(num) {
                    return num > 999 ? (num/1000).toFixed(1) + ' K' : num
                }
                vm.options = {
                    chart: {
                        type: 'multiBarChart',
                        height: 450,
                        margin: {
                            top: 20,
                            right: 20,
                            bottom: 100,
                            left: 45
                        },
                        clipEdge: true,
                        duration: 500,
                        showValues:true,
                        stacked: true,
                        color: ['#1f77b4', '#f25454', '#ff7f0e'], //'#1f77b4', 
                        xAxis: {
                            axisLabel: 'Files',
                            showMaxMin: false
                            //rotateLabels: 5
                        },
                        yAxis: {
                            axisLabel: 'LOC',
                            axisLabelDistance: -20,
                            tickFormat: function (d) {
                                return d3.format(',.1f')(d);
                            }
                        }
                    }
                };

                vm.getChartData = function () {
                    metricsDashboardService.retrieveLOCChartData({ storyId: story_id, lang: lang }, function (response) {
                        if (response && response.length > 0) {
                            vm.data = generateData(response);
                        }
                    });
                    //retrieveRedundantChartData
                }

                vm.getDashboardData = function () {
                    metricsDashboardService.retrieveDashboardInfo({ storyId: story_id, lang: lang }, function (response) {
                        if (response && response.length > 0) {
                            vm.dashboard = response[0];
                        }
                    });
                }
                /*Pie Chart */
                vm.violations = {};
                vm.retrieveViolationCount = function () {
                    metricsDashboardService.retrieveViolationCount({ storyId: story_id, lang: lang }, function (response) {
                        if (response && response.length > 0) {
                            var violation = [];                            
                            response.map(function (d, i) {
                                vm.violations[d._id] = d.count;
                                violation.push({
                                    x: d._id,
                                    y: d.count
                                });
                            });
                            vm.violationData = violation;
                        }
                    });
                };
                vm.getViolationDataByType = function (type) {
                    type = type || '';
                    if (!type) {
                        return;
                    }
                    if (vm.violationData && vm.violationData.length > 0) {
                        var len = vm.violationData.length;
                        while (len--) {
                            if (vm.violationData[len].x.toLowerCase() == type.toLowerCase()) {
                                return vm.violationData[len].y;
                            }
                        }
                    }
                }

                vm.issuesCount = function () {
                    metricsDashboardService.retrieveIssuesListCount({ storyId: story_id, lang: lang }, function (response) {
                        var issueObj = { blocker: 0, critical: 0, major: 0, minor: 0 };
                        if (response && response.length > 0) {
                            response.map(function (issue, i) {
                                if (issue.cyclomatic > 20) {
                                    issueObj.blocker += issue.count;
                                }
                                else if (issue.cyclomatic > 10 && issue.cyclomatic <= 20) {
                                    issueObj.critical += issue.count;
                                }
                                else if (issue.cyclomatic > 4 && issue.cyclomatic <= 10) {
                                    issueObj.major += issue.count;
                                }
                                else if (issue.cyclomatic > 0 && issue.cyclomatic <= 4) {
                                    issueObj.minor += issue.count;
                                }                               
                            });
                            vm.issuesCountInfo = issueObj;
                        }
                    });
                };
                vm.pieChartoptions = {
                    chart: {
                        type: 'pieChart',
                        height: 300,
                        width:300,
                        donut: true,
                        showLabels: true,
                        showValues: true,
                        color: ['#ff9c00', '#D8000C', '#00529B', '#00FFFF'], //'#1f77b4',                         
                        duration: 500,
                        legend: {
                            margin: {
                                top: 5,
                                right: 70,
                                bottom: 5,
                                left: 0
                            }
                        }
                    }
                };

                /* ------------- */


                /* ------------ Duplication  -------------- */

                vm.redundantDataOptions = {
                    chart: {
                        type: 'multiBarHorizontalChart',
                        height: 300,
                        showControls: true,
                        showValues: true,
                        duration: 500,
                        xAxis: {
                            showMaxMin: false
                        },
                        yAxis: {
                            axisLabel: 'Duplication block count',
                            tickFormat: function (d) {
                                return d3.format(',.2f')(d);
                            }
                        }
                    }
                };
                vm.getDuplicationCodeData = function () {
                    metricsDashboardService.retrieveRedundantChartData({ storyId: story_id, lang: lang }, function (response) {
                        if (response && response.length > 0) {
                            var series = [{ key: "Duplication", value: "duplication", values: [] }];
                            response.map(function (d, i) {
                                series[0].values.push({
                                    x: d._id,
                                    y:d.count
                                });
                            });

                            vm.redundantData = series;
                        }
                    });
                }


                /* ----------------------------------------- */
                vm.getDashboardData();
                vm.getChartData();
                vm.retrieveViolationCount();
                vm.getDuplicationCodeData();
                vm.issuesCount();

                function generateData(response) {                    
                   response[0].data.map(function (d, i) {
                       seriesCollection.map(function (item, index) {
                            item.values.push({
                                x: d.file.name,
                                y: item.value == "loc" ? d.file.aggregate.sloc.physical : d.file.aggregate[item.value]
                            });
                        });                       
                    });
                   return seriesCollection;
                }

            }]);
})();