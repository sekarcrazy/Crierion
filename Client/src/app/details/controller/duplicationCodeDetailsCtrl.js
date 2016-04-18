(function() {
    angular.module('metrics.details.controller')
        .controller('duplicationCodeDetailsCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings', 'routehelper', '$route', '$document', 
            'metricsDetailsService','$q','metricsDashboardService', 'modalService',
            function($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document, 
                metricsDetailsService, $q, metricsDashboardService, modalService) {
                var vm = this, log = logger.getInstance('Details Control');
                var story_id = routehelper.getStateParams('story_id'), lang = routehelper.getStateParams('lang');
                if (!story_id) {
                    return;
                }

                var duration = 500,
                    transition = 200;
                vm.showDuplicatedModal = function()
                {
                    var modalInstance = modalService.showModal({
                        templateUrl: 'app/details/templates/duplicated-by-modal-window.tpl.html',
                        controller: 'duplicatedByModalCtrl',
                        controllerAs: 'duplicatedByModalVM',
                        windowClass: 'action-modal',
                        resolve: { modalParam: function () { } }
                    });
                    
                    modalInstance.then(function(){
                         
                    });                
                }
                $q.all([
                        metricsDetailsService.retrieveRedundantDetailsLOCData({ story_Id: story_id, lang: lang }).$promise,
                        metricsDashboardService.retrieveDashboardInfo({ storyId: story_id, lang: lang }).$promise
                    ]).then(function(values) {
                            vm.duplicateLOCDetails = values[0];
                            vm.overallLOCDetails = values[1];
                            vm.totalDuplicatedLOC = 0, percentage =0;
                            vm.duplicateLOCDetails.map(function(item,index){
                                vm.totalDuplicatedLOC += item.totalDuplicatedLines;
                            })
                            percentage = vm.totalDuplicatedLOC/vm.overallLOCDetails[0].loc * 100;
                            
                            drawDonutChart(
                                '#donut1',
                                percentage,
                                150,
                                150,
                                ".35em"
                            );
                }, function(reason) {
                    
                });               
                
                vm.retrieveDuplicationDiff = function () {
                    metricsDetailsService.retrieveRedundantDetailsDiff({ storyId: story_id}, function (response) {
                        if (response && response.length > 0) {
                            vm.dulpicationResource = response[0];
                        }
                    });
                }
                
                vm.getDuplicatedByWithDiff = function(activePath){
                    vm.duplicatedDiff = {diffs:[]};
                    if(!activePath){return;}
                    if(vm.dulpicationResource)
                    {
                        vm.dulpicationResource.data.map(function(data, dataIndex){
                            if(isduplicated(activePath, data.instances))
                            {
                                data.instances.map(function(instance, instanceIndex){
                                    if(vm.duplicatedDiff.hasOwnProperty(instance.path))
                                    {
                                        vm.duplicatedDiff[instance.path].lines.push(instance.lines);
                                    }
                                    else{
                                        vm.duplicatedDiff[instance.path] = {};
                                        vm.duplicatedDiff[instance.path].lines = [];
                                        vm.duplicatedDiff[instance.path].lines.push(instance.lines)
                                    }
                                });
                            }
                        });
                    }
                }
                
                function isduplicated(lookUpPath, instances){
                   var duplicatedArr = instances.filter(function(instance){
                       if(instance.path == lookUpPath)
                       {
                           return true;
                       }
                       return false;
                    });
                    var result = duplicatedArr.length > 0 ? true : false;
                    return result;
                }
                
                function drawDonutChart(element, percent, width, height, text_y) {
                    width = typeof width !== 'undefined' ? width : 290;
                    height = typeof height !== 'undefined' ? height : 290;
                    text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";

                    var dataset = {
                        lower: calcPercent(0),
                        upper: calcPercent(percent)
                    },
                        radius = Math.min(width, height) / 2,
                        pie = d3.layout.pie().sort(null),
                        format = d3.format(".0%");

                    var arc = d3.svg.arc()
                        .innerRadius(radius - 30)
                        .outerRadius(radius);

                    var svg = d3.select(element).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                    var path = svg.selectAll("path")
                        .data(pie(dataset.lower))
                        .enter().append("path")
                        .attr("class", function(d, i) { return "color" + i })
                        .attr("d", arc)
                        .each(function(d) { this._current = d; }); // store the initial values

                    var text = svg.append("text")
                        .attr("text-anchor", "middle")
                        .attr("dy", text_y);

                    if (typeof (percent) === "string") {
                        text.text(percent);
                    }
                    else {
                        var progress = 0;
                        var timeout = setTimeout(function() {
                            clearTimeout(timeout);
                            path = path.data(pie(dataset.upper)); // update the data
                            path.transition().duration(duration).attrTween("d", function(a) {
                                // Store the displayed angles in _current.
                                // Then, interpolate from _current to the new angles.
                                // During the transition, _current is updated in-place by d3.interpolate.
                                var i = d3.interpolate(this._current, a);
                                var i2 = d3.interpolate(progress, percent)
                                this._current = i(0);
                                return function(t) {
                                    text.text(format(i2(t) / 100));
                                    return arc(i(t));
                                };
                            }); // redraw the arcs
                        }, 200);
                    }
                };

                function calcPercent(percent) {
                    return [percent, 100 - percent];
                };
                
                vm.retrieveDuplicationDiff();
                
            }]);
})();