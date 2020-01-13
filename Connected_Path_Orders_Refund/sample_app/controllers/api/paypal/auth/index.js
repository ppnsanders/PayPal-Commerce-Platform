'use strict';
const paypalConfig = ppConfig();
const request = require('request');
const requestObject = require('../../../../models/index');
const fs = require('fs');

module.exports = (router) => {

    router.post('/generateClientToken', (req, res) => {
        generateClientToken((response) => {
            if(response.error) {
                console.log('ERROR: ', response);
                res.json(response);
            } else {
                res.json(response.client_token);
            }
        });
    });

    router.post('/', (req, res) => {
        getAccessTokenAndUpdate(req.body, (response) => {
            if(response.error) {
                console.log('ERROR: ', response);
                res.json(response);
            } else {
                res.json(ppConfig());
            }
        })
    });

    router.get('/*', (req, res) => {
        res.status(404).send('NOT FOUND');
    });
    
};

function generateClientToken(callback) {
    getAccessToken((response) => {
        if(response.error) {
            callback({error: true, response: err})
        } else {
            const reqObj = requestObject({
                url: '/v1/identity/generate-token',
                method: 'POST',
                auth_assertion: false,
                get_access_token: false
            });
            console.log(reqObj);
            request(reqObj, (err, response, body) => {
                if(err) {
                    callback({error: true, response: err});
                } else {
                    paypalConfig.partner.client_token = body.client_token;
                    paypalConfig.partner.updated = Date.now().toString();
                    console.log(response);
                    const json = JSON.stringify(paypalConfig);
                    fs.writeFile(paypalConfig.file_location, json, 'utf8', (response) => { console.log('added client_token to ppconfig.json'); });
                    callback({ error: false, response: body });
                }
            })
        }
    })
}

function getAccessToken(callback) {
    const reqObj = requestObject({
        url: "/v1/oauth2/token",
        method: "POST",
        auth_assertion: false,
        get_access_token: true,
        auth: {
            user: paypalConfig.partner.client_id,
            pass: paypalConfig.partner.client_secret,
            sendImmediately: true
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Language": "en_US"
        },
        form: {
            grant_type: "client_credentials"
        }
    });
    request(reqObj, (err, response, body) => {
        if(err) {
            callback({ error: true, response: err });
        } else {
            paypalConfig.partner.access_token = body.access_token;
            paypalConfig.partner.updated = Date.now().toString();
            const json = JSON.stringify(paypalConfig);
            fs.writeFile(paypalConfig.file_location, json, 'utf8', (response) => { console.log('updated access_token in ppconfig.json'); });
            callback({ error: false, response: body });
        }
    });
}

function getAccessTokenAndUpdate(partner, callback) {
    const reqObj = requestObject({
        url: "/v1/oauth2/token",
        method: "POST",
        auth_assertion: false,
        get_access_token: true,
        auth: {
            user: partner.client_id,
            pass: partner.client_secret,
            sendImmediately: true
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Language": "en_US"
        },
        form: {
            grant_type: "client_credentials"
        }
    });
    request(reqObj, (err, response, body) => {
        if(err) {
            callback({ error: true, response: err });
        } else {
            paypalConfig.partner.client_id = partner.client_id;
            paypalConfig.partner.client_secret = partner.client_secret;
            paypalConfig.partner.attributionId = partner.attributionId;
            paypalConfig.partner.email = partner.email;
            paypalConfig.partner.merchant_id = partner.merchant_id;
            paypalConfig.partner.brandName = partner.brandName;
            paypalConfig.partner.access_token = body.access_token;
            paypalConfig.partner.updated = Date.now().toString();
            const json = JSON.stringify(paypalConfig);
            fs.writeFile(paypalConfig.file_location, json, 'utf8', (response) => { console.log('updated partner object in ppconfig.json'); });
            callback({ error: false, response: body });
        }
    });
}