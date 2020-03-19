# Detailed Onboarding Information 

This builds upon the section in the [README.MD](../README.MD#onboarding-via-connected-path "Link to README.MD") for [Onboarding via Connected Path](../README.MD#onboarding-via-connected-path "Link to Onboarding via Connected Path Section") section to detail the API's used and presented in the [associated Postman Collection](https://documenter.getpostman.com/view/3823651/SWEB3GUh?version=latest "Unofficial Postman Collection").


## Partner-Referrals API:

To onboard merchants to our Partner Platform in this sample, we will be using the [Partner Referrals v2 APIs](https://developer.paypal.com/docs/api/partner-referrals/v2/ "Official Partner-Referrals API Documentation"). Using the API to [Create Partner Referral](https://developer.paypal.com/docs/api/partner-referrals/v2/#partner-referrals_create "Official Create Partner Referral API Documentation") will allow the Partner to provide information that they currently have on the merchant, this improves the merchants experience with onboarding, and in the case where the merchant doesn't already have a PayPal Account, it allows them to create one more easily as you have provided the information to _pre-fill_ the pages. 

In [my postman sample](https://documenter.getpostman.com/view/3823651/SWEB3GUh?version=latest#c2b02a3f-13f7-449b-8e5e-650dee245bb4 "Unofficial API Example"), I have used a slightly modified version of the [sample request in the official PayPal Documentation](https://developer.paypal.com/docs/api/partner-referrals/v2/#partner-referrals_create "Official Create Partner Referral API Documentation").

Once you call successfully, in the response, you will see an `object` in the `links` array similar to below.  You may look through the [Sample & Documentation](https://developer.paypal.com/docs/commerce-platform/onboarding/upfront/#response-sample "Official PayPal Documentation") as well.

```json
{
    "href": "https://www.sandbox.paypal.com/us/merchantsignup/partner/onboardingentry?token=YTIwNDU2ODktMmMzOC00YzZiLWFlM2ItYzZmYjRkYTY4MTM2TDJXOVZ1Vk5yQTFaQitwTG1jWUs3dkNLY0VkM1NPNFBQTXNxYkkra1BCRT12Mg==",
    "rel": "action_url",
    "method": "GET",
    "description": "Target WEB REDIRECT URL for the next action. Customer should be redirected to this URL in the browser."
}
```

While testing, you can copy/paste the value of the `href` for the `action_url` into a browser window and login with your Sandbox Merchant account to grant permissions to the Partner Account.

The value of the `href` is what you will set in the `data-paypal-button` element's `href` value to, in order to use the _Mini-Browser_ or _"In-Context"_ Sign-up Flow on your site.  The [Partner.js and Mini-Browser Sign-up Documentation](https://developer.paypal.com/docs/commerce-platform/onboarding/upfront/#2-add-a-paypal-sign-up-link-on-your-site "Official Mini-Browser Sign-up Documentation") is available for additional information.

**Validate Seller Status:**

Once the Seller has completed the Sign-Up flow and granted the Partner account the permissions, there will be a Webhook event of `MERCHANT.ONBOARDING.COMPLETED` that will be sent via `POST` to your webhook listener.

You may want to look into the details of [Creating Webhooks](https://developer.paypal.com/docs/api/webhooks/v1/#webhooks_post "PayPal Official Webhook Documentation"), but for the purposes of basic testing, you can call the [Seller Status API](https://developer.paypal.com/docs/api/partner-referrals/v1/#merchant-integration_status "Official Show Seller Status API Documentation").

When you call the [Seller Status API](https://developer.paypal.com/docs/api/partner-referrals/v1/#merchant-integration_status "Official Show Seller Status API Documentation") you will do a `GET` to the `merchant-integrations` endpoint `/v1/customer/partners/{partner_id}/merchant-integrations/{merchant_id}`. 

Here is an [example of calling this API in my Postman collection](https://documenter.getpostman.com/view/3823651/SWEB3GUh?version=latest#9e5ca33a-4dbf-46fe-afe8-e121c4dbb994 "Unofficial API Example") if you'd like to try this out.

> _In the event that you have not obtained the merchant's `merchant_id` as the merchant didn't return to the `return_url` you specified when you [created the Partner Referral Token](https://developer.paypal.com/docs/api/partner-referrals/v2/#partner-referrals_create "Official Create Partner Referral API Documentation"), you can optionally use the `tracking_id` that you specified when you [created the Partner Referral Token](https://developer.paypal.com/docs/api/partner-referrals/v2/#partner-referrals_create "Official Create Partner Referral API Documentation") by calling the `merchant-integrations` endpoint using the `tracking_id`.  An example endpoint `GET` call would be `/v1/customer/partners/{partner_id}/merchant-integrations?tracking_id=<TRACKING_ID>`.  When you call that API by the `tracking_id` you will receive the `merchant_id` and the URL for the call in the response._

An example response to the `/v1/customer/partners/{partner_id}/merchant-integrations?tracking_id=<TRACKING_ID>` endpoint would look like this:

```json
{
    "merchant_id": "<MERCHANT_ID>",
    "tracking_id": "<TRACKING_ID>",
    "links": [
        {
            "href": "/v1/customer/partners/<PARTNER_MERCHANT_ID>/merchant-integrations/<MERCHANT_MERCHANT_ID>",
            "rel": "get",
            "method": "GET"
        }
    ]
}
```

An example response to the `/v1/customer/partners/{partner_id}/merchant-integrations/{merchant_id}` endpoint would look like this: 


```json
{
    "merchant_id": "<MERCHANT_ID>",
    "tracking_id": "<TRACKING_ID>",
    "products": [
        {
            "name": "MOBILE_PAYMENT_ACCEPTANCE",
            "status": "ACTIVE"
        }
    ],
    "payments_receivable": true,
    "primary_email_confirmed": true,
    "oauth_integrations": [
        {
            "integration_type": "OAUTH_THIRD_PARTY",
            "integration_method": "PAYPAL",
            "oauth_third_party": [
                {
                    "partner_client_id": "<PARTNER_CLIENT_ID>",
                    "merchant_client_id": "<MERCHANT_CLIENT_ID>",
                    "scopes": [
                        "https://uri.paypal.com/services/payments/realtimepayment",
                        "https://uri.paypal.com/services/payments/refund",
                        "https://uri.paypal.com/services/payments/payment/authcapture"
                    ]
                }
            ]
        }
    ]
}
```