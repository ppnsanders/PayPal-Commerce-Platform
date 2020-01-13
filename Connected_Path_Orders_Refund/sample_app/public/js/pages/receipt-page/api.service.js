'use strict'

angular.module('pcpcpor').service('receiptServiceModel', ['$http', '$cookies', '$location', function ($http, $cookies, $location) {

    function setup() {
        model.config = $cookies.getObject('cpor-config')
        console.log('recieptServiceModel setup is complete');
    }

    let model = {
        config: {},
        setup: (model) => {
            return setup(model)
        }
    };

    return model;
}])