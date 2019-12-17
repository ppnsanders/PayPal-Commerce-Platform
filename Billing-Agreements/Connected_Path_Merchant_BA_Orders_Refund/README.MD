# PayPal Commerce Platform - Third Party Authentication - Onboarding, Merchant Billing Agreement, Checkout with Partner Fee, and Refunds for Branded Transactions

> **Disclaimer:** Any Applications/code/samples provided here is provided as-is.  These examples are intended to be **EXAMPLES** and are not intended to be used in a production environment.  I am employed at PayPal, however, the code/samples/documentation herein is provided from myself as an example not from PayPal, Inc.  I hope these are helpful to helping you understand the API's, but please do not use in a production environment.  Please refer to [PayPal's Developer Site](https://developer.paypal.com/ "PayPal Developer Homepage") for official documentation.

**Use-Case/Model Description:**

This model allows for a Partner to act as a _Facilitator_ using the [PayPal Commerce Platform](https://developer.paypal.com/docs/commerce-platform/ "Official PayPal Commerce Platform Docs") to onboard a merchant and obtain permissions to facilitate transactions, collect a Partner Fee from the merchant, and create and execution [PayPal Billing Agreements](https://developer.paypal.com/docs/limited-release/reference-transactions/#create-billing-agreement "Official PayPal Billing Agreement Documentation") and payments from the consumer (`payer`) to the merchant (`payee`).

Model Diagram: 
![Model Account Diagram](../images/CP_MIB_O_F_R_Diagram.png)

**Postman Collection:** [https://documenter.getpostman.com/view/3823651/SWECVum1?version=latest](https://documenter.getpostman.com/view/3823651/SWECVum1?version=latest "Unofficial Postman Collection")

**PayPal Product API Executor:** [https://www.paypal.com/apex/home](https://www.paypal.com/apex/home "Official PayPal Demo API's")

## Account Setup and Configuration

The [PayPal Commerce Platform](https://developer.paypal.com/docs/commerce-platform/ "Official PayPal Commerce Platform Docs") requires that the _Partner Account_ is configured for some additional Platform permissions, and this requires review and some approvals to obtain access to particular features of the [PayPal Commerce Platform](https://developer.paypal.com/docs/commerce-platform/ "Official PayPal Commerce Platform Docs").  As this is true, I have configured a [PayPal Sandbox](https://www.sandbox.paypal.com/us/home "PayPal Sandbox Homepage") Account for the purposes of running through the samples of this use-case.

**PayPal Sandbox Testing Credentials:**

```json
{
    "partner_client_id": "ATonIbrr2EUER8KtXhwPoo8MgMVAl9rf26fwWH4xuMtu11AvHe8QldkU8lQUXQ_ZbzDH_7Nqfxk4pwCl",
    "partner_client_secret": "EE-mqAWTucJ4mUlcLCYeWubct69ojnVmpYXO_1KceKHNzzTFAJ_HJEUcGJRGqY05U4OvdyBCRyNpqM2d"
}
```

## Authentication

**Description:**

Third-Party Authentication will allow the Partner to Authenticate to PayPal using the Partner's `client_id` and `client_secret` to obtain an `access_token` that will be provided in the `Authentication` `header` of the API Request.  Along with the Partner's `access_token` the Partner will need to provide the `PayPal-Auth-Assertion` `header` which allows for the Partner to provide PayPal with the information on the merchant they are facilitating the API on behalf of.

| PayPal Documentation |
|:------------------------:|
| [Get an `access_token`](https://developer.paypal.com/docs/api/overview/#get-an-access-token "Official Authentication Doc") |
| [Authorization Assertion Header](https://developer.paypal.com/docs/api/reference/api-requests/#paypal-auth-assertion "Official Auth-Header Doc") |

To request an `access_token` you will `POST` your `client_id` and `client_secret` to the API Endpoint (`https://api.sandbox.paypal.com/v1/oauth2/token`) with the data of your `grant_type` set to `client_credentials`. 

Please see my [example on Postman](https://documenter.getpostman.com/view/3823651/SWECVum1?version=latest#953d1d1c-a49d-4037-bcb6-473d5761b081 "Unoffical API Example") to see an example of this request.

Additionally, feel free to review the [Official PayPal Documentation](https://developer.paypal.com/docs/api/overview/#get-an-access-token, "Official Authentication Doc") for requesting an `access_token` for additional information.

## Onboarding via Connected Path

**Description:**

For this sample we'll be using PayPal's [Connected Path Upfront Onboarding](https://developer.paypal.com/docs/commerce-platform/onboarding/upfront/ "Official Connected Path Documentation").  You may be asking _"What is Connected Path?"_.  The answer is quite straight forward, the [Connected Path Upfront Onboarding](https://developer.paypal.com/docs/commerce-platform/onboarding/upfront/ "Official Connected Path Documentation") means that the merchant can grant you (the Partner) permissions to act on their behalf, and they have agreed to the PayPal [User Agreement](https://www.paypal.com/us/webapps/mpp/ua/legalhub-full?locale.x=en_US "Official PayPal User Agreement") and will work with PayPal directly on any account inquiries.  Please read through the [PayPal Partner Program Agreement](https://www.paypal.com/us/webapps/mpp/ua/partner-program-agreement "Official Partner Program Agreement Documentation") and/or the [PayPal User Agreement](https://www.paypal.com/us/webapps/mpp/ua/legalhub-full?locale.x=en_US) for additional clarifications on the roles/responsibilities of the Partner and Merchant.

**Partner-Referrals API:**

To onboard merchants to our Partner Platform in this sample, we will be using the [Partner Referrals v2 APIs](https://developer.paypal.com/docs/api/partner-referrals/v2/ "Official Partner-Referrals API Documentation"). Using the API to [Create Partner Referral](https://developer.paypal.com/docs/api/partner-referrals/v2/#partner-referrals_create "Official Create Partner Referral API Documentation") will allow the Partner to provide information that they currently have on the merchant, this improves the merchants experience with onboarding, and in the case where the merchant doesn't already have a PayPal Account, it allows them to create one more easily as you have provided the information to _pre-fill_ the pages. 

In [my postman sample](https://documenter.getpostman.com/view/3823651/SWECVum1?version=latest#ebf9a1ce-8a8d-44da-b644-f3d8bf8ff82f "Unofficial API Example"), I have used a slightly modified version of the [sample request in the official PayPal Documentation](https://developer.paypal.com/docs/api/partner-referrals/v2/#partner-referrals_create "Official Create Partner Referral API Documentation").

Once you call successfully, in the response, you will see an `object` in the `links` array similar to below.  You may look through the [Sample & Documentation](https://developer.paypal.com/docs/commerce-platform/onboarding/upfront/#response-sample "Official PayPal Documentation") as well.

```json
{
      "href": "https://www.sandbox.paypal.com/us/merchantsignup/partner/onboardingentry?token=MWE0ODA0YzgtMThiYS00NzViLTljYjctNjQxNTAzMTRmZWFkaHRKd1grT3Z6YWpISWdKTXRkT0ZGaWNib0QzV3lwSlpYM1I5MXExb2NvQT12Mg==",
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

Here is an [example of calling this API in my Postman collection](https://documenter.getpostman.com/view/3823651/SWECVum1?version=latest#dcfb2fdc-e723-403d-a24c-c996f3cc1380 "Unofficial API Example") if you'd like to try this out.

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
    "merchant_id": "69MAHQZ7WS83S",
    "tracking_id": "TRACK_643a82ff-8def-4552-bdc7-2afc4de069a3",
    "products": [
        {
            "name": "PPCP_STANDARD",
            "vetting_status": "SUBSCRIBED",
            "capabilities": [
                "ALT_PAY_PROCESSING",
                "PAYPAL_CREDIT_PROCESSING",
                "RECEIVE_MONEY",
                "SEND_MONEY",
                "STANDARD_CARD_PROCESSING",
                "VENMO_PAY_PROCESSING",
                "WITHDRAW_MONEY"
            ]
        },
        {
            "name": "PPCP_CUSTOM",
            "vetting_status": "SUBSCRIBED",
            "capabilities": [
                "AMEX_OPTBLUE",
                "CARD_PROCESSING_VIRTUAL_TERMINAL",
                "COMMERCIAL_ENTITY",
                "CUSTOM_CARD_PROCESSING",
                "DEBIT_CARD_SWITCH",
                "FRAUD_TOOL_ACCESS"
            ]
        },
        {
            "name": "MOBILE_PAYMENT_ACCEPTANCE",
            "status": "ACTIVE"
        }
    ],
    "capabilities": [
        {
            "name": "ALT_PAY_PROCESSING",
            "status": "ACTIVE"
        },
        {
            "name": "PAYPAL_CREDIT_PROCESSING",
            "status": "ACTIVE"
        },
        {
            "name": "RECEIVE_MONEY",
            "status": "ACTIVE"
        },
        {
            "name": "SEND_MONEY",
            "status": "ACTIVE"
        },
        {
            "name": "STANDARD_CARD_PROCESSING",
            "status": "ACTIVE"
        },
        {
            "name": "VENMO_PAY_PROCESSING",
            "status": "ACTIVE"
        },
        {
            "name": "WITHDRAW_MONEY",
            "status": "ACTIVE"
        },
        {
            "name": "AMEX_OPTBLUE",
            "status": "ACTIVE"
        },
        {
            "name": "CARD_PROCESSING_VIRTUAL_TERMINAL",
            "status": "ACTIVE"
        },
        {
            "name": "COMMERCIAL_ENTITY",
            "status": "ACTIVE"
        },
        {
            "name": "CUSTOM_CARD_PROCESSING",
            "status": "ACTIVE"
        },
        {
            "name": "DEBIT_CARD_SWITCH",
            "status": "ACTIVE"
        },
        {
            "name": "FRAUD_TOOL_ACCESS",
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
                    "partner_client_id": "ATonIbrr2EUER8KtXhwPoo8MgMVAl9rf26fwWH4xuMtu11AvHe8QldkU8lQUXQ_ZbzDH_7Nqfxk4pwCl",
                    "merchant_client_id": "AdUZ8gSHw1xzlV5Tijy08zW6JaImSTcb-u7dMXgN5J6--JGu3dJ1xlRmu5ot-ABLEqPqSM0n6QGeQ5TW",
                    "scopes": [
                        "https://uri.paypal.com/services/payments/realtimepayment",
                        "https://uri.paypal.com/services/payments/futurepayments",
                        "https://uri.paypal.com/services/payments/partnerfee",
                        "https://uri.paypal.com/services/payments/refund",
                        "https://uri.paypal.com/services/payments/payment/authcapture"
                    ]
                }
            ]
        }
    ]
}
```

The `scopes` array in the response is important as it ensures that you have the proper permissions granted from the merchant to facilitate transactions on their behalf. Additional values for the `features` array can be found in the [`rest_endpoint_feature` documentation](https://developer.paypal.com/docs/api/partner-referrals/v2/#definition-rest_endpoint_feature "Official REST Endpoint Feature Documentation").

## Checkout

This varies from the other Checkout flows as you're not creating the transaction at this point for PayPal Transactions but rather you're creating a Billing Agreement between the Consumer (`payer`) and the Merchant (`payee`).  Then after you have created the Billing Agreement, you will create an order and use that Billing Agreement as the funding source for the capture.

### Smart Payment Buttons & the JS SDK

**Description:**
    
When [PayPal's Smart Payment Buttons](https://developer.paypal.com/docs/checkout/ "Official PayPal Checkout Documentation") are rendered, the JS SDK is loaded into the page via the `<script>` tag.  There are three key components when loading the JS SDK into the page. First, the `client-id` value should be the value of the *Partner* in this case as we are doing a _Third-Party_ model here. Second, the `merchant-id` value should be the *Merchant's* `merchant_id`. This allows for the _Third-Party_ model to persist on both the client and server sides of the integration. Third, the `data-partner-attribution-id` script parameters value would be the *Partner's* Attribution ID to ensure that the render is associated with the order once the consumer _clicks_ on the button.

*Why is this important?* When the script is loaded with the *Partner's* `client-id` and the *Merchant's* `merchant-id` the data associated can be tied back to the merchant to allow the merchant to offer [PayPal Store Cash](https://www.paypal.com/us/smarthelp/article/what-is-store-cash-and-how-does-it-work-faq4055) to the customer if they don't complete their checkout to help re-engage the customer.

| PayPal Documentation |
|:------------------------:|
| [PayPal Checkout Smart Payment Buttons](https://developer.paypal.com/docs/checkout/ "Official PayPal Checkout Documentation") |
| [PayPal Checkout Best Practices](https://developer.paypal.com/docs/checkout/best-practices/ "Official PayPal Checkout Best Practices Documentation") |
| [PayPal Smart Payment Buttons Demo](https://developer.paypal.com/demo/checkout/#/pattern/server "Official PayPal Smart Payment Buttons Demo") |
| [JS SDK Query Parameters](https://developer.paypal.com/docs/checkout/reference/customize-sdk/#query-parameters "Official PayPal JS SDK Documentation") |
| [JS SDK Attribution ID](https://developer.paypal.com/docs/checkout/reference/customize-sdk/#partner-attribution-id "Official PayPal JS SDK Attribution ID Documentation") |
| [PayPal Store Cash](https://www.paypal.com/us/smarthelp/article/what-is-store-cash-and-how-does-it-work-faq4055) |

| Other Links |
|:------------------------:|
| [Store Cash Integration](https://gist.github.com/ppnsanders/44dcb36a0ea50f17b76f9d2f0db14b0a "Unofficial Store Cash Integration Documentation") |

**Implementation:**

When you load the [PayPal JS SDK](https://developer.paypal.com/docs/checkout/reference/ "Official PayPal Checkout Documentation") on the client's page, you will dynamically include the *Merchant's* `merchant-id` value in the `<script>` tag.

An example `<script>` tag for loading the JS SDK into your page:

```
<script src="https://paypal.com/sdk/js?client-id=<PARTNER_CLIENT_ID>&merchant-id=<MERCHANTs_MERCHANT_ID>&vault=true" data-partner-attribution-id="<PARTNER_ATTRIBUTION_ID>"></script>
```

A couple of things to note with the button implementation:

1. You must add `vault=true` to the JS SDK `src` value. 
2. As you are creating a Billing Agreement Token, and not an Order, you must call the `createBillingAgreement()` function and **NOT** the `createOrder()` function.

For Example:

```javascript
createBillingAgreement(data, actions) {
    return "<BA-TOKEN>";
}
```

### Create the Billing Agreement Token

First you will specify the information for the creation of the Billing Agreement Token.

See [my postman example](https://documenter.getpostman.com/view/3823651/SWECVum1?version=latest#c74adb99-2fa9-471e-beba-85432bbf7557 "Unofficial API Example") for a specific example of how to create this token.  You may also review information on the [PayPal Limited-Release Documentation](https://developer.paypal.com/docs/limited-release/reference-transactions/#create-billing-agreement-token "Official PayPal Documentation").

Once you create the token on your server, you'll `return` the `ba_token` from the `createBillingAgreement()` function on the client-side.

The *Mini-Browser* flow will display and the Consumer (`payer`) will login to PayPal, select their funding method, and agree to the Billing Agreement. Once the Consumer (`payer`) clicks "Agree & Continue", the `onApprove()` callback function, will fire and the *Mini-Browser* will close.

The `data` object will have the following information in the `onApprove(data, actions)` callback.

```javascript
{
    billingToken: "<BILLING_TOKEN>"
    orderID: "<EC_ORDER_ID>"
    payerID: "<PAYER_ID>"
}
```

### Execute Billing Agreement

With the information above in the `data` object from the `onApprove()`callback, you will [Execute the Billing Agreement](https://developer.paypal.com/docs/limited-release/reference-transactions/#create-billing-agreement "Official PayPal API Documentation").  This will provide you with a Billing Agreement ID that you will use to process the Order.

An example for [Executing the Billing Agreement can be found on my postman example](https://documenter.getpostman.com/view/3823651/SWECVum1?version=latest#6e863d10-96d4-4f89-83ee-b60a2aa751bf "Unofficial API Example") as well.

In the Response to that call, you will receive the Billing Agreement ID as well as the `payer_id` of the Consumer (`payer`).

### Create Order

When creating an Order that will be captured with a Billing Agreement, you will want to pass the Consumer's (`payer`'s) `payer_id` as part of that request. In the Order's `payer.payer_id` value, you will set the `payer_id` value that you received in the response from [Executing the Billing Agreement](https://developer.paypal.com/docs/limited-release/reference-transactions/#create-billing-agreement "Official PayPal API Documentation").

I pass this `payer_id` in my [Create Order example in my Postman Collection](https://documenter.getpostman.com/view/3823651/SWECVum1?version=latest#bd11264a-257c-46d2-9b8f-059c36327593 "Unofficial API Example") as well.


### Capture Order

In the response of the Create Order, you will receive the `order_id` that you will use to capture that order.

[Postman Example Capture with a Billing Agreement](https://documenter.getpostman.com/view/3823651/SWECVum1?version=latest#7b682687-0f1e-4864-b472-a5904b91340d "Unofficial API Example")
[PayPal Capture Order Documentation](https://developer.paypal.com/docs/api/orders/v2/#orders_capture "Official PayPal Capture Order Documentation")

## Refund Order

Once you have Captured the Order, in the response you will use the `capture_id` to [Refund the Capture](https://developer.paypal.com/docs/api/payments/v2/#captures_refund "Official PayPal Refund API Documentation"). This API is present in [my postman collection](https://documenter.getpostman.com/view/3823651/SWECVum1?version=latest#c26c8872-5b70-4125-80fa-a0a471c0f834 "Unofficial API Example") as well.
