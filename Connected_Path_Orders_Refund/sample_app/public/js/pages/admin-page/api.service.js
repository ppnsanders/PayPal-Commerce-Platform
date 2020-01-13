'use strict'

angular.module('pcpcpor').service('adminServiceModel', ['$http', '$cookies', '$location', function ($http, $cookies, $location) {

    function setup() {
        model.config = $cookies.getObject('cpor-config')
        const queryParams = $location.search();
        if(queryParams.merchantIdInPayPal) {
            $('#PPConfigButtonPPCP').hide()
            $('#PPConfigButtonEC').hide()
            $('#ConnectPayPalPPCPSpinner').show()
            $('#ConnectPayPalECSpinner').show()
            model.queryParams = queryParams
            model.merchantId = model.queryParams.merchantIdInPayPal
            model.merchantReturned()
        } else if(model.config.merchant == null) {
            console.log('merchant == null');
            $('#nomerchant').show()
            if(model.config.partner.access_token == null) {
                console.log('partner.access_token == null');
                $('#ConnectPayPalSpinner').hide()
                $('#noaccesstoken').show()
                $('#PPConfigButtonPPCP').show()
                $('#PPConfigButtonEC').show()
            } else {
                $('#PPConfigButtonPPCP').hide()
                $('#PPConfigButtonEC').hide()
                model.getPpcpReferralLink()
                model.getEcReferralLink()
            }
        } else {
            console.log('merchant !== null');
            $('#PPConfigButtonPPCP').hide()
            $('#PPConfigButtonEC').hide()
                model.merchantId = model.config.merchant.merchant_id
                model.merchantReturned()
        }
    }

    function getPpcpReferralLink() {
        const reqUrl = '/api/paypal/partner-referrals/ppcp/create'
		const config = {
	        'xsrfHeaderName': 'X-CSRF-TOKEN',
	        'xsrfCookieName': 'XSRF-TOKEN'
	    }
		return $http.post(reqUrl, model.config.partner, config).then((response) => {
                    model.action_url.ppcp = response.data.body.links[1].href + "&displayMode=minibrowser";
                    setTimeout(() => {
                        $('#ConnectPayPalPPCPSpinner').hide()
                        $('#PPConfigButtonPPCP').show()
                    }, 500)
		})
    }

    function setButtonConfigOptions() {
        //PayPal Button Best Practices: https://developer.paypal.com/docs/checkout/best-practices/
        //PayPal Button Customization Options: https://developer.paypal.com/docs/checkout/integration-features/customize-button/
        const buttonConfig = {};
              buttonConfig.style = {}
              buttonConfig.style.layout = 'vertical'; //best-practice is 'vertical', other option is 'horizontal'
              buttonConfig.style.color = 'gold'; //best-practice is 'gold', other options are 'blue', 'silver', 'white', or 'black'
              buttonConfig.style.shape = 'rect'; //best-practice is 'rect', other option is 'pill'
              buttonConfig.style.label = 'paypal'; //best-practice is 'paypal', other options are 'checkout', 'buynow', 'pay', or 'installment'
              //buttonConfig.style.height = '25'; //best-practice is to allow PayPal to set the height, alternatively, you can adjust from '25' to '55'
              //buttonConfig.style.tagline = true; //best practice is 'true', other option is 'false', only allowed if 'layout' is 'horizontal'
            model.config.buttonConfig = buttonConfig;
            $cookies.putObject('cpor-config', model.config);
            model.styleUpdate();
    }

    function saveButtonUpdates() {
        $cookies.putObject('cpor-config', model.config);
        //delete preview cookie
        $cookies.remove('preview-config');
        $('#buttonStyles').accordion()
    }

    function cancelButtonUpdates() {
        //reset buttonConfig
        model.config.buttonConfig = $cookies.getObject('cpor-config').buttonConfig;
        //delete preview cookie
        $cookies.remove('preview-config');
        $('#buttonStyles').accordion()
    }

    function getEcReferralLink() {
        const reqUrl = '/api/paypal/partner-referrals/ec/create'
		const config = {
	        'xsrfHeaderName': 'X-CSRF-TOKEN',
	        'xsrfCookieName': 'XSRF-TOKEN'
	    }
		return $http.post(reqUrl, model.config.partner, config).then((response) => {
                    model.action_url.ec = response.data.body.links[1].href + "&displayMode=minibrowser";
                    setTimeout(() => {
                        $('#ConnectPayPalECSpinner').hide()
                        $('#PPConfigButtonEC').show()
                    }, 500)
		})
    }

    function merchantReturned() {
       const reqUrl = '/api/paypal/partner-referrals/show-seller-status/' + model.merchantId
		const config = {
	        'xsrfHeaderName': 'X-CSRF-TOKEN',
	        'xsrfCookieName': 'XSRF-TOKEN'
	    }
       return $http.get(reqUrl, {}, config).then((response) => {
            model.config.merchant = {};
            model.config.merchant = response.data;
            $cookies.putObject('cpor-config', model.config);
            model.setButtonConfigOptions();
            if(model.config.merchant.products[0].name === "PPCP_STANDARD") {
                console.log('product is PPCP');
                setTimeout(() => {
                    $('#PPConfigButtonEC').hide()
                    $('#PPConfigButtonPPCP').hide()
                    $('#ConnectPayPalPPCPSpinner').hide()
                    $('#ConnectPayPalECSpinner').hide()
                    $('#ConfigCheckPPCP').show()
                    $('#ConfigCheckEC').show()
                    $('#ButtonConfigOptions').show()
                }, 500);
            } else {
                setTimeout(() => {
                    $('#PPConfigButtonEC').hide()
                    $('#ConnectPayPalPPCPSpinner').hide()
                    $('#ConnectPayPalECSpinner').hide()
                    $('#PPConfigButtonPPCP').show()
                    $('#ConfigCheckEC').show()
                    $('#ButtonConfigOptions').show()
                }, 500);
            }
       })
    }

    function styleUpdate() {
        console.log('styleUpdate Function Fired...');
        model.updateId = "PP_BTN_UPDATE_" + Date.now();
        $cookies.putObject('preview-config', model.config.buttonConfig.style);
    }

    let model = {
        config: {
            buttonConfig: {}
        },
        action_url: {
            ec: "",
            ppcp: ""
        },
        queryParams: {},
        merchantId: "",
        updateId: "",
        setup: (model) => {
            return setup(model)
        },
        getPpcpReferralLink: (model) => {
            return getPpcpReferralLink(model)
        },
        getEcReferralLink: (model) => {
            return getEcReferralLink(model)
        },
        merchantReturned: (model) => {
            return merchantReturned(model)
        },
        setButtonConfigOptions: (model) => {
            return setButtonConfigOptions(model)
        },
        saveButtonUpdates: (model) => {
            return saveButtonUpdates(model)
        },
        cancelButtonUpdates: (model) => {
            return cancelButtonUpdates(model)
        },
        styleUpdate: (model) => {
            return styleUpdate(model)
        }
    };

    return model;
}])