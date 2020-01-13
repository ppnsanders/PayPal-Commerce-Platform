'use strict';
const paypalConfig = ppConfig();
const request = require('request');
const requestObject = require('../../../../models/index');
const errorHelper = require('../errorHelper');
const fs = require('fs');

module.exports = (router) => {

    const referralObject = {
            individual_owners: [
              {
                names: [
                  {
                    prefix: "Mr.",
                    given_name: "Nate",
                    surname: "Sample",
                    full_name: "Nate Sample",
                    type: "LEGAL"
                  }
                ],
                citizenship: "US",
                addresses: [
                  {
                    address_line_1: "One Washington Square",
                    address_line_2: "Apt 123",
                    admin_area_2: "San Jose",
                    admin_area_1: "CA",
                    postal_code: "95112",
                    country_code: "US",
                    type: "HOME"
                  }
                ],
                phones: [
                  {
                    country_code: "1",
                    national_number: "6692468839",
                    extension_number: "1234",
                    type: "MOBILE"
                  }
                ],
                birth_details: {
                  date_of_birth: "1955-12-29"
                },
                type: "PRIMARY"
              }
            ],
            business_entity: {
              business_type: {
                type: "INDIVIDUAL",
                subtype: "ASSO_TYPE_INCORPORATED"
              },
              business_industry: {
                category: "1004",
                mcc_code: "2025",
                subcategory: "8931"
              },
              business_incorporation: {
                incorporation_country_code: "US",
                incorporation_date: "1986-12-29"
              },
              names: [
                {
                  business_name: "Nate Sample Biz",
                  type: "LEGAL_NAME"
                }
              ],
              emails: [
                {
                  type: "CUSTOMER_SERVICE",
                  email: "customerservice@natesample.com"
                }
              ],
              website: "https://mystore.natesample.com",
              addresses: [
                {
                  address_line_1: "One Washington Square",
                  address_line_2: "Apt 123",
                  admin_area_2: "San Jose",
                  admin_area_1: "CA",
                  postal_code: "95112",
                  country_code: "US",
                  type: "WORK"
                }
              ],
              phones: [
                {
                  country_code: "1",
                  national_number: "6692478833",
                  extension_number: "1234",
                  type: "CUSTOMER_SERVICE"
                }
              ],
              beneficial_owners: {
                individual_beneficial_owners: [
                  {
                    names: [
                      {
                        prefix: "Mr.",
                        given_name: "Nate",
                        surname: "Sample",
                        full_name: "Nate Sample",
                        type: "LEGAL"
                      }
                    ],
                    citizenship: "US",
                    addresses: [
                      {
                        address_line_1: "One Washington Square",
                        address_line_2: "Apt 123",
                        admin_area_2: "San Jose",
                        admin_area_1: "CA",
                        postal_code: "95112",
                        country_code: "US",
                        type: "HOME"
                      }
                    ],
                    phones: [
                      {
                        country_code: "1",
                        national_number: "6692468839",
                        extension_number: "1234",
                        type: "MOBILE"
                      }
                    ],
                    birth_details: {
                      date_of_birth: "1955-12-29"
                    },
                    percentage_of_ownership: "50"
                  }
                ],
                business_beneficial_owners: [
                  {
                    business_type: {
                      type: "INDIVIDUAL",
                      subtype: "ASSO_TYPE_INCORPORATED"
                    },
                    business_industry: {
                      category: "1004",
                      mcc_code: "2025",
                      subcategory: "8931"
                    },
                    business_incorporation: {
                      incorporation_country_code: "US",
                      incorporation_date: "1986-12-29"
                    },
                    names: [
                      {
                        business_name: "Nate Sample Biz",
                        type: "LEGAL_NAME"
                      }
                    ],
                    emails: [
                      {
                        type: "CUSTOMER_SERVICE",
                        email: "customerservice@natesample.com"
                      }
                    ],
                    website: "https://mystore.natesample.com",
                    addresses: [
                      {
                        address_line_1: "One Washington Square",
                        address_line_2: "Apt 123",
                        admin_area_2: "San Jose",
                        admin_area_1: "CA",
                        postal_code: "95112",
                        country_code: "US",
                        type: "WORK"
                      }
                    ],
                    phones: [
                      {
                        country_code: "1",
                        national_number: "6692478833",
                        extension_number: "1234",
                        type: "CUSTOMER_SERVICE"
                      }
                    ],
                    percentage_of_ownership: "50"
                  }
                ]
              },
              office_bearers: [
                {
                  names: [
                    {
                      prefix: "Mr.",
                      given_name: "Nate",
                      surname: "Sample",
                      full_name: "Nate Sample",
                      type: "LEGAL"
                    }
                  ],
                  citizenship: "US",
                  addresses: [
                    {
                      address_line_1: "One Washington Square",
                      address_line_2: "Apt 123",
                      admin_area_2: "San Jose",
                      admin_area_1: "CA",
                      postal_code: "95112",
                      country_code: "US",
                      type: "HOME"
                    }
                  ],
                  phones: [
                    {
                      country_code: "1",
                      national_number: "6692468839",
                      extension_number: "1234",
                      type: "MOBILE"
                    }
                  ],
                  birth_details: {
                    date_of_birth: "1955-12-29"
                  },
                  role: "DIRECTOR"
                }
              ],
              annual_sales_volume_range: {
                minimum_amount: {
                  currency_code: "USD",
                  value: "10000"
                },
                maximum_amount: {
                  currency_code: "USD",
                  value: "50000"
                }
              },
              average_monthly_volume_range: {
                minimum_amount: {
                  currency_code: "USD",
                  value: "1000"
                },
                maximum_amount: {
                  currency_code: "USD",
                  value: "50000"
                }
              },
              purpose_code: "P0104"
            },
            email: paypalConfig.merchant.email,
            preferred_language_code: "en-US",
            tracking_id: "TRACKING_ID_" + Date.now().toString(),
            partner_config_override: {
              partner_logo_url: "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg",
              return_url: "http://localhost:8000/admin",
              return_url_description: "the url to return the merchant after the paypal onboarding process.",
              action_renewal_url: "http://localhost:8000/admin"
            },
            operations: [
              {
                operation: "API_INTEGRATION",
                api_integration_preference: {
                    rest_api_integration: {
                        integration_method: "PAYPAL",
                        integration_type: "THIRD_PARTY",
                        third_party_details: {
                            features: [
                                "PAYMENT",
                                "REFUND"
                            ]
                        }
                    }
                }
              }
            ],
            legal_consents: [
              {
                type: "SHARE_DATA_CONSENT",
                granted: true
              }
            ],
            products: [
              "PPCP"
            ]
    };

     /* Create Partner Referral for Product 'PPCP'.
     * Doc: https://developer.paypal.com/docs/api/partner-referrals/v1/#partner-referrals_create
     */
    router.post('/ppcp/create', (req, res) => {
        const reqObj = requestObject({
            url: "/v2/customer/partner-referrals/",
            method: "POST",
            get_access_token: false,
            auth_assertion: false,
            body: referralObject
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

    /* Create Partner Referral for Product 'EXPRESS_CHECKOUT'.
     * Doc: https://developer.paypal.com/docs/api/partner-referrals/v1/#partner-referrals_create
     */
    router.post('/ec/create', (req, res) => {
      referralObject.products = ["EXPRESS_CHECKOUT"];
      const reqObj = requestObject({
          url: "/v2/customer/partner-referrals/",
          method: "POST",
          get_access_token: false,
          auth_assertion: false,
          body: referralObject
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


    /* Show Seller Status
     * Docs: https://developer.paypal.com/docs/api/partner-referrals/v1/#merchant-integration_status
     */
    router.get('/show-seller-status/:id', (req, res) => {
        const reqObj = requestObject({
            url: "/v1/customer/partners/" + paypalConfig.partner.merchant_id + "/merchant-integrations/" + req.params.id,
            method: "GET",
            get_access_token: false,
            auth_assertion: false,
        });
        request(reqObj, (err, response, body) => {
            if(err) {
                console.log('ERROR: ', err)
                res.json(err);
            } else {
                if(response.statusCode === 200) {
                    //Update ppconfig.json file.
                    paypalConfig.merchant.merchant_id = response.body.merchant_id;
                    paypalConfig.merchant.client_id = response.body.oauth_integrations[0].oauth_third_party[0].merchant_client_id;
                    paypalConfig.merchant.scopes_granted = response.body.oauth_integrations[0].oauth_third_party[0].scopes;
                    paypalConfig.merchant.payments_receivable = response.body.payments_receivable;
                    paypalConfig.merchant.primary_email_confirmed = response.body.primary_email_confirmed;
                    paypalConfig.merchant.products = response.body.products;
                    paypalConfig.merchant.updated = Date.now().toString();
                    const json = JSON.stringify(paypalConfig);
                    fs.writeFile(paypalConfig.file_location, json, 'utf8', (response) => { console.log('wrote to ppconfig.json'); });
                    res.json(paypalConfig.merchant);
                } else {
                        errorHelper(response, (respObj) => {
                        res.json(respObj);
                    });
                }
            }
        });
    });

    router.get('/*', (req, res) => {
        res.status(404).send('NOT FOUND');
    });
    
};