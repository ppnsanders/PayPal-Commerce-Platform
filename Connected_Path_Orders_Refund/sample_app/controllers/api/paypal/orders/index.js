'use strict';
const request = require('request');
const requestObject = require('../../../../models/index');
const errorHelper = require('../errorHelper');
const paypalConfig = ppConfig();

module.exports = (router) => {

       /* Create Order
        * Docs: https://developer.paypal.com/docs/api/orders/v2/#orders_create
        */
        router.post('/create', (req, res) => {
            const unique_id = Date.now();
            const orderObject = {
                intent: "CAPTURE",
                purchase_units: [
                {
                    reference_id: "REFERENCE_ID_" + unique_id,
                    amount: {
                    currency_code: "USD",
                    value: "100.00",
                    breakdown: {
                        item_total: {
                            currency_code: "USD",
                            value: "100.00"
                        }
                    }
                    },
                    payment_instruction: {
                        disbursement_mode: "INSTANT"
                    },
                    description: "ORDER_NUMBER_" + unique_id,
                    custom_id: "PARTNER_ID_" + paypalConfig.partner.merchant_id,
                    invoice_id: "INVOICE_" + unique_id,
                    soft_descriptor: paypalConfig.merchant.brand_name,
                    items: [
                        {
                            name: "ITEM 1",
                            unit_amount: {
                                currency_code: "USD",
                                value: "10"
                            },
                            quantity: "5",
                            description: "Item Number One Description",
                            sku: unique_id + "_1",
                            category: "PHYSICAL_GOODS"
                        },
                        {
                            name: "ITEM 2",
                            unit_amount: {
                                currency_code: "USD",
                                value: "10"
                            },
                            quantity: "5",
                            description: "Item Number Two Description",
                            sku: unique_id + "_2",
                            category: "PHYSICAL_GOODS"
                        }
                    ]
                }
                ],
                application_context: {
                    return_url: "https://www.example.com/return",
                    cancel_url: "https:// www.example.com/cancel",
                    user_action: "PAY_NOW",
                    payment_method: {
                        payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED"
                    }
                }
            };
            const reqObj = requestObject({
                url: "/v2/checkout/orders",
                method: "POST",
                auth_assertion: true,
                get_access_token: false,
                body: orderObject
            });
            request(reqObj, (err, response, body) => {
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

       /* Capture Order
        * Docs: https://developer.paypal.com/docs/api/orders/v2/#orders_capture
        */
       router.post('/capture/:type/:id', (req, res) => {
            let reqBody = {};
            if(req.params.type === "cc") {
                reqBody.payment_source = {};
                reqBody.payment_source.card = {};
                reqBody.payment_source.card.name = "Test Testerson";
                reqBody.payment_source.card.number = "4641714814135565";
                reqBody.payment_source.card.expiry = "2020-02";
                reqBody.payment_source.card.security_code = "578";
            } else {
             //Nothing needed for PP Payments
            }
            const reqObj = requestObject({
                url: "/v2/checkout/orders/" + req.params.id + "/capture",
                method: "POST",
                auth_assertion: true,
                get_access_token: false,
                body: reqBody
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

   /* Get Order, Calculate Shipping, then Update Order
    * Docs: Get Order: https://developer.paypal.com/docs/api/orders/v2/#orders_get
    * Docs: Update Order: https://developer.paypal.com/docs/api/orders/v2/#orders_patch
    */
       router.post('/calculateShipping/:id', (req, res) => {
        //GET Order
        const reqObj = requestObject({
            url: "/v2/checkout/orders/" + req.params.id,
            method: "GET",
            auth_assertion: true,
            get_access_token: false
        });
        request(reqObj, (err, response, data) => {
            if(err) {
                console.log('ERROR: ', err)
                res.json(err);
            } else {
                if(response.statusCode === 200) {
                    //Got the Order
                    //Shipping Calculations
                    let reqBody = [];
                    const state = req.body.shippingData.shipping_address.state;
                    if(state === "CA") {
                        reqBody[0] = {};
                        reqBody[0].op = "replace";
                        reqBody[0].path = "/purchase_units/@reference_id=='" + response.body.purchase_units[0].reference_id + "'/amount";
                        reqBody[0].value = {
                            currency_code: "USD",
                            value: "105.00",
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: "100.00"
                                },
                                shipping: {
                                    currency_code: "USD",
                                    value: "5.00"
                                }
                            }
                        };
                        reqBody[1] = {};
                        reqBody[1].op = "replace";
                        reqBody[1].path = "/purchase_units/@reference_id=='" + response.body.purchase_units[0].reference_id + "'/custom_id";
                        reqBody[1].value = "SH_CA_" + response.body.purchase_units[0].custom_id
                    } else {
                        reqBody[0] = {};
                        reqBody[0].op = "replace",
                        reqBody[0].path = "/purchase_units/@reference_id=='" + response.body.purchase_units[0].reference_id + "'/amount",
                        reqBody[0].value = {
                            currency_code: "USD",
                            value: "125.00",
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: "100.00"
                                },
                                shipping: {
                                    currency_code: "USD",
                                    value: "25.00"
                                }
                            }
                        };
                        reqBody[1] = {};
                        reqBody[1].op = "replace";
                        reqBody[1].path = "/purchase_units/@reference_id=='" + response.body.purchase_units[0].reference_id + "'/custom_id";
                        reqBody[1].value = "SH_" + state + "_" + response.body.purchase_units[0].custom_id
                    }
                    //Patch Order
                    const updateObj = requestObject({
                        url: "/v2/checkout/orders/" + req.params.id,
                        method: "PATCH",
                        auth_assertion: true,
                        get_access_token: false,
                        body: reqBody
                    });
                    request(updateObj, (err, response, data) => {
                        if(err) {
                            console.log('ERROR: ', err)
                            res.json({ error: true, err: err});
                        } else {
                            if(response.statusCode === 204) {
                                res.json({ error: false, update: 'Complete'});
                            } else {
                                    errorHelper(response, (respObj) => {
                                    res.json({ error: true, err: respObj});
                                });
                            }
                        }
                    });

                } else {
                        errorHelper(response, (respObj) => {
                        res.json(respObj);
                    });
                }
            }
        });
        
});
}