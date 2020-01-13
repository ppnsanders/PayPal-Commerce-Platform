'use strict';
//Using the Global ppConfig() function, pull in the config JSON
const paypalConfig = ppConfig();

//This model handles the Headers and "request Object" for API Calls to simplify the information in the API Controllers.
module.exports = (reqObj) => {
    let requestObject = {};

    if(!reqObj.url) {
        requestObject.url = paypalConfig.paypal_base_url;
    } else {
        requestObject.url = paypalConfig.paypal_base_url + reqObj.url;
    }

    //Based on the reqObj parameters, set the Headers for the request.
    if(reqObj.get_access_token) {
        //Used for creating an access_token when the client_id and client_secret are passed in the auth object.
        requestObject.headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Language": "en_US",
            "PayPal-Partner-Attribution-Id": paypalConfig.partner.attributionId,
            "PayPal-Request-Id": Date.now() + "-" +  paypalConfig.partner.attributionId,
            "Prefer": "return=representation"
        };
    } else if(reqObj.auth_assertion) {
        //Creating and setting the Auth Assertion Header when the Partner is making a call on behalf of the merchant.
        const authAssertionHeader = "{\"alg\":\"none\"}"
        const encodedAuthAssertionHeader = new Buffer(authAssertionHeader).toString('base64')
        const authAssertionPayload = "{\"payer_id\":\"" + paypalConfig.merchant.merchant_id + "\",\"iss\":\"" + paypalConfig.partner.client_id + "\"}"
        const encodedAuthAssertionPayload = new Buffer(authAssertionPayload).toString('base64')
        const authAssertionValue = encodedAuthAssertionHeader + '.' + encodedAuthAssertionPayload + '.'
        requestObject.headers = {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Accept-Language": "en_US",
            "Authorization": "Bearer " + paypalConfig.partner.access_token,
            "PayPal-Partner-Attribution-Id": paypalConfig.partner.attributionId,
            "PayPal-Request-Id": Date.now() + "-" +  paypalConfig.partner.attributionId,
            "PayPal-Auth-Assertion": authAssertionValue,
            "Prefer": "return=representation"
        };
    } else {
        //When the Request does not need an Auth Assertion Header and is JSON.
        requestObject.headers = {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Accept-Language": "en_US",
            "Authorization": "Bearer " + paypalConfig.partner.access_token,
            "PayPal-Partner-Attribution-Id": paypalConfig.partner.attributionId,
            "PayPal-Request-Id": Date.now() + "-" +  paypalConfig.partner.attributionId,
            "Prefer": "return=representation"
        };

    }

    //Default Method to GET if none is passed
    if(!reqObj.method) {
        requestObject.method = "GET";
    } else {
        requestObject.method = reqObj.method;
    }

    //If the auth object isn't passed, don't set it.
    if(!reqObj.auth) {
        //do nothing for now.. 
    } else {
        requestObject.auth = reqObj.auth;
    }

    //If the form object isn't passed, don't set it.
    if(!reqObj.form) {
        //do nothing for now.. 
    } else {
        requestObject.form = reqObj.form;
    }

    //If the body object isn't passed, don't set it.
    if(!reqObj.body) {
        //do nothing for now..
    } else {
        requestObject.body = reqObj.body;
    }

    //If the data object isn't passed, don't set it.
    if(!reqObj.data) {
        //do nothing for now..
    } else {
        requestObject.data = reqObj.data;
    }
    
    //Default the json value to true
    if(!reqObj.json) {
        requestObject.json = true;
    } else {
        requestObject.json = reqObj.json;
    }


    return requestObject;
};
