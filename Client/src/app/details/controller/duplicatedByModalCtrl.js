(function () {
    angular.module('metrics.details.controller')
        .controller('duplicatedByModalCtrl', ['constant','modalService',
    'routehelper', 'rx.exceptionHandler', '$timeout', '$rootScope','$modalInstance','modalParam',
    function (constant, modalService,
        routehelper, exceptionHandler, $timeout, $rootScope, $modalInstance, modalParam) {
        var self = this;
        self.lineNo = modalParam.lineNo;
        self.header = "Duplicated By";
        self.selectedFiles = angular.copy(modalParam.selectedFiles) || [];
        if(!modalParam && modalParam.diffInstance){
            return; 
        }
        self.duplicationOccuredInSameFile = modalParam.diffInstance.duplicationOccuredInSameFile;
        self.activePath = modalParam.activePath;
        self.buttons = [{ label: 'Compare', result: 'compare', cssClass: 'btn-primary' }, { label: 'Cancel', result: 'no', cssClass: 'btn-warning' }];
                
        self.onButtonClick = function (result) {
            if(result == "compare"){
                $modalInstance.close(this.selectedFiles);
            }
            else{
                this.close();
            }
        };
        self.selectAll = function(isSelectAll){
            this.selectedFiles = [];
            if(isSelectAll)
            {           
                for(var key in this.duplicatedBy){
                    this.selectedFiles.push(key);
                }
            }
        }
        self.onFileChckChange = function(){
            for(var key in this.copyOfDuplicatedBy){
                if(!this.copyOfDuplicatedBy[key].isSelected)
                {
                    this.isSelectAll = false;
                    return;
                }
            }
            this.isSelectAll = true;
        }
        self.setSelectAll = function(){            
            for(var i in self.selectedFiles)
            {
                if(self.copyOfDuplicatedBy[self.selectedFiles[i]])
                {
                    self.copyOfDuplicatedBy[self.selectedFiles[i]].isSelected =true;
                }
            }
            if(self.selectedFiles.length > 0){
                self.isSelectAll = Object.keys(self.duplicatedBy).length == self.selectedFiles.length
            }
        }
        self.close = function () {
            $modalInstance.dismiss();
        };
        self.extractDuplicatedFiles  = function(diffInstance){
            self.duplicatedBy =  diffInstance.duplicatedBy; 
            self.copyOfDuplicatedBy = angular.copy(self.duplicatedBy);
            self.setSelectAll();
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
            self.copyOfDuplicatedBy = angular.copy(self.duplicatedBy);
            self.setSelectAll();    
        }
        if(self.lineNo)
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