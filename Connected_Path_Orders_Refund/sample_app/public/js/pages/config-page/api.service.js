'use strict'

angular.module('pcpcpor').service('partnerConfigService', function ($http, $cookies, $window) {

function setup() {
	model.config = $cookies.getObject('cpor-config')
	if(typeof model.config !== 'undefined') {
		if(typeof model.config.partner !== 'undefined') {
			model.getAccessToken()
		} else {
			model.showConfigModal()
		}
	} else {
		//no config, show settings modal
		model.config = {},
		model.config.partner = {}
		model.config.partner.email = ""
		model.config.partner.client_id = ""
		model.config.partner.client_secret = ""
		model.config.access_token = ""
		model.config.refresh_token = ""
		model.config.history = []
		$cookies.putObject('cpor-config', model.config)
		model.showConfigModal()
	}
}

function useDefault() {
	$('#useDefaultButton').hide()
	$('#cancelEditButton').hide()
	$('#errorMsg').hide()
	model.showLoader()
	model.config = {};
	model.config.partner = {};
	model.config.partner = {
            "client_id":"AUOlt-Vi7Qvn_nNP7uhuKQ52BRCp1uy6qJab8WzCWPLvo2cRc9h8OOHhAHvz7dnMyLdHY96XGEyq8dd_",
            "client_secret":"EFgaigTzAhleLwnb-lV8ARjlC-VUEaOyNKlaBDC2KZecVcnraGIfksmgHtB2EcgbD5lg2bbbXo-Jj0_v",
            "attributionId":"CP_O_R_Nates_Samples",
            "email":"partner_CPOR@natesamples.com",
            "merchant_id":"BQYR6AP8W9M8G",
            "brandName":"CP_O_R_Partner",
            "access_token":"",
            "updated":""
	};
	model.getAccessToken()
	$cookies.putObject('cpor-config', model.config)
	model.errorMsg.message = ""
	setTimeout(() => {
		model.hideLoader()
	}, 500)
}

function getAccessToken() {
		const reqUrl = '/api/paypal/auth'
		const config = {
	        'xsrfHeaderName': 'X-CSRF-TOKEN',
	        'xsrfCookieName': 'XSRF-TOKEN'
	    }
		return $http.post(reqUrl, model.config.partner, config).then((response) => {
					model.config.partner.access_token = response.data.partner.access_token
					$('#accessTokenField').show()
					$cookies.putObject('cpor-config', model.config)	
		})
}

function cancelEditConfig() {
	$('#configModal').modal('hide')
}

function showConfigModal() {
	$('#configModal').modal('show')
}

function showLoader() {
	$('#configured').hide()
	$('#configModalLoading').show()
}

function hideLoader() {
	$('#configModalLoading').hide()
	$('#configured').show()
}

function saveSettings() {
	const config = validateConfig()
	if(config) {
		$cookies.putObject('cpor-config', model.config)
		$('#configModal').modal('hide')
		setTimeout(() => {
					$window.location.reload();
		}, 200)
	} else {
		//do nothing, show errors
		return false
	}
}

function validateConfig() {
	model.errorMsg.message = []
	const parConfig = model.validatePartnerConfig()
	if(parConfig === true) {
		return true
	} else {
		return false
	}
}

function validatePartnerConfig() {
	if(typeof model.config !== 'undefined'){
		if(typeof model.config.partner !== 'undefined') {
			if(typeof model.config.partner.client_id !== 'undefined') {
				if(typeof model.config.partner.client_secret !== 'undefined') {
					if(typeof model.config.partner.email !== 'undefined') {
						return true
					} else {
						model.errorMsg.message.push("You must have a Partner Email Address")
						$('#errorMsg').show()
						return false
					}
				} else {
					model.errorMsg.message.push("You must have a Partner Client_Secret")
					$('#errorMsg').show()
					return false
				}
			} else {
				model.errorMsg.message.push("You must input a Partner Client_Id")
				$('#errorMsg').show()
				return false
			}
		} else {
			model.errorMsg.message.push("You must input Partner Details (email, client_id, client_secret)")
			$('#errorMsg').show()
			return false
		}
	} else {
		model.errorMsg.message.push("You must input Partner Details")
		$('#errorMsg').show()
		return false
	}
}

let model = {
	config: {},
	query: {},
	access_token: "",
	refresh_token: "",
	errorMsg: { message: []},
	setup: (model) => {
		return setup(model)
	},
	useDefault: (model) => {
		return useDefault(model)
	},
	getAccessToken: (model) => {
		return getAccessToken(model)
	},
	cancelEditConfig: (model) => {
		return cancelEditConfig(model)
	},
	showConfigModal: (model) => {
		return showConfigModal(model)
	},
	saveSettings: (model) => {
		return saveSettings(model)
	},
	validateConfig: (model) => {
		return validateConfig(model)
	},
	validatePartnerConfig: (model) => {
		return validatePartnerConfig(model)
	},
	showLoader: (model) => {
		return showLoader(model)
	},
	hideLoader: (model) => {
		return hideLoader(model)
	}
}
 
return model;
 
});
