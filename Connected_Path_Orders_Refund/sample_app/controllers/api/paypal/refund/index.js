'use strict';
const request = require('request');
const requestObject = require('../../../../models/index');
const errorHelper = require('../errorHelper');
const paypalConfig = ppConfig();

module.exports = (router) => {

       /* Refund Capture
        * Docs: https://developer.paypal.com/docs/api/payments/v2/#captures_refund
        */
       router.get('/:id', (req, res) => {
            const reqObj = requestObject({
                url: "/v2/payments/captures/" + req.params.id + "/refund",
                method: "POST",
                auth_assertion: true,
                get_access_token: false
            });
            request(reqObj, (err, response, data) => {
                if(err) {
                    console.log('ERROR: ', err)
                    res.json(err);
                } else {
                    if(response.statusCode === 201) {
                        res.json(response);
                    } else {
                            errorHelper(response, (respObj) => {
                            res.json(respObj);
                        });
                    }
                }
            });
    });
}