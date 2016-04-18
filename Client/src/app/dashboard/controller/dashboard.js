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
                vm.routeParams = { 
                    storyType: routehelper.getStateParams('storyType'), 
                    projectName: routehelper.getStateParams('projectName'), 
                    story_id: routehelper.getStateParams('story_id'), 
                    lang: routehelper.getStateParams('lang') };
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
                            bottom: 50,
                            left: 45
                        },
                        clipEdge: true,
                        duration: 500,
                        showValues:true,
                        stacked: true,
                        color: ['#176799', '#42a4bb', '#78d6c7'], //'#1f77b4', 
                        useInteractiveGuideline: true,
                        /*reduceXTicks:false,*/
                        xAxis: {
                            axisLabel: 'Files',
                            showMaxMin: false,
                            tickFormat: function (d, index) {
                            return 'File no: ' + (index+1);
                            }
                            //rotateLabels: 5
                        },
                        yAxis: {
                            axisLabel: 'LOC',
                            axisLabelDistance: -20,
                            tickFormat: function (d) {
                                return d3.format('d')(d);
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
                                    label: d._id,
                                    value: d.count
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
                            if (vm.violationData[len].label.toLowerCase() == type.toLowerCase()) {
                                return vm.violationData[len].value;
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
                        labelType: 'percent',
                        showLegend: true,
                        transitionDuration: 500,
                        labelThreshold: 0,
                        color: ['#ffb61c', '#e94b3b', '#2ec1cc', '#00FFFF'], //'#1f77b4',                         
                        duration: 500,
                        x:function(d){
                            return d.label.charAt(0).toUpperCase() + d.label.slice(1);;
                        },
                        y:function(d){
                            return d3.format(',d')(d.value);
                        },
                        legend: {
                            updateState:false,
                            margin: {
                                top: 5,
                                right: 40,
                                bottom: 5,
                                left: 10
                            }
                        },
                        callback:function(){
                           //d3.select('#pieChart').select(".nv-legendWrap").attr("transform", "translate(30,-30)");
                        }
                    }
                };

                /* ------------- */


                /* ------------ Duplication  -------------- */

                vm.redundantDataOptions = {
                    chart: {
                        type: 'multiBarHorizontalChart',
                        height: 500,
                        showControls: false,
                        showValues: true,
                        duration: 500,
                        color: ['#176799', '#42a4bb', '#78d6c7'],
                        xAxis: {
                            showMaxMin: false,
                            tickFormat: function (d) {
                                return d;
                            }
                        },
                        yAxis: {
                            axisLabel: 'Duplication block count',
                            tickFormat: function (d) {
                                 return d3.format('d')(d);//d3.format(',.2f')(d);
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