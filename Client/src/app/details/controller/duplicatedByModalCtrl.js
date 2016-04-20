(function () {
    angular.module('metrics.details.controller')
        .controller('duplicatedByModalCtrl', ['constant','modalService',
    'routehelper', 'rx.exceptionHandler', '$timeout', '$rootScope','$modalInstance','modalParam',
    function (constant, modalService,
        routehelper, exceptionHandler, $timeout, $rootScope, $modalInstance, modalParam) {
        var self = this;
        self.lineNo = modalParam.lineNo;
        self.header = "Duplicated By";
        if(!modalParam && modalParam.diffInstance){
            return; 
        }
        self.duplicationOccuredInSameFile = modalParam.diffInstance.duplicationOccuredInSameFile;
        self.activePath = modalParam.activePath;
        self.buttons = [{ label: 'Compare', result: 'sompare', cssClass: 'btn-primary' }, { label: 'Cancel', result: 'no', cssClass: 'btn-warning' }];
                
        self.onButtonClick = function (result) {            
            this.close();
        };
        self.close = function () {
            $modalInstance.dismiss();
        };
        self.extractDuplicatedFiles  = function(diffInstance){
            this.duplicatedBy =  diffInstance.duplicatedBy; 
        }
        self.extractDuplicatedFileFromLineObj  = function(duplicatedLinesInstance){
            var obj ={};
            for(var key in duplicatedLinesInstance)
            {
                var encodedLine = duplicatedLinesInstance[key].lines[0] + '-' + duplicatedLinesInstance[key].lines[1];
                if(!obj.hasOwnProperty(duplicatedLinesInstance[key].path))
                {
                    obj[duplicatedLinesInstance[key].path] = {};
                }
                obj[duplicatedLinesInstance[key].path][encodedLine]=0;
            }
            self.duplicatedBy = obj;
        }
        if(this.lineNo)
        {
            blockNameSplit = modalParam.lineObj.blockName.split('-');
            self.selectedBlockName =  blockNameSplit[0] + '-' + blockNameSplit[1];
            self.extractDuplicatedFileFromLineObj(modalParam.lineObj.duplicatedBy);
        }
        else{
        self.extractDuplicatedFiles(modalParam.diffInstance);
        }
    }]);
})();