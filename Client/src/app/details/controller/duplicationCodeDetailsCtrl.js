(function() {
    angular.module('metrics.details.controller')
        .controller('duplicationCodeDetailsCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings', 'routehelper', '$route', '$document',
            'metricsDetailsService', '$q', 'metricsDashboardService', 'modalService','sharedService', 'appUtility',
            function($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document,
                metricsDetailsService, $q, 
                metricsDashboardService, modalService, sharedService, appUtility) {
                var vm = this, log = logger.getInstance('Details Control'),
                story_id = routehelper.getStateParams('story_id'), lang = routehelper.getStateParams('lang');
                
                vm.duplicatedDiff = {};
                vm.parseInt = parseInt;
                vm.selectedIndex=null;
                if (!story_id) {
                    return;
                }
                vm.activePath=sharedService.getActivePath();
                
                var duration = 500,
                    transition = 200;
                vm.slimScrollOptions={
                    height: '300px',
                     }
                 
                vm.colorCode = [];
                getRandomColor = function(){
                // var color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
                 var color = 'rgb(' + (Math.floor((256-200)*Math.random()) + 200) + ',' + 
                                    (Math.floor((256-200)*Math.random()) + 200) + ',' + 
                                    (Math.floor((256-200)*Math.random()) + 200) + ')';
                    // var color = appUtility.getRandomColor();
                    if(vm.colorCode.indexOf(color) == -1)
                    {
                        return color;
                    }
                    else
                    {
                       return getRandomColor();
                    }
                }
           // var duplicationCodeDetailsVM.selectedIndex=duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][compareFile].src[key].dataIndex;
                vm.showDuplicatedModal = function(diffInstance, lineNo, lineObj) {
                    var modalInstance = modalService.showModal({
                        templateUrl: 'app/details/templates/duplicated-by-modal-window.tpl.html',
                        controller: 'duplicatedByModalCtrl',
                        controllerAs: 'duplicatedByModalVM',
                        windowClass: 'action-modal',
                        resolve: { modalParam: function () { return { diffInstance: diffInstance,
                            activePath:vm.activePath,
                            lineNo:lineNo,
                            lineObj:lineObj,
                            selectedFiles:vm.selectedFiles
                        } } }
                    });

                    modalInstance.then(function(selectedFiles) {
                        vm.selectedFiles = selectedFiles;
                    });
                }
                $q.all([
                    metricsDetailsService.retrieveRedundantDetailsLOCData({ story_Id: story_id, lang: lang }).$promise,
                    metricsDashboardService.retrieveDashboardInfo({ story_Id: story_id, lang: lang }).$promise
                ]).then(function(values) {
                    vm.duplicateLOCDetails = values[0];
                    vm.overallLOCDetails = values[1];
                    vm.totalDuplicatedLOC = 0, percentage = 0;
                    vm.duplicateLOCDetails.map(function(item, index) {
                        vm.totalDuplicatedLOC += item.totalDuplicatedLines;
                    })
                    percentage = vm.totalDuplicatedLOC / vm.overallLOCDetails[0].loc * 100;

                    drawDonutChart(
                        '#donut1',
                        percentage,
                        150,
                        150,
                        ".35em"
                    );
                }, function(reason) {

                });

                vm.retrieveDuplicationDiff = function() {
                    metricsDetailsService.retrieveRedundantDetailsDiff({ storyId: story_id }, function(response) {
                        if (response && response.length > 0) {
                            vm.dulpicationResource = response[0];
                            if(vm.activePath)
                            {
                                vm.getDuplicatedByWithDiff(vm.activePath);
                            }
                        }
                    });
                }

                vm.lineIntendation = function(stringValue){
                 
                  return stringValue.replace(/.{80}/g, "$&" + "\n" + "\t"+"\t");

                }
                
                
                /*vm.duplicatedDiff = function(stringValue){
                 
                  return stringValue.replace(/.{200}/g, "$&" + "\n" + "\t"+"\t");

                }*/


                vm.getDuplicatedByWithDiff = function(activePath) {
                    if(!activePath){
                        return;
                    }
                    vm.activePath = activePath;
                    if (!vm.duplicatedDiff[activePath]) {
                        vm.duplicatedDiff[activePath] = { diffs: [] };
                        var sourceInstance = vm.duplicatedDiff[activePath];
                        if (!activePath) { return; }
                        if (vm.dulpicationResource) {
                            vm.dulpicationResource.data.map(function(data, dataIndex) {
                                if(vm.dulpicationResource.data.length >= vm.colorCode.length){
                                    vm.colorCode.push(getRandomColor());
                                }
                                if (isduplicated(activePath, data.instances)) {                                    
                                    data.instances.map(function(instance, instanceIndex) {
                                        if (!sourceInstance.hasOwnProperty(instance.path)) {
                                            sourceInstance[instance.path] = {};
                                            sourceInstance[instance.path].lines = [];
                                            sourceInstance[instance.path].src = {};
                                            sourceInstance[instance.path].duplicatedBy = {};
                                        }
                                        sourceInstance[instance.path].lines.push(instance.lines);
                                    });
                                    data.diffs.map(function(diff, index) {
                                        var extractedSrc = extractSourceFromDiff(diff, sourceInstance, dataIndex, index);
                                        for (var key in extractedSrc) {
                                            angular.extend(sourceInstance[key].src, extractedSrc[key]);
                                        }
                                        if (diff['-'].path == diff['+'].path) {
                                            sourceInstance[activePath].duplicationOccuredInSameFile = true;
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
                
                function extractSourceFromDiff(diffInstance,sourceInstance, dataIndex, diffIndex) {
                    var extractedSource = {};
                    extractedSource[diffInstance['-'].path] = extractedSource[diffInstance['-'].path] || {};
                    extractedSource[diffInstance['+'].path] = extractedSource[diffInstance['+'].path] || {};
                    var srcLns = diffInstance.diff.split(/\r\n|\r|\n/g), minusStart = diffInstance['-'].lines[0],
                        plusStart = diffInstance['+'].lines[0], 
                        minusBlockName = diffInstance['-'].lines[0] + '-' + diffInstance['-'].lines[1] + '-' + diffIndex, 
                        plusBlockName = diffInstance['+'].lines[0] + '-' +  diffInstance['+'].lines[1] + '-' + diffIndex;
                    srcLns.map(function(ln, index) {                        
                        var lineObj = {statement: ln, duplicatedBy:{}};
                        if (ln.startsWith('-') || !ln.startsWith('+')) {
                            createLnObj(minusStart,ln,diffInstance['-'], diffInstance['+'], 
                            extractedSource, sourceInstance, dataIndex, minusBlockName);
                            ++minusStart;
                        }
                        if (ln.startsWith('+') || !ln.startsWith('-')) {
                            createLnObj(plusStart,ln,diffInstance['+'], diffInstance['-'], 
                            extractedSource, sourceInstance, dataIndex, plusBlockName);
                            ++plusStart;
                        }

                    });
                    return extractedSource;
                }
                function createLnObj(lnNo,lnStatement, diffInstance1, diffInstance2, 
                extractedSource, sourceInstance, dataIndex, blockName)
                {
                    if(lnStatement.startsWith('-') || lnStatement.startsWith('+')) {
                        lnStatement = lnStatement.substring(1, lnStatement.length);

                    }
                    lineObj = {statement: lnStatement, duplicatedBy:{}, blockName:blockName, dataIndex:dataIndex};
                    lineObj.duplicatedBy[diffInstance2.lines[0]+ '-' + diffInstance2.lines[1]+ '-' + diffInstance1.path] = diffInstance2;
                    sourceInstance[diffInstance1.path].src[lnNo] && angular.extend(lineObj.duplicatedBy,sourceInstance[diffInstance1.path].src[lnNo].duplicatedBy);
                    sourceInstance[diffInstance1.path].duplicatedBy[diffInstance2.path] = sourceInstance[diffInstance1.path].duplicatedBy[diffInstance2.path] || {};
                    sourceInstance[diffInstance1.path].duplicatedBy[diffInstance2.path][diffInstance2.lines[0] + '-' + diffInstance2.lines[1]] = 0;
                    extractedSource[diffInstance1.path][lnNo] = lineObj;
                }
                function isduplicated(lookUpPath, instances) {
                    var duplicatedArr = instances.filter(function(instance) {
                        if (instance.path == lookUpPath) {
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
                $scope.$on('$destroy', function(){
                    sharedService.setActivePath('');
                });
                
                    /*vm.closeDiv = function hide(target) {
    document.getElementById(target).style.display = 'none';
}*/
               
                

        /*vm.genpdf= function(){
                html2canvas(document.body,{
                onrendered:function(canvas){
                var img=canvas.toDataURL('image/png');
                var doc=new jsPDF('l', 'mm', [350, 250]);
                doc.addImage(img,'JPEG',20,20);
                doc.save("details.pdf");
                }
                });
                };*/

                vm.retrieveDuplicationDiff();
              


            }]);
})();