(function() {
    angular.module('metrics.details.controller')
        .controller('issueCodeDetailsCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings', 'routehelper', '$route', '$document',
            'metricsDetailsService', '$q', 'metricsDashboardService', 'modalService','sharedService','$compile',
            function($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document,
                metricsDetailsService, $q, metricsDashboardService, modalService, sharedService,$compile) {
                var vm = this, log = logger.getInstance('Details Control'),
                story_id = routehelper.getStateParams('story_id'), lang = routehelper.getStateParams('lang');
                vm.violations={};
                var duration = 500,
                    transition = 200;
                vm.slimScrollOptions={
                    height: '500px',
                    size: "7px",
                    alwaysVisible: true
                }
                                


               vm.retrieveViolationCount = function () {
                    metricsDashboardService.retrieveViolationCount({ story_Id: story_id, lang: lang }, function (response) {
                        if (response && response.length > 0) {                           
                            response.map(function (d, i) {
                                vm.violations[d._id] = d.count;                               
                            });
                            var percentage=vm.violations.error/(vm.violations.info+vm.violations.warning+vm.violations.error)*100;

                            drawDonutChart(
                                    '#donut1',
                                    percentage,
                                    150,
                                    150,
                                    ".35em"
                                );
                        }
                    });

                };

                vm.pmdreport = function () {
                    metricsDetailsService.pmdreport({ storyId: story_id}, function (response) {
                            vm.pmdinfo = [];

                        
                        if (response && response.length > 0) {
                            vm.pmdlist = response[0];
                            response[0].data.map(function (issue, i) {
                               var pmdobj = {blockers:0,critical:0,major:0,minor:0,info:0,warning:0};
                               if (issue.file.violations.length > 0) {                               
                                 pmdobj.name = issue.file.name;
                                  issue.file.violations.map(function (violationitem, i) {
                                if (violationitem.priority === "info") {
                                    pmdobj.info +=1;
                                }

                                else if (violationitem.priority === "warning") {
                                    pmdobj.warning +=1;
                                }
                                    
                                else if (violationitem.complexityCyclomatic >20) {
                                    pmdobj.blockers +=1;
                                }
                                 else if (violationitem.complexityCyclomatic >10 && violationitem.complexityCyclomatic<=20 ) {
                                    pmdobj.critical +=1;
                                }
                                else if (violationitem.complexityCyclomatic >4 && violationitem.complexityCyclomatic<=10 ) {
                                    pmdobj.major +=1;
                                }
                                else if (violationitem.complexityCyclomatic >0 && violationitem.complexityCyclomatic<=4 ) {
                                    pmdobj.minor +=1;
                                }
                                  });
                                  
                                vm.pmdinfo.push(pmdobj);
                                }
                                
                                 
                                                        
                                 
                            });
                        }
                    });
                };

                


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

                $scope.selectedRow = null;  // initialize our variable to null
                $scope.setClickedRow = function(index, filName){  //function that sets the value of selectedRow to current index
                 $scope.selectedRow = index;
                 $scope.fileName = filName.split('/')[2];
              }

                vm.expandIssue=function(event){   
                    vm.issueElement= true;                  
                    var pmd=angular.element(event.target).scope();
                     vm.pmdlist.data.map(function (issue, i) {
                         if(issue.file.name==pmd.file.name)
                           vm.pmdIssue=issue.file.violations;
                     });                
                        
                    };

                    vm.genpdf= function(){
                html2canvas(document.body,{
                onrendered:function(canvas){
                var img=canvas.toDataURL('image/png');
                var doc=new jsPDF('l', 'mm', [350, 250]);
                doc.addImage(img,'JPEG',20,20);
                doc.save("issue.pdf");
                }
                });
                };
                
              

                vm.retrieveViolationCount();
                vm.pmdreport();

            }]);
})();