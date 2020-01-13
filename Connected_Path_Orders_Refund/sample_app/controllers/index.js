'use strict';
const paypalConfig = ppConfig();

module.exports = function (router) {
    router.get('/', (req, res) => {
    	res.cookie('XSRF-TOKEN', res.locals._csrf) //setting a cookie that is accessible by Angular
        res.render('index', { component: 'home-page', partner_client_id: paypalConfig.partner.client_id, merchant_merchant_id: paypalConfig.merchant.merchant_id, client_token: paypalConfig.partner.client_token, partner_attribution_id: paypalConfig.partner.attributionId})
    });

    router.get('/:page', (req, res) => {
    	res.cookie('XSRF-TOKEN', res.locals._csrf) //setting a cookie that is accessible by Angular
        res.render('index', { component: req.params.page + '-page', partner_client_id: paypalConfig.partner.client_id, merchant_merchant_id: paypalConfig.merchant.merchant_id, client_token: paypalConfig.partner.client_token, partner_attribution_id: paypalConfig.partner.attributionId})
    });
};
