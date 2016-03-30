(function () {
    angular.module("nis.global").config(['constantProvider', function (constantProvider) {

        var error = {};

        //Common error code starts from 1000 to 1500    
        //UI error code starts from 1500 to 2000
        error.ErrorCode = {
            //defaut error code
            '404': 'Service unavailable. Please contact administrator.',
            '401': 'Unauthorized. Request denied',

            //Common error code starts from 1000 to 1500 
            '1000': 'Data invalid',
            '1001': 'Unhandled exception occured.',
            '1002': 'Error occured in service invocation.',

            //UI Constants
            '5001': 'Error occured while saving the product'
        };

        error.CommonErrorConstant = {
            'UNAUTHORIZED': error.ErrorCode['401'],
            'SERVICE_UNAVAILABLE': error.ErrorCode['404'],
            'DATA_INVALID': error.ErrorCode['1000'],
            'UNHANDLED_EXP': error.ErrorCode['1001'],
            'SERVICE_INVOCATION_ERR': error.ErrorCode['1002']
        };

        constantProvider.configureConstant(error);
        return;

    }]);
})();