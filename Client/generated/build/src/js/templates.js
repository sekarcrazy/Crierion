angular.module('templates-metrics_ui', ['app/dashboard/templates/dashboard.tpl.html', 'app/details/templates/duplicated-by-modal-window.tpl.html', 'app/details/templates/duplication-details.tpl.html', 'app/details/templates/issue-details.tpl.html', 'app/errorHandler/exception.tpl.html', 'app/global/templates/msgDialog.tpl.html', 'app/global/templates/tooltip.tpl.html', 'app/layout/templates/default.tpl.html', 'app/layout/templates/header.tpl.html', 'app/layout/templates/metrics-shell.tpl.html', 'app/layout/templates/nav.tpl.html']);

angular.module("app/dashboard/templates/dashboard.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/dashboard/templates/dashboard.tpl.html",
    "<div class=\"page page-dashboard\">\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <section class=\"panel panel-default\">\n" +
    "                <div class=\"panel-heading\"><strong><span class=\"glyphicon glyphicon-th-list\"></span> <span>Lines of Code</span></strong></div>\n" +
    "                <div class=\"panel-body\" >\n" +
    "                    <div class=\"row code-row\">\n" +
    "                        <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                            <h1 title=\"{{dashboardVM.dashboard.loc}}\">{{dashboardVM.kFormatter(dashboardVM.dashboard.loc)}}</h1>\n" +
    "                            <p>Lines of code</p>                            \n" +
    "                        </div>\n" +
    "                        <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                            <h1 title=\"{{dashboardVM.dashboard.files}}\">{{dashboardVM.kFormatter(dashboardVM.dashboard.files)}}</h1>\n" +
    "                            <p>Files</p>                            \n" +
    "                        </div>\n" +
    "                        <div class=\"col-lg-3 col-sm-6 col-xs-6\" ng-if=\"dashboardVM.dashboard.totalFunction>0\">\n" +
    "                            <h1 title=\"{{dashboardVM.dashboard.totalFunction}}\">{{dashboardVM.kFormatter(dashboardVM.dashboard.totalFunction)}}</h1>\n" +
    "                            <p>Functions</p>                            \n" +
    "                        </div>\n" +
    "                        <div class=\"col-lg-3 col-sm-6 col-xs-6 hover-color\">\n" +
    "                            <h1 title=\"{{dashboardVM.dashboard.isDupsPresent? dashboardVM.dashboard.numberOfDups : 0}}\"\n" +
    "                            style=\"cursor:pointer;\"\n" +
    "                            ng-click=\"shellVM.onStateChange(shellVM.CONST.details.DUPLICATION_DETAILS_ROUTER_NAME, dashboardVM.routeParams, $event)\">{{dashboardVM.kFormatter(dashboardVM.dashboard.isDupsPresent? dashboardVM.dashboard.numberOfDups : 0)}}</h1>\n" +
    "                            <p>Duplicated blocks</p>\n" +
    "                                                        \n" +
    "                        </div>\n" +
    "                 </div>\n" +
    "                   <div><nvd3 options=\"dashboardVM.options\" data=\"dashboardVM.data\" interactive=\"true\"\n" +
    "        tooltips=\"true\" tooltipcontent=\"dashboardVM.toolTipContentFunction()\"></nvd3></div>\n" +
    "                </div>\n" +
    "            </section> \n" +
    "        </div>       \n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <section class=\"panel panel-default\">\n" +
    "                <div class=\"panel-heading\"><strong><span class=\"glyphicon glyphicon-cloud-upload\"></span> <span>Code Coverage</span></strong></div>\n" +
    "                <div class=\"panel-body\" >\n" +
    "                <div class=\"row code-row\" ng-show=\"dashboardVM.testSummary===undefined\"><span class=\"col-md-12\">\n" +
    "                            <p class=\"size-h4\"><span>No Test Cases Found</span></p>\n" +
    "                        </span> </div>\n" +
    "                    <div class=\"row code-row\" ng-hide=\"dashboardVM.testSummary===undefined\">\n" +
    "                        <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                            <h1 title=\"{{dashboardVM.testSummary.pct}} %\">{{dashboardVM.testSummary.pct}}%</h1>\n" +
    "                            <p>Coverage</p>                            \n" +
    "                        </div>\n" +
    "                        <div class=\"col-lg-2 col-sm-2 col-xs-2\">\n" +
    "                            <h1 title=\"{{dashboardVM.testSummary.total}}\">{{dashboardVM.kFormatter(dashboardVM.testSummary.total)}}</h1>\n" +
    "                            <p>Test Cases</p>                            \n" +
    "                        </div>\n" +
    "                        <div class=\"col-lg-2 col-sm-2 col-xs-2\">\n" +
    "                            <h1 title=\"{{dashboardVM.testSummary.success}}\">{{dashboardVM.kFormatter(dashboardVM.testSummary.success)}}</h1>\n" +
    "                            <p>Passed</p>                            \n" +
    "                        </div>\n" +
    "                        <div class=\"col-lg-2 col-sm-2 col-xs-2\">\n" +
    "                            <h1 title=\"{{dashboardVM.testSummary.failed}}\"\n" +
    "                            style=\"cursor:pointer;\"\n" +
    "                            >{{dashboardVM.kFormatter(dashboardVM.testSummary.failed)}}</h1>\n" +
    "                            <p>Failed</p>                            \n" +
    "                        </div>\n" +
    "                            <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                            <h1 title=\"{{dashboardVM.testSummary.skipped}}\"\n" +
    "                            style=\"cursor:pointer;\"\n" +
    "                            >{{dashboardVM.kFormatter(dashboardVM.testSummary.skipped)}}</h1>\n" +
    "                            <p>Skipped</p>                            \n" +
    "                        </div>\n" +
    "                 </div>\n" +
    "                   <div><nvd3 options=\"dashboardVM.testReportChart\" data=\"dashboardVM.data\" interactive=\"true\"\n" +
    "                    tooltips=\"true\" tooltipcontent=\"dashboardVM.toolTipContentFunction()\"></nvd3></div>\n" +
    "                </div>\n" +
    "            </section> \n" +
    "        </div>       \n" +
    "    </div>\n" +
    "    \n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <section class=\"panel panel-default\">\n" +
    "                <div class=\"panel-heading\"><strong><span class=\"glyphicon glyphicon-random\"></span> <span>Duplication block metrics</span></strong></div>\n" +
    "                <div class=\"panel-body\" >\n" +
    "                    <div class=\"row\">\n" +
    "                        <span class=\"col-md-12\">\n" +
    "                            <p class=\"size-h4\"><span>Duplication block with lines of Code</span></p>\n" +
    "                        </span>  \n" +
    "                 </div>\n" +
    "                   <div ng-if=\"dashboardVM.redundantData\"><nvd3 options=\"dashboardVM.redundantDataOptions\" data=\"dashboardVM.redundantData\"></nvd3></div>\n" +
    "                    <div ng-if=\"!dashboardVM.redundantData\"> No duplication blocks found.</div>\n" +
    "                </div>\n" +
    "            </section> \n" +
    "        </div>       \n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"panel panel-default\">\n" +
    "                <div class=\"panel-heading\"><strong><span class=\"glyphicon glyphicon-zoom-in\"></span> <span data-i18n=\"Realtime Data\">Violations</span></strong></div>\n" +
    "                <div class=\"panel-body\">\n" +
    "                     <div  ng-if=\"!dashboardVM.violationData\">\n" +
    "                         No Issues found.\n" +
    "                     </div>\n" +
    "                    <div class=\"row code-row-x\" ng-if=\"dashboardVM.violationData\">                       \n" +
    "                        <div class=\"col-lg-2 col-sm-4 col-xs-12 text-center\">\n" +
    "                           <font ng-repeat=\"(key, value) in dashboardVM.violations\">\n" +
    "                             <h1 title=\"{{value}}\">{{dashboardVM.kFormatter(value)}}</h1>\n" +
    "                            <p class=\"letter-capitalize\">{{key}}</p>\n" +
    "                           </font>\n" +
    "                           <!--  <h1 title=\"{{dashboardVM.violations['error']}}\">{{dashboardVM.kFormatter(dashboardVM.violations['error'])}}</h1>\n" +
    "                            <p>Issues</p>\n" +
    "                            <h1 title=\"{{dashboardVM.violations['warning']}}\">{{dashboardVM.kFormatter(dashboardVM.violations['warning'])}}</h1>\n" +
    "                            <p>Warnings</p>                            \n" +
    "                            <h1 title=\"{{dashboardVM.violations['info']}}\">{{dashboardVM.kFormatter(dashboardVM.violations['info'])}}</h1>\n" +
    "                            <p>Info</p> -->\n" +
    "                        </div>\n" +
    "                         <div class=\"col-lg-5 piechart no-cursor nv-series\">\n" +
    "                           <nvd3 id=\"pieChart\" options=\"dashboardVM.pieChartoptions\" data=\"dashboardVM.violationData\"></nvd3>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-lg-5\">                           \n" +
    "                                <div class=\"box-info\">\n" +
    "                                <div class=\"panel panel-default\">\n" +
    "                                  <table class=\"table table-bordered cursor-pointer table-hover\" ng-click=\"shellVM.onStateChange(shellVM.CONST.issue.ISSUE_DETAILS_ROUTER_NAME, dashboardVM.routeParams, $event)\">\n" +
    "                                        <thead>\n" +
    "                                            <tr>\n" +
    "                                                <th>Severity</th>\n" +
    "                                                <th>Nos</th>\n" +
    "                                            </tr>\n" +
    "                                        </thead>\n" +
    "                                        <tbody>\n" +
    "                                            <tr ng-if=\"dashboardVM.issuesCountInfo.blocker>0\">\n" +
    "                                                <td>Blocker</td>\n" +
    "                                                <td><span class=\"badge badge-error blocker\">{{dashboardVM.issuesCountInfo.blocker}}</span></td>\n" +
    "                                            </tr>\n" +
    "                                           <tr  ng-if=\"dashboardVM.issuesCountInfo.critical>0\">\n" +
    "                                                <td>Critical</td>\n" +
    "                                                <td><span class=\"badge badge-error critical\">{{dashboardVM.issuesCountInfo.critical}}</span></td>\n" +
    "                                            </tr>\n" +
    "                                            <tr  ng-if=\"dashboardVM.issuesCountInfo.major>0\">\n" +
    "                                                <td>Major</td>\n" +
    "                                                <td><span class=\"badge badge-info\">{{dashboardVM.issuesCountInfo.major}}</span></td>\n" +
    "                                            </tr>\n" +
    "                                            <tr  ng-if=\"dashboardVM.issuesCountInfo.minor>0\">\n" +
    "                                                <td>Minor</td>\n" +
    "                                                <td><span class=\"badge badge-success\">{{dashboardVM.issuesCountInfo.minor}}</span></td>\n" +
    "                                            </tr>\n" +
    "                                            <tr ng-repeat=\"(key, value) in dashboardVM.violations\">\n" +
    "                                               <td class=\"letter-capitalize\">{{key}}</td>\n" +
    "                                               <td><span class=\"badge badge-info\">{{dashboardVM.getViolationDataByType(key)}}</span></td>\n" +
    "                                           </tr>\n" +
    "                                            <!-- <tr>\n" +
    "                                                <td>Info</td>\n" +
    "                                                <td><span class=\"badge badge-info\">{{dashboardVM.getViolationDataByType('info')}}</span></td>\n" +
    "                                            </tr>\n" +
    "                                            <tr>\n" +
    "                                                <td>Warnings</td>\n" +
    "                                                <td><span class=\"badge badge-warning\">{{dashboardVM.getViolationDataByType('warning')}}</span></td>\n" +
    "                                            </tr> -->\n" +
    "                                        </tbody>\n" +
    "                                    </table>\n" +
    "                                 </div>\n" +
    "                                \n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        </div>\n" +
    "                    </div>                   \n" +
    "                </div>\n" +
    "            </div>        \n" +
    "   \n" +
    "</div>\n" +
    "  ");
}]);

angular.module("app/details/templates/duplicated-by-modal-window.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/details/templates/duplicated-by-modal-window.tpl.html",
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"modal-close btn-link pull-right\" data-dismiss=\"modal\" aria-hidden=\"true\" title=\"Close\" ng-click=\"duplicatedByModalVM.close()\"\n" +
    "    <i class=\"glyphicon glyphicon-remove\"></i></button>\n" +
    "    <h4 class=\"modal-title\">{{duplicatedByModalVM.header}}</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" style=\"height:320px;overflow:auto;\">\n" +
    "    <div ng-if=\"duplicatedByModalVM.lineNo\" class=\"callout callout-info\">{{duplicatedByModalVM.selectedBlockName && (duplicatedByModalVM.selectedBlockName + ' blocks of coded duplicated in the below mentioned File(s)')}}</div>\n" +
    "    <table id=\"mytable\" class=\"table table-striped table-bordered\">\n" +
    "\n" +
    "        <thead>\n" +
    "            <th>\n" +
    "                <input type=\"checkbox\" ng-model=\"duplicatedByModalVM.isSelectAll\" ng-change=\"duplicatedByModalVM.selectAll(duplicatedByModalVM.isSelectAll)\" />\n" +
    "            </th>\n" +
    "            <th>Files</th>\n" +
    "            <th>Lines</th>\n" +
    "        </thead>\n" +
    "        <tbody checkbox-list ng-model=\"duplicatedByModalVM.selectedFiles\">\n" +
    "\n" +
    "            <tr ng-repeat=\"(key, value) in duplicatedByModalVM.duplicatedBy\" \n" +
    "            ng-if=\"key != duplicatedByModalVM.activePath || (key == duplicatedByModalVM.activePath && duplicatedByModalVM.duplicationOccuredInSameFile) \">\n" +
    "                <td>\n" +
    "                    <input type=\"checkbox\" class=\"checkthis\" value=\"{{key}}\" ng-model=\"duplicatedByModalVM.copyOfDuplicatedBy[key].isSelected\" ng-change=\"duplicatedByModalVM.onFileChckChange()\" />\n" +
    "                </td>\n" +
    "                <td><span>{{key}}</span></td>\n" +
    "                <td><span ng-repeat=\"(key, value) in value\">{{key}} <span ng-hide=\"$last\">,</span></span></td>\n" +
    "            </tr>\n" +
    "            \n" +
    "        </tbody>\n" +
    "\n" +
    "    </table>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <div class=\"rs-btn-group\" style=\"float:right;\">\n" +
    "        <button ng-repeat=\"bt in duplicatedByModalVM.buttons\" style=\"margin:0 5px;\" class=\"btn\" ng-class=\"bt.cssClass\" ng-click=\"duplicatedByModalVM.onButtonClick(bt.result)\"\n" +
    "        ng-bind=\"bt.label\"></button>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/details/templates/duplication-details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/details/templates/duplication-details.tpl.html",
    "<div class=\"row\">\n" +
    "            <div class=\"col-md-12 panel-default\">\n" +
    "                <ol class=\"breadcrumb panel-heading margin-muted\">\n" +
    "                <li><a href=\"#/\"><i class=\"glyphicon glyphicon-picture text-12\"></i> {{duplicationCodeDetailsVM.story_Type}}</a></li>\n" +
    "                <li><a style=\"cursor:pointer\" ng-click=\"duplicationCodeDetailsVM.onStateChange(duplicationCodeDetailsVM.CONST.dashboard.DASHBOARD_ROUTER_NAME,\n" +
    "                $event)\"><i class=\"fa fa-file-code-o text-12\"></i> {{duplicationCodeDetailsVM.project_Name}}</a></li>\n" +
    "                <li><a style=\"cursor:pointer\" ng-click=\"duplicationCodeDetailsVM.selectedFiles = []\"><i class=\"fa fa-files-o text-12\"></i> Duplications</a></li>\n" +
    "                </ol>\n" +
    "             </div>\n" +
    "        </div>\n" +
    "    <div class=\"page page-dashboard\">\n" +
    "    \n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <section class=\"panel panel-default\">\n" +
    "                    <div class=\"panel-heading\"><strong><span class=\"glyphicon glyphicon-th-list\"></span> <span>DUPLICATIONS</span></strong></div>\n" +
    "                    <div class=\"panel-body\">\n" +
    "                        <div class=\"row code-row\">\n" +
    "                            <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                                <div class=\"zipper\">\n" +
    "                                    <div class=\"target\">\n" +
    "                                        <div id=\"donut1\"></div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "\n" +
    "                            <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                                <h1>{{duplicationCodeDetailsVM.overallLOCDetails[0].numberOfDups}}</h1>\n" +
    "                                <p>Duplicated Blocks</p>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                                <h1>{{duplicationCodeDetailsVM.duplicateLOCDetails.length}}</h1>\n" +
    "                                <p>Duplicated Files</p>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                                <h1>{{duplicationCodeDetailsVM.totalDuplicatedLOC}}</h1>\n" +
    "                                <p>Duplicated LOC</p>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </section>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div id='reference' ng-if=\"!duplicationCodeDetailsVM.selectedFiles || duplicationCodeDetailsVM.selectedFiles.length == 0\" ng-class=\"{'col-md-5 padding-right-muted': duplicationCodeDetailsVM.activePath,'col-md-12':!duplicationCodeDetailsVM.activePath}\">\n" +
    "                <div class=\"panel panel-default\">\n" +
    "                    <div class=\"panel-heading\"><strong><span class=\"glyphicon glyphicon-list\"></span> <span data-i18n=\"Realtime Data\">LIST OF FILES</span></strong>\n" +
    "                     <!-- <button class=\"btn btn-xs btn btn-warning pull-right\" ng-click=\"duplicationCodeDetailsVM.genpdf()\"><i class=\"fa fa-file-pdf-o\" aria-hidden=\"true\"> export to pdf</i> --></button>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                                    <div class=\"panel-body padding-muted\">\n" +
    "                   <div id=\"scroll\" jq-slim-scroll slim-scroll-option=\"{{duplicationCodeDetailsVM.slimScrollOptions}}\">\n" +
    "                        <table class=\"table table-hover \">\n" +
    "                            <thead>\n" +
    "                                <tr>\n" +
    "                                    <th col-md-1>#</th>\n" +
    "                                    <th col-md-2>File Names</th>\n" +
    "                                    <th col-md-5>Blocks</th>\n" +
    "                                    <th col-md-4>LOC</th>\n" +
    "                                </tr>\n" +
    "                            </thead>\n" +
    "                            <tbody>\n" +
    "                                <tr ng-repeat=\"file in duplicationCodeDetailsVM.duplicateLOCDetails\" ng-click=\"duplicationCodeDetailsVM.getDuplicatedByWithDiff(file.path)\" ng-class=\"{'row-active': duplicationCodeDetailsVM.activePath == file.path}\">\n" +
    "                                    <td col-md-1>{{$index + 1}}</td>\n" +
    "                                    <td col-md-2 style=\"word-break:break-word;\"><span tooltip-placement=\"top\" tooltip=\"{{file.path}}\">{{file.path.substr(file.path.lastIndexOf('/') + 1)}}</span></td>\n" +
    "                                    <td col-md-5>{{file.numberOfDups}}</td>\n" +
    "                                    <td col-md-4>{{file.totalDuplicatedLines}}</td>\n" +
    "                                </tr>\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "             <div class=\"col-md-12\" id=\"flash\" ng-show=\"duplicationCodeDetailsVM.selectedFiles && duplicationCodeDetailsVM.selectedFiles.length > 0\">\n" +
    "                <div class=\"panel\">\n" +
    "                    <div class=\"panel-body\">\n" +
    "                    <div class=\"alert alert-info margin-muted\">\n" +
    "                         <span>Note:There are {{duplicationCodeDetailsVM.selectedFiles.length}} files found to compare, You can change files by clicking on below selectbox</span>\n" +
    "                    </div>\n" +
    "                   <!--  <span id='close' ng-click=\"duplicationCodeDetailsVM.closeDiv('flash')\">x</span> -->\n" +
    "           \n" +
    "            \n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-if=\"duplicationCodeDetailsVM.activePath\" class=\"code-seperator\" ng-class=\"{'col-md-6 padding-right-muted': duplicationCodeDetailsVM.selectedFiles && duplicationCodeDetailsVM.selectedFiles.length > 0, \n" +
    "                'col-md-7  padding-left-muted': !duplicationCodeDetailsVM.selectedFiles || duplicationCodeDetailsVM.selectedFiles.length == 0}\">\n" +
    "                <div class=\"panel panel-default margin-muted \">\n" +
    "\n" +
    "                     <div class=\"panel-heading \"><strong><span class=\"fa fa-file-code-o\"></span> <span data-i18n=\"Realtime Data\">DUPLICATED FILES</span> <span class=\"letter-lower margin-muted\"><label class=\"margin-muted\" tooltip-placement=\"top\" tooltip=\"{{duplicationCodeDetailsVM.activePath}}\">&nbsp;({{duplicationCodeDetailsVM.activePath.substr(duplicationCodeDetailsVM.activePath.lastIndexOf('/') + 1)}})</label></span></strong>                    \n" +
    "                        <button class=\"btn btn-xs btn-primary pull-right\" ng-hide=\"duplicationCodeDetailsVM.selectedFiles && duplicationCodeDetailsVM.selectedFiles.length > 0\" ng-click=\"duplicationCodeDetailsVM.showDuplicatedModal(duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath])\">Duplications</button>\n" +
    "                        \n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"panel-body padding-muted\">\n" +
    "                        <div id=\"scroll\" jq-slim-scroll slim-scroll-option=\"{{duplicationCodeDetailsVM.slimScrollOptions}}\">\n" +
    "                        <table class=\"source-table\">\n" +
    "                            <tbody>                            \n" +
    "                               <tr class=\"source-line\" ng-repeat=\"key in duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath].src | transformObjKeysToArr\"\n" +
    "                                    data-line-number=\"{{key}}\"\n" +
    "                                    ng-class=\"{'empty-cell': duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath].src[key].statement == ''}\">\n" +
    "                                    <td class=\"source-meta source-line-number\" data-line-number=\"{{key}}\"></td>\n" +
    "\n" +
    "                                    <td class=\"source-meta source-line-scm\" data-line-number=\"{{key}}\">\n" +
    "                                    </td>\n" +
    "                                    \n" +
    "                                    <td class=\"source-meta source-line-duplications\" style=\"cursor:pointer;\" ng-click=\"duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath].src[key].statement != '' && \n" +
    "                                    duplicationCodeDetailsVM.showDuplicatedModal(duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath], key, duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath].src[key])\"\n" +
    "                                    ng-style=\"{'background-color': duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath].src[key].statement != '' ? duplicationCodeDetailsVM.colorCode[duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath].src[key].dataIndex] : ''}\">\n" +
    "                                        <div class=\"source-line-bar\" tooltip-template=\"app/global/templates/tooltip.tpl.html\" tooltip-scope=\"duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath].src[key]\" tooltip-append-element=\"body\"></div>\n" +
    "                                    </td>\n" +
    "\n" +
    "\n" +
    "                                    <td class=\"source-meta source-line-issues \" data-line-number=\"{{key}}\">\n" +
    "                                    </td>\n" +
    "\n" +
    "                                    <td class=\"source-meta source-line-filtered-container\" data-line-number=\"{{key}}\">\n" +
    "                                        <div class=\"source-line-bar\"></div>\n" +
    "                                    </td>\n" +
    "\n" +
    "                                    <td class=\"source-line-code code \" data-line-number=\"{{key}}\" ng-style=\"{'background-color': duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath].src[key].statement != '' ? duplicationCodeDetailsVM.colorCode[duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath].src[key].dataIndex] : ''}\" >\n" +
    "                                        <div class=\"source-line-code-inner\" >\n" +
    "                                            <span class=\"cd\" style=\"white-space: pre;\" >{{duplicationCodeDetailsVM.lineIntendation(duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.activePath].src[key].statement)}}</span>\n" +
    "\n" +
    "                                            <div class=\"source-line-issue-locations\"></div>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                    </td>\n" +
    "                                </tr>\n" +
    "\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            \n" +
    "            \n" +
    "            <!-- second column -->\n" +
    "            <div class=\"col-md-6 ng-scope padding-left-muted code-seperator\" ng-if=\"duplicationCodeDetailsVM.selectedFiles &amp;&amp; duplicationCodeDetailsVM.selectedFiles.length > 0\"  ng-class=\"{'padding-right-muted':($index % 2 == 1)}\">\n" +
    "                <div class=\"panel panel-default margin-muted\">\n" +
    "\n" +
    "                    <div class=\"panel-heading selectbox-heading\"><strong><span class=\"fa fa-file-code-o\"></span> <span data-i18n=\"Realtime Data\">COMPARED FILES</span><span style=\"text-transform: lowercase;\" tooltip-placement=\"top\" tooltip=\"{{compareFile}}\"></span></strong>\n" +
    "                        <span class=\"ui-select pull-right margin-muted\">\n" +
    "                            \n" +
    "                             <select ng-model=\"selectedFile\" ng-init=\"selectedFile=duplicationCodeDetailsVM.selectedFiles[0]\" ng-options=\"compareFile as compareFile.substr(compareFile.lastIndexOf('/') + 1) for compareFile in duplicationCodeDetailsVM.selectedFiles\">\n" +
    "                           \n" +
    "                           </select>   \n" +
    "                          </span>\n" +
    "                        </div>\n" +
    "                    <div class=\"panel-body padding-muted\">\n" +
    "                        <div id=\"scroll\" jq-slim-scroll slim-scroll-option=\"{{duplicationCodeDetailsVM.slimScrollOptions}}\">                       \n" +
    "                        <table class=\"source-table\">\n" +
    "                            <tbody>                            \n" +
    "                               <tr class=\"source-line\" ng-repeat=\"key in duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src | transformObjKeysToArr\"\n" +
    "                                    data-line-number=\"{{key}}\"\n" +
    "                                    ng-class=\"{'empty-cell': duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src[key].statement == ''}\">\n" +
    "                                    <td class=\"source-meta source-line-number\" data-line-number=\"{{key}}\"></td>\n" +
    "\n" +
    "                                    <td class=\"source-meta source-line-scm\" data-line-number=\"{{key}}\">\n" +
    "                                        \n" +
    "                                    </td>\n" +
    "                                    \n" +
    "                                    <td class=\"source-meta source-line-duplications\" style=\"cursor:pointer;\" ng-click=\"duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src[key].statement != '' && \n" +
    "                                    duplicationCodeDetailsVM.showDuplicatedModal(duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile], key, duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][duplicationCodeDetailsVM.selectedFiles[0]].src[key]);duplicationCodeDetailsVM.selectedIndex=duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src[key].dataIndex\"\n" +
    "                                    ng-style=\"{'background-color': duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src[key].statement != '' ? duplicationCodeDetailsVM.colorCode[duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src[key].dataIndex] : ''}\">                                \n" +
    "                                        <div class=\"source-line-bar\" tooltip-template=\"app/global/templates/tooltip.tpl.html\" tooltip-scope=\"duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src[key]\" tooltip-append-element=\"body\"></div>\n" +
    "                                    </td>\n" +
    "\n" +
    "\n" +
    "                                    <td class=\"source-meta source-line-issues \" data-line-number=\"{{key}}\">\n" +
    "                                    </td>\n" +
    "\n" +
    "                                    <td class=\"source-meta source-line-filtered-container\" data-line-number=\"{{key}}\">\n" +
    "                                        <div class=\"source-line-bar\" ></div>\n" +
    "                                    </td>\n" +
    "\n" +
    "                                    <td class=\"source-line-code code\" ng-style=\"{'background-color': duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src[key].statement != '' ? duplicationCodeDetailsVM.colorCode[duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src[key].dataIndex] : ''}\"  data-line-number=\"{{key}}\">\n" +
    "                                        <div class=\"source-line-code-inner\" ng-style=\"{'background-color': duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src[key].statement != '' ? duplicationCodeDetailsVM.colorCode[duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src[key].dataIndex] : ''}\">\n" +
    "                                            <span class=\"cd\" style=\"white-space: pre;\">{{duplicationCodeDetailsVM.lineIntendation(duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][selectedFile].src[key].statement)}}</span>\n" +
    "\n" +
    "                                            <div class=\"source-line-issue-locations\"></div>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                    </td>\n" +
    "                                </tr>\n" +
    "\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            </div>\n" +
    "    </div>");
}]);

angular.module("app/details/templates/issue-details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/details/templates/issue-details.tpl.html",
    "<div class=\"row\">\n" +
    "            <div class=\"col-md-12 panel-default\">\n" +
    "                <ol class=\"breadcrumb panel-heading margin-muted\">\n" +
    "                <li><a href=\"#/\"><i class=\"glyphicon glyphicon-picture text-12\"></i> {{issueCodeDetailsVM.story_Type}}</a></li>\n" +
    "                <li><a style=\"cursor:pointer\" ng-click=\"issueCodeDetailsVM.onStateChange(issueCodeDetailsVM.CONST.dashboard.DASHBOARD_ROUTER_NAME,\n" +
    "                $event)\"><i class=\"fa fa-file-code-o text-12\"></i> {{issueCodeDetailsVM.project_Name}}</a></li>\n" +
    "                <li class=\"active\"><i class=\"fa fa-times-circle-o text-12\"></i> Issues</li>\n" +
    "                </ol>\n" +
    "             </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "                <div class=\"page page-dashboard\">\n" +
    "                <div class=\"row\">\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <section class=\"panel panel-default\">\n" +
    "                                <div class=\"panel-heading\"><strong><span class=\"glyphicon glyphicon-th-list\"></span> <span>ISSUES</span></strong></div>\n" +
    "                                <div class=\"panel-body\">\n" +
    "                                    <div class=\"row code-row\">\n" +
    "                                        <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                                            <div class=\"zipper\">\n" +
    "                                                <div class=\"target\">\n" +
    "                                                    <div id=\"donut1\"></div>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                        <div class=\"col-lg-3 col-sm-6 col-xs-6\" ng-repeat=\"(key, value) in issueCodeDetailsVM.violations\">\n" +
    "                                            <h1>{{issueCodeDetailsVM.violations[key]}}</h1>\n" +
    "                                            <h3 class=\"letter-capitalize\">{{key}}</h3>\n" +
    "                                            <p style=\"font-size: 14px; margin-top: -8px;\"></p>\n" +
    "                                        </div>\n" +
    "                                        <!--  <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                                            <h1>{{issueCodeDetailsVM.violations.info}}</h1>\n" +
    "                                            <h3>Info</h3>\n" +
    "                                            <p style=\"font-size: 14px; margin-top: -8px;\"></p>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                                            <h1>{{issueCodeDetailsVM.violations.warning}}</h1>\n" +
    "                                            <h3>Warnings</h3>\n" +
    "                                            <p style=\"font-size: 14px; margin-top: -8px;\"></p>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-lg-3 col-sm-6 col-xs-6\">\n" +
    "                                            <h1>{{issueCodeDetailsVM.violations.error}}</h1>\n" +
    "                                            <h3>Issues</h3>\n" +
    "                                            <p style=\"font-size: 14px; margin-top: -8px;\"></p>\n" +
    "                                        </div> -->\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                            </section>\n" +
    "                        </div>\n" +
    "                        </div>\n" +
    "                   <div class=\"row\" >\n" +
    "                    <div ng-class=\"{'col-md-5 padding-right-muted': issueCodeDetailsVM.issueElement ,'col-md-12':!issueCodeDetailsVM.issueElement}\" >\n" +
    "                            <div class=\"panel panel-default\"+>\n" +
    "                                <div class=\"panel-heading\"><strong><span class=\"glyphicon glyphicon-list-alt\"></span> <span data-i18n=\"Realtime Data\">LIST OF FILES </span>\n" +
    "                                <!-- <button class=\"btn btn-xs btn btn-warning pull-right\" ng-click=\"issueCodeDetailsVM.genpdf()\"><i class=\"fa fa-file-pdf-o\" aria-hidden=\"true\"> export to pdf</i></button> --></strong>\n" +
    "                                \n" +
    "                                </div>\n" +
    "   \n" +
    "    <div jq-slim-scroll slim-scroll-option=\"{{issueCodeDetailsVM.slimScrollOptions}}\" id=\"scroll\">\n" +
    "                                <div class=\"panel-body padding-muted\"> \n" +
    "                                   \n" +
    "                                    <table class=\"table table-hover table-bordered\">\n" +
    "                                        <thead>\n" +
    "                                            <tr class=\"header\">\n" +
    "                                                <th col-md-1>#</th>\n" +
    "                                                <th col-md-2>File Names</th>\n" +
    "                                                <th col-md-5>Blockers</th>\n" +
    "                                                <th col-md-4>Critical</th>\n" +
    "                                                <th col-md-5>Major</th>\n" +
    "                                                <th col-md-4>Minor</th>\n" +
    "                                                <th col-md-5>Info</th>\n" +
    "                                                <th col-md-4>Warning</th> \n" +
    "                                            </tr>\n" +
    "                                        </thead>\n" +
    "                                        <tbody> \n" +
    "                                            <tr ng-repeat=\"file in issueCodeDetailsVM.pmdinfo track by $index\" ng-class=\"{'selected':$index == selectedRow}\" ng-click=\"issueCodeDetailsVM.expandIssue($event,$index, \n" +
    "                                            file.name)\" >\n" +
    "                                           \n" +
    "                                                <td col-md-1>{{$index + 1}}</td>\n" +
    "                                                <td  col-md-2 style=\"word-break:break-word;\"><span tooltip-placement=\"top\" tooltip=\"{{file.name}}\">{{file.name.substr(file.name.lastIndexOf('/') + 1)}}</span></td>\n" +
    "                                                <td col-md-5><span class=\"badge badge-error blocker\">{{file.blockers}}</span></td>\n" +
    "                                                <td col-md-4><span class=\"badge badge-error critical\">{{file.critical}}</span></td>\n" +
    "                                                <td col-md-5><span class=\"badge badge-info\">{{file.major}}</span></td>\n" +
    "                                                <td col-md-4><span class=\"badge badge-success\">{{file.minor}}</span></td>\n" +
    "                                                 <td col-md-5><span class=\"badge badge-info\">{{file.info}}</span></td>\n" +
    "                                                <td col-md-4><span class=\"badge badge-warning\">{{file.warning}}</span></td>\n" +
    "                                            </tr>\n" +
    "                                        </tbody>\n" +
    "                                    </table>\n" +
    "                                    \n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "    </div>\n" +
    "\n" +
    "                            <div class=\"col-md-7 padding-left-muted code-seperator\">   \n" +
    "                                <div class=\"panel panel-default margin-muted\" ng-show='issueCodeDetailsVM.issueElement'>\n" +
    "\n" +
    "                            <div class=\"panel-heading\"><strong><span class=\"glyphicon glyphicon-list\" ></span>  ISSUE FILES</span></strong> <span class=\"pull-right letter-lower\"><label  tooltip-placement=\"top\" tooltip=\"{{fileName}}\">{{fileName.substr(fileName.lastIndexOf('/') + 1)}}</label> </span></div>\n" +
    "                             \n" +
    "                                <div class=\"panel-body padding-muted\">\n" +
    "                                    <div jq-slim-scroll slim-scroll-option=\"{{issueCodeDetailsVM.slimScrollOptions}}\">\n" +
    "                                    <table class=\"table \">\n" +
    "                                        <thead>\n" +
    "                                        <tr>\n" +
    "                                            <th style=\"padding:2px;\"></th>\n" +
    "                                            <th col-md-2>Line No</th>\n" +
    "                                            <th col-md-2>Method</th>\n" +
    "                                            <th col-md-2>Priority</th>\n" +
    "                                            <th col-md-2>complexityCyclomatic</th>\n" +
    "\n" +
    "\n" +
    "                                        </tr>\n" +
    "                                        </thead>\n" +
    "                                        <tbody>\n" +
    "\n" +
    "                                            <tr class=\"files-row\" style=\"text-transform: lowercase;\" ng-repeat=\"item in issueCodeDetailsVM.pmdIssue track by $index\">\n" +
    "\n" +
    "                                                <td style=\"padding: 0;\" ng-class=\"{'issue-error':(item.priority==='error'),'issue-info':(item.priority==='info'), 'issue-warn':(item.priority==='warning')}\">\n" +
    "                                                    \n" +
    "                                                </td>\n" +
    "                                                <td col-md-2 style=\"word-break:break-word;\">{{item.beginline}}</td>\n" +
    "                                                <td col-md-4>{{item.method}}</td>\n" +
    "                                                <td col-md-4>{{item.priority}}</td>\n" +
    "                                                <td col-md-5>{{item.complexityCyclomatic}}</td>\n" +
    "                                                </tr>\n" +
    "                                        </tbody>\n" +
    "                                    </table>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "\n" +
    "                            </div>\n" +
    "                     </div>\n" +
    "                     </div>\n" +
    "                     </div>\n" +
    "                     </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                       \n" +
    "                        ");
}]);

angular.module("app/errorHandler/exception.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/errorHandler/exception.tpl.html",
    "<div ng-hide=\"errors == undefined || errors.length == 0\">\n" +
    "   \n" +
    "    <script  type=\"text/ng-template\" id=\"/errorTemplate.html\">\n" +
    "       <em ng-bind=\"err.message\"></em>\n" +
    "    </script>\n" +
    "\n" +
    "<div class=\"notification-container\">\n" +
    "                <div class=\"notification-bar\" ng-class=\"getClassName()\">\n" +
    "                    <div class=\"notification-controls\">                        \n" +
    "                        <button class=\"close-icon modal-close btn-link\" type=\"button\" \n" +
    "                        ng-click=\"deleteError($index)\">&times;</button></div> \n" +
    "                    <div style=\"position:absolute; top:-1px;\"><i class=\"fa\" ng-class=\"{'WARNING': 'fa-exclamation-circle', 'ERROR': 'fa-times-circle' , 'SUCCESS': 'fa-check-circle', 'VALIDATION': 'fa-exclamation-triangle'}[errors[0].type]\" ></i> {{errors[0].type}}</div>\n" +
    "                    <ul style=\"list-style-type:disc;margin:0; padding:10px 10px 0px 17px;\">\n" +
    "                      <li style=\"display:list-item;\" ng-repeat=\"err in errors\" ng-init=\"onErrorAdded();\">\n" +
    "                          <div ng-switch on=\"err.type\">                            \n" +
    "                            <div ng-switch-default>\n" +
    "                                <ng-include src=\"'/errorTemplate.html'\"></ng-include>\n" +
    "                            </div>\n" +
    "                         </div> \n" +
    "     \n" +
    "                      </li>\n" +
    "                   </ul>\n" +
    "                </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("app/global/templates/msgDialog.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/global/templates/msgDialog.tpl.html",
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"modal-close btn-link\" data-dismiss=\"modal\" aria-hidden=\"true\" title=\"Close\" ng-click=\"msgDialog.close()\"></button>\n" +
    "            <h3 class=\"modal-title\" ng-bind=\"msgDialog.header\"></h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body device-details-Cont\" ng-bind=\"msgDialog.msg\">\n" +
    "    \n" +
    "</div>\n" +
    "     \n" +
    "<div class=\"modal-footer\">\n" +
    "     <div class=\"rs-btn-group\" style=\"float:right;\">                       \n" +
    "          <button ng-repeat = \"bt in msgDialog.buttons\" style=\"margin:0 5px;\"\n" +
    "              class=\"rs-btn modify-selected rs-popover-source\" ng-class=\"bt.cssClass\"\n" +
    "              ng-click=\"msgDialog.onButtonClick(bt.result)\" ng-bind=\"bt.label\"></button>\n" +
    "     </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("app/global/templates/tooltip.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/global/templates/tooltip.tpl.html",
    "<div class=\"popover fade right in popover-padding\" role=\"tooltip\" style=\"display: block;\">\n" +
    "    <div class=\"arrow\"></div>\n" +
    "    <h3 class=\"popover-title\">Duplicated By</h3>\n" +
    "    <div class=\"popover-content\">\n" +
    "    	<ol>\n" +
    "        <div ng-repeat=\"(key, value) in tooltip.tooltipDataContext.duplicatedBy\">\n" +
    "            <li>{{value.path.substr(value.path.lastIndexOf('/') + 1)}} : {{value.lines[0] + '-' + value.lines[1]}}</li>\n" +
    "        </div>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/layout/templates/default.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/layout/templates/default.tpl.html",
    "<div></div>");
}]);

angular.module("app/layout/templates/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/layout/templates/header.tpl.html",
    "<header class=\"clearfix\">\n" +
    "    <a href=\"#/\" data-ng-show=\"shellVM.showNav\" data-toggle-min-nav\n" +
    "                 class=\"toggle-min\"\n" +
    "                 ><i class=\"fa fa-bars\"></i></a>\n" +
    "\n" +
    "    <!-- Logo -->\n" +
    "    <div class=\"logo\">\n" +
    "        <a href=\"#/\">\n" +
    "           <img src=\"../../../img/Criterion_Logo_Web.png\" width=\"148\" height=\"32\">\n" +
    "        </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- needs to be put after logo to make it working-->\n" +
    "    <div class=\"menu-button\" toggle-off-canvas>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"top-nav\">\n" +
    "        <ul class=\"nav-left list-unstyled\">\n" +
    "            <!--\n" +
    "            <li class=\"dropdown\" dropdown is-open=\"isopenComment\">\n" +
    "                <a href=\"javascript:;\" class=\"dropdown-toggle\" dropdown-toggle ng-disabled=\"disabled\">\n" +
    "                    <i class=\"fa fa-comment-o\"></i>\n" +
    "                    <span class=\"badge badge-success\">2</span>\n" +
    "                </a>\n" +
    "                <div class=\"dropdown-menu with-arrow panel panel-default\">\n" +
    "                    <div class=\"panel-heading\">\n" +
    "                        You have 2 messages.\n" +
    "                    </div>\n" +
    "                    <ul class=\"list-group\">\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <a href=\"javascript:;\" class=\"media\">\n" +
    "                                <span class=\"media-left media-icon\">\n" +
    "                                    <span class=\"round-icon sm bg-info\"><i class=\"fa fa-comment-o\"></i></span>\n" +
    "                                </span>\n" +
    "                                <div class=\"media-body\">\n" +
    "                                    <span class=\"block\">Jane sent you a message</span>\n" +
    "                                    <span class=\"text-muted\">3 hours ago</span>\n" +
    "                                </div>\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <a href=\"javascript:;\" class=\"media\">\n" +
    "                                <span class=\"media-left media-icon\">\n" +
    "                                    <span class=\"round-icon sm bg-danger\"><i class=\"fa fa-comment-o\"></i></span>\n" +
    "                                </span>\n" +
    "                                <div class=\"media-body\">\n" +
    "                                    <span class=\"block\">Lynda sent you a mail</span>\n" +
    "                                    <span class=\"text-muted\">9 hours ago</span>\n" +
    "                                </div>\n" +
    "                            </a>\n" +
    "                        </li>                       \n" +
    "                    </ul>\n" +
    "                    <div class=\"panel-footer\">\n" +
    "                        <a href=\"javascript:;\">Show all messages.</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"dropdown\" dropdown is-open=\"isopenEmail\">\n" +
    "                <a href=\"javascript:;\" class=\"dropdown-toggle\" dropdown-toggle ng-disabled=\"disabled\" >\n" +
    "                    <i class=\"fa fa-envelope-o\"></i>\n" +
    "                    <span class=\"badge badge-info\">3</span>\n" +
    "                </a>\n" +
    "                <div class=\"dropdown-menu with-arrow panel panel-default\">\n" +
    "                    <div class=\"panel-heading\">\n" +
    "                        You have 3 mails.\n" +
    "                    </div>\n" +
    "                    <ul class=\"list-group\">\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <a href=\"javascript:;\" class=\"media\">\n" +
    "                                <span class=\"media-left media-icon\">\n" +
    "                                    <span class=\"round-icon sm bg-warning\"><i class=\"fa fa-envelope-o\"></i></span>\n" +
    "                                </span>\n" +
    "                                <div class=\"media-body\">\n" +
    "                                    <span class=\"block\">Lisa sent you a mail</span>\n" +
    "                                    <span class=\"text-muted block\">2min ago</span>\n" +
    "                                </div>\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <a href=\"javascript:;\" class=\"media\">\n" +
    "                                <span class=\"media-left media-icon\">\n" +
    "                                    <span class=\"round-icon sm bg-info\"><i class=\"fa fa-envelope-o\"></i></span>\n" +
    "                                </span>\n" +
    "                                <div class=\"media-body\">\n" +
    "                                    <span class=\"block\">Jane sent you a mail</span>\n" +
    "                                    <span class=\"text-muted\">3 hours ago</span>\n" +
    "                                </div>\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <a href=\"javascript:;\" class=\"media\">\n" +
    "                                <span class=\"media-left media-icon\">\n" +
    "                                    <span class=\"round-icon sm bg-success\"><i class=\"fa fa-envelope-o\"></i></span>\n" +
    "                                </span>\n" +
    "                                <div class=\"media-body\">\n" +
    "                                    <span class=\"block\">Lynda sent you a mail</span>\n" +
    "                                    <span class=\"text-muted\">9 hours ago</span>\n" +
    "                                </div>\n" +
    "                            </a>\n" +
    "                        </li>                       \n" +
    "                    </ul>\n" +
    "                    <div class=\"panel-footer\">\n" +
    "                        <a href=\"javascript:;\">Show all mails.</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            -->\n" +
    "            <!-- <li class=\"dropdown\" dropdown is-open=\"isopeBell\">\n" +
    "                <a href=\"javascript:;\" class=\"dropdown-toggle\" dropdown-toggle ng-disabled=\"disabled\">\n" +
    "                    <i class=\"fa fa-bell-o nav-icon\"></i>\n" +
    "                    <span class=\"badge badge-warning\">3</span>\n" +
    "                </a>\n" +
    "                <div class=\"dropdown-menu with-arrow panel panel-default\">\n" +
    "                    <div class=\"panel-heading\">\n" +
    "                        You have 3 notifications.\n" +
    "                    </div>\n" +
    "                    <ul class=\"list-group\">\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <a href=\"javascript:;\" class=\"media\">\n" +
    "                                <span class=\"media-left media-icon\">\n" +
    "                                    <span class=\"round-icon sm bg-success\"><i class=\"fa fa-bell-o\"></i></span>\n" +
    "                                </span>\n" +
    "                                <div class=\"media-body\">\n" +
    "                                    <span class=\"block\">New tasks needs to be done</span>\n" +
    "                                    <span class=\"text-muted block\">2min ago</span>\n" +
    "                                </div>\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <a href=\"javascript:;\" class=\"media\">\n" +
    "                                <span class=\"media-left media-icon\">\n" +
    "                                    <span class=\"round-icon sm bg-info\"><i class=\"fa fa-bell-o\"></i></span>\n" +
    "                                </span>\n" +
    "                                <div class=\"media-body\">\n" +
    "                                    <span class=\"block\">Change your password</span>\n" +
    "                                    <span class=\"text-muted\">3 hours ago</span>\n" +
    "                                </div>\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\">\n" +
    "                            <a href=\"javascript:;\" class=\"media\">\n" +
    "                                <span class=\"media-left media-icon\">\n" +
    "                                    <span class=\"round-icon sm bg-danger\"><i class=\"fa fa-bell-o\"></i></span>\n" +
    "                                </span>\n" +
    "                                <div class=\"media-body\">\n" +
    "                                    <span class=\"block\">New feature added</span>\n" +
    "                                    <span class=\"text-muted\">9 hours ago</span>\n" +
    "                                </div>\n" +
    "                            </a>\n" +
    "                        </li>                       \n" +
    "                    </ul>\n" +
    "                    <div class=\"panel-footer\">\n" +
    "                        <a href=\"javascript:;\">Show all notifications.</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li> -->\n" +
    "        </ul>   \n" +
    "    </div>\n" +
    "\n" +
    "</header>\n" +
    "");
}]);

angular.module("app/layout/templates/metrics-shell.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/layout/templates/metrics-shell.tpl.html",
    "<div data-ng-controller=\"shellCtrl as shellVM\">\n" +
    "            <div data-ng-hide=\"shellVM.isSpecificPage(shellVM.visibleHeaderRouterLst)\"\n" +
    "                 data-ng-cloak>\n" +
    "                <section data-ng-include=\" 'app/layout/templates/header.tpl.html' \"\n" +
    "                     id=\"header\" class=\"top-header\"></section>\n" +
    "\n" +
    "                <aside data-ng-show=\"shellVM.showNav\" data-ng-include=\" 'app/layout/templates/nav.tpl.html' \"\n" +
    "                     id=\"nav-container\"></aside>\n" +
    "            </div>\n" +
    "            \n" +
    "s\n" +
    "\n" +
    "            <div class=\"view-container\">\n" +
    "                <section ui-view id=\"content\" data-ng-class=\"{'left-muted':!shellVM.showNav}\" class=\"animate-fade-up\"></section>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "");
}]);

angular.module("app/layout/templates/nav.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/layout/templates/nav.tpl.html",
    "<div id=\"nav-wrapper\">\n" +
    "    <ul id=\"nav\"\n" +
    "        data-ng-controller=\"NavCtrl\"\n" +
    "        \n" +
    "        data-slim-scroll\n" +
    "        data-highlight-active>\n" +
    "        <li><a href=\"#/dashboard\" style=\"cursor:pointer;\"> <i class=\"fa fa-dashboard\"><span class=\"icon-bg bg-danger\"></span></i><span>Dashboard</span> </a></li>\n" +
    "        <li ng-repeat=\"nav in shellVM.navList track by $index\" data-collapse-nav>\n" +
    "            <a style=\"cursor:pointer;\"><i class=\"glyphicon glyphicon-picture\"><span class=\"icon-bg\" ng-class=\"{'0': 'bg-orange', '1':'bg-warning', '2':'bg-success'}[$index % 3]\"></span></i><span>{{nav._id}}</span></a>\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"project in nav.projects track by $index\">\n" +
    "                <a ng-click=\"shellVM.onStateChange(shellVM.CONST.dashboard.DASHBOARD_ROUTER_NAME,\n" +
    "                { storyType: nav._id, projectName: project, story_id: nav.storyIds[$index], lang: nav.langs[$index] },\n" +
    "                $event)\" style=\"cursor:pointer;\"><i class=\"fa fa-caret-right\"></i><span>{{project}}</span> <span class=\"badge badge-success\"></span></a>\n" +
    "\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);
