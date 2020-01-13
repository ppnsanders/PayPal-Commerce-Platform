'use strict'

angular.module('pcpcpor').service('cancelServiceModel', ['$http', '$cookies', '$location', function ($http, $cookies, $location) {

    function setup() {
        model.config = $cookies.getObject('cpor-config')
        console.log('cancelServiceModel setup is complete');
    }

    let model = {
        config: {},
        setup: (model) => {
            return setup(model)
        }
    };

    return model;
}])