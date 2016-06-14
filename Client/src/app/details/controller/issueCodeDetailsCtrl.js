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
                story_id = routehelper.getStateParams('story_id'), 
                lang = routehelper.getStateParams('lang');
                vm.CONST = constant;
                vm.story_Type = routehelper.getStateParams('storyType');
                vm.project_Name = routehelper.getStateParams('projectName');  
                vm.violations={};
                vm.pmdDetails=[];
                vm.conditionTohide=true;
                var duration = 500,
                    transition = 200;
                vm.slimScrollOptions={
                    height:'290px'
                };
               

               vm.retrieveViolationCount = function () {
                    metricsDashboardService.retrieveViolationCount({ story_Id: story_id, lang: lang }, function (response) {
                        if (response && response.length > 0) {
                            var sum=0;                           
                            response.map(function (d, i) {
                                vm.violations[d._id] = d.count;
                                sum+=d.count;
                                return sum;
                            });
                            console.log(lang);
                            //var percentage;
                            switch (lang) {
                                case "js": 
                                  var percentage=vm.violations.error/(sum)*100;             
                                    break;
                                 case "ruby": 
                                  var percentage=vm.violations.convention/(sum)*100;             
                                    break;
                                 case "java": 
                                  var percentage=vm.violations.error/(sum)*100;             
                                    break;  
                                default:
                                    window.alert("lang undefined");
                            }
                            //var percentage=vm.violations.error/(sum)*100;
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
                    metricsDetailsService.pmdreport({ story_Id: story_id, lang: lang }, function (response) {
                            vm.pmdinfo = [];
                            switch (lang) {
                                case "js":              
                                if (response && response.length > 0) {
                                vm.pmdlist = response[0];
                              //  var filename  =issue.file.name;
                                //    var  fileConvert=filename.replace("coffee-files/","")                             
                                 //    pmdobj.name = fileConvert;


                                 vm.pmdlist.data.map(function (issue, i) {
                                    //console.log(issue);
                                    vm.pmdobj = {blockers:0,critical:0,major:0,minor:0,info:0,warning:0,name:""};
                                   if (issue.file.violations.length > 0) {
                                    vm.pmdobj.name = issue.file.name;
                                      issue.file.violations.map(function (violationitem, i) {
                                    if (violationitem.priority === "info") {
                                        vm.pmdobj.info +=1;
                                    }
                                    /* else if (violationitem.priority === "error") {
                                        vm.pmdobj.error +=1;
                                    }*/

                                    else if (violationitem.priority === "warning") {
                                      vm.pmdobj.warning +=1;
                                    }
                                        
                                    else if (violationitem.complexityCyclomatic >20) {
                                        vm.pmdobj.blockers +=1;
                                    }
                                     else if (violationitem.complexityCyclomatic >10 && violationitem.complexityCyclomatic<=20 ) {
                                        vm.pmdobj.critical +=1;
                                    }
                                    else if (violationitem.complexityCyclomatic >4 && violationitem.complexityCyclomatic<=10 ) {
                                        vm.pmdobj.major +=1;
                                    }
                                    else if (violationitem.complexityCyclomatic >0 && violationitem.complexityCyclomatic<=4 ) {
                                       vm.pmdobj.minor +=1;
                                    }
                                    /*else if (violationitem.priority === "error") {
                                        vm.pmdobj.error +=1;
                                    }*/
                                      });
                                      
                                    vm.pmdinfo.push(vm.pmdobj);
                                    }                      
                                 
                            });
                        };
                        break;
                        case "ruby": 
                        if (response && response.length > 0) {
                            vm.pmdlist = response[0];
                            vm.pmdlist.data.files.map(function (issue, i) {
                                 //console.log(issue);
                                
                               vm.pmdobj = {convention:0,warning:0,fatal:0,name:""};
                               if (issue.offenses.length > 0) {
                                 vm.pmdobj.name = issue.path;
                                   issue.offenses.map(function (violationitem, i) {
                                        if (violationitem.severity === "convention") {
                                            vm.pmdobj.convention +=1;
                                        }
                                         else if (violationitem.severity === "fatal") {
                                            vm.pmdobj.fatal +=1;
                                        }

                                        else if (violationitem.severity === "warning") {
                                           vm.pmdobj.warning +=1;
                                        }
                                    });
                                  
                                     vm.pmdinfo.push(vm.pmdobj);
                                     //vm.pmdinfo.splice(3,1);
                                     //console.log(vm.pmdinfo);
                                }                      
                            });
                        };
                        break;  
                    }
                        /*if (vm.pmdinfo.length >6) {
                            vm.slimScrollOptions={
                                height: ". !important",
                                size: "7px",
                                alwaysVisible: true
                            }
                        }
                         else{
                                vm.slimScrollOptions={
                                height: "500px !important",
                                size: "7px",
                                alwaysVisible: true
                            } 
                        }*/
                        
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
                

               vm.expandIssue=function(event,index, filName){   
                    vm.issueElement= true;
                    $scope.selectedRow = index;
                    $scope.fileName = filName;

                    //$scope.fileName = filName.substr(filName.lastIndexOf('/') + 1);                  
                    var pmd=angular.element(event.target).scope();
                    switch (lang) {
                                case "js": 
                                   vm.pmdlist.data.map(function (issue, i) {
                                        if(issue.file.name==pmd.file.name){
                                           vm.pmdIssue=issue.file.violations;
                                           var temp = {}
                                           for(var i = 0;i<issue.file.violations.length;i++){
                                            temp['beginline'] = issue.file.violations[i]['beginline'];
                                            temp['method'] = issue.file.violations[i]['method'];
                                            temp['priority'] = issue.file.violations[i]['priority'];
                                            temp['complexityCyclomatic'] = issue.file.violations[i]['complexityCyclomatic'];
                                            temp['message'] = issue.file.violations[i]['message'];
                                            vm.pmdDetails.push(temp);
                                           }
                                        }
                                    });
                                    break;          
                                 case "ruby": 
                                   vm.pmdlist.data.files.map(function (issue, i) {
                                        if(issue.path==pmd.file.name){
                                          vm.pmdIssue=issue.offenses;
                                          var temp = {};
                                           for(var i = 0;i<issue.offenses.length;i++){
                                            temp['severity'] = issue.offenses[i]['severity'];
                                            temp['location'] = issue.offenses[i]['location'];
                                            temp['message'] = issue.offenses[i]['message'];
                                            temp['cop_name'] = issue.offenses[i]['cop_name'];
                                            vm.pmdDetails.push(temp);
                                           }
                                        }
                                    });             
                                    break;
                                 case "java": 
                                  var percentage=vm.violations.info/(sum)*100;             
                                    break;  
                                default:
                                    window.alert("lang undefined");
                            }
                                   
                        
                    };

                    vm.onStateChange = function (routerName) {
                    var stateParam={ storyType: vm.story_Type,
                     projectName: vm.project_Name, story_id: story_id, lang:lang};
                    routehelper.goToState(routerName, stateParam);
                }


                    /*vm.genpdf= function(){
                html2canvas(document.body,{
                onrendered:function(canvas){
                var img=canvas.toDataURL('image/png');
                var doc=new jsPDF('l', 'mm', [350, 250]);
                doc.addImage(img,'JPEG',20,20);
                doc.save("issue.pdf");
                }
                });
                };*/
                
              

                vm.retrieveViolationCount();
                vm.pmdreport();

            }]);
})();