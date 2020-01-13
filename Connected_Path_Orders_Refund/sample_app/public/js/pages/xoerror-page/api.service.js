'use strict'

angular.module('pcpcpor').service('xoErrorServiceModel', ['$http', '$cookies', '$location', function ($http, $cookies, $location) {

    function setup() {
        model.config = $cookies.getObject('cpor-config')
        console.log('xoErrorServiceModel setup is complete');
    }

    let model = {
        config: {},
        queryParams: {},
        setup: (model) => {
            return setup(model)
        }
    };

    return model;
}])