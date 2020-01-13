'use strict'

angular.module('pcpcpor').service('cartServiceModel', function ($http, $cookies, $location, $window) {

    function setup() {
        model.config = $cookies.getObject('cpor-config')
        //if config is not set
            if(model.config.merchant == null || model.config.partner.access_token == null) {
                $window.location.href = '/admin';
            } else {
                let queryParams = $location.search();
                if(queryParams.client_token) {
                    $('#cartLoading').hide();
                    $('#cartDetails').show();
                } else {
                    $('#cartDetails').hide();
                    $('#cartLoading').show();
                    const reqUrl = '/api/paypal/auth/generateClientToken/'
                    const config = {
                        'xsrfHeaderName': 'X-CSRF-TOKEN',
                        'xsrfCookieName': 'XSRF-TOKEN'
                    }
                    $http.post(reqUrl, model.config.partner, config).then((response) => {
                        console.log(response);
                        $window.location.href = '/cart?client_token=true';
                    });
                }
            }
    }

    function createOrder(callback) {
        const reqUrl = '/api/paypal/orders/create'
		const config = {
	        'xsrfHeaderName': 'X-CSRF-TOKEN',
	        'xsrfCookieName': 'XSRF-TOKEN'
	    }
		$http.post(reqUrl, model.config.partner, config).then((response) => {
                model.orderId = response.data.body.id
                console.log('ORDER_RESPONSE: ', model.orderId);
                callback(model.orderId);
		});
    }

    //Using Shipping-Callback with PayPal Smart Payment Buttons
    //https://developer.paypal.com/docs/checkout/integration-features/shipping-callback/
    function getShippingOptions(callback) {
        const reqUrl = '/api/paypal/orders/calculateShipping/' + model.shippingData.orderID
        const config = {
	        'xsrfHeaderName': 'X-CSRF-TOKEN',
	        'xsrfCookieName': 'XSRF-TOKEN'
        }
        const reqBody = { 
            shippingData: model.shippingData,
            config: model.config.partner
        }
        $http.post(reqUrl, reqBody, config).then((response) => {
            if(response.error) {
                console.log(response);
            } else {
                callback(model.orderId);
            }  
        });
    }

    function capturePPOrder(callback) {
        $('#cartDetails').hide();
        $('#cartLoading').show();
        const reqUrl = '/api/paypal/orders/capture/pp/' + model.orderId
		const config = {
	        'xsrfHeaderName': 'X-CSRF-TOKEN',
	        'xsrfCookieName': 'XSRF-TOKEN'
	    }
		$http.post(reqUrl, model.config.partner, config).then((response) => {
                callback(response.data.body);
		});
    }

    let model = {
        orderId: "",
        config: {},
        shippingData: {},
        setup: (model) => {
            return setup(model)
        },
        createOrder: (model) => {
            return createOrder(model)
        },
        capturePPOrder: (model) => {
            return capturePPOrder(model)
        },
        getShippingOptions: (model) => {
            return getShippingOptions(model)
        }
    };

    return model;
})