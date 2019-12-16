# PayPal Commerce Platform - Third Party Authentication - Onboarding, Checkout with Partner Fee, and Refunds for PayPal Branded and Unbranded Transactions

> **Disclaimer:** Any Applications/code/samples provided here is provided as-is.  These examples are intended to be **EXAMPLES** and are not intended to be used in a production environment.  I am employed at PayPal, however, the code/samples/documentation herein is provided from myself as an example not from PayPal, Inc.  I hope these are helpful to helping you understand the API's, but please do not use in a production environment.  Please refer to [PayPal's Developer Site](https://developer.paypal.com/ "PayPal Developer Homepage") for official documentation.

**Use-Case/Model Description:**
    
This model allows for a Partner to act as a _Facilitator_ using the [PayPal Commerce Platform](https://developer.paypal.com/docs/commerce-platform/ "Official PayPal Commerce Platform Docs"). This allows for a Partner to onboard a merchant and obtain permissions to facilitate transactions from the consumer (`payer`) to the merchant (`payee`).

Model Diagram: 
![Model Account Diagram](CP_O_Refund_Diagram.png)

**Postman Collection:** [https://documenter.getpostman.com/view/3823651/SWEB3bjN?version=latest](https://documenter.getpostman.com/view/3823651/SWEB3bjN?version=latest "Unofficial Postman Collection")

**PayPal Product API Executor:** [https://www.paypal.com/apex/home](https://www.paypal.com/apex/home "Official PayPal Demo API's")

## Account Setup and Configuration

The [PayPal Commerce Platform](https://developer.paypal.com/docs/commerce-platform/ "Official PayPal Commerce Platform Docs") requires that the _Partner Account_ is configured for some additional Platform permissions, and this requires review and some approvals to obtain access to particular features of the [PayPal Commerce Platform](https://developer.paypal.com/docs/commerce-platform/ "Official PayPal Commerce Platform Docs").  As this is true, I have configured a [PayPal Sandbox](https://www.sandbox.paypal.com/us/home "PayPal Sandbox Homepage") Account for the purposes of running through the samples of this use-case.

**PayPal Sandbox Testing Credentials:**

```json
{
    "partner_client_id": "AdOsLibrzs5vcElBQEEoxrLjDqv0-tChCO1Ml3l_k1HD1pq0kAb2Xnda2aRqkK8TmvbfWnYwfSOkJmFz",
    "partner_client_secret": "EFrgolR0sDSOkzBzOCPwCaWGEcEVhcedUSP7V-nSydetMYpqHf409mEhzfC6sZuC0ujcoCEa6sJ4GNrq"
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

Please see my [example on Postman](https://documenter.getpostman.com/view/3823651/SWEB3bjN?version=latest#f4c1c918-4c01-49e4-b407-cc8dee36de59 "Unoffical API Example") to see an example of this request.

Additionally, feel free to review the [Official PayPal Documentation](https://developer.paypal.com/docs/api/overview/#get-an-access-token, "Official Authentication Doc") for requesting an `access_token` for additional information.


## Onboarding via Connected Path

**Description:**

For this sample we'll be using PayPal's [Connected Path Upfront Onboarding](https://developer.paypal.com/docs/commerce-platform/onboarding/upfront/ "Official Connected Path Documentation").  You may be asking _"What is Connected Path?"_.  The answer is quite straight forward, the [Connected Path Upfront Onboarding](https://developer.paypal.com/docs/commerce-platform/onboarding/upfront/ "Official Connected Path Documentation") means that the merchant can grant you (the Partner) permissions to act on their behalf, and they have agreed to the PayPal [User Agreement](https://www.paypal.com/us/webapps/mpp/ua/legalhub-full?locale.x=en_US "Official PayPal User Agreement") and will work with PayPal directly on any account inquiries.  Please read through the [PayPal Partner Program Agreement](https://www.paypal.com/us/webapps/mpp/ua/partner-program-agreement "Official Partner Program Agreement Documentation") and/or the [PayPal User Agreement](https://www.paypal.com/us/webapps/mpp/ua/legalhub-full?locale.x=en_US) for additional clarifications on the roles/responsibilities of the Partner and Merchant.

**Partner-Referrals API:**

To onboard merchants to our Partner Platform in this sample, we will be using the [Partner Referrals v2 APIs](https://developer.paypal.com/docs/api/partner-referrals/v2/ "Official Partner-Referrals API Documentation"). Using the API to [Create Partner Referral](https://developer.paypal.com/docs/api/partner-referrals/v2/#partner-referrals_create "Official Create Partner Referral API Documentation") will allow the Partner to provide information that they currently have on the merchant, this improves the merchants experience with onboarding, and in the case where the merchant doesn't already have a PayPal Account, it allows them to create one more easily as you have provided the information to _pre-fill_ the pages. 

In [my postman sample](https://documenter.getpostman.com/view/3823651/SWEB3bjN?version=latest#9ad1ddb8-5a7e-4776-8b87-75784b8c6d24 "Unofficial API Example"), I have used a slightly modified version of the [sample request in the official PayPal Documentation](https://developer.paypal.com/docs/api/partner-referrals/v2/#partner-referrals_create "Official Create Partner Referral API Documentation").

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

Here is an [example of calling this API in my Postman collection](https://documenter.getpostman.com/view/3823651/SWEB3bjN?version=latest#cd4fb674-ca5f-4cc5-98ee-76fdf40f9e9d "Unofficial API Example") if you'd like to try this out.

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

The `scopes` array in the response is important as it ensures that you have the proper permissions granted from the merchant to facilitate transactions on their behalf. Additional values for the `features` array can be found in the [`rest_endpoint_feature` documentation](https://developer.paypal.com/docs/api/partner-referrals/v2/#definition-rest_endpoint_feature "Official REST Endpoint Feature Documentation").


## Checkout

Now that we have permissions granted to the Partner, the Partner is now able to facilitate transactions on behalf of the merchant.  I will quickly go through a few components of the PayPal Checkout experience.

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
<script src="https://paypal.com/sdk/js?client-id=<PARTNER_CLIENT_ID>&merchant-id=<MERCHANTs_MERCHANT_ID>" data-partner-attribution-id="<PARTNER_ATTRIBUTION_ID>"></script>
```

### PayPal Checkout with the Order API

When the PayPal button is clicked, it calls the client-side function of `createOrder()`; within this function, you will add the code to call your server endpoint that handles the [Creation of the PayPal Order](https://developer.paypal.com/docs/api/orders/v2/#orders_create "Official PayPal Order API Documentation").  When you call the API to create this order you will use the `access_token` that was created using the Partner level `client_id` and `client_secret`, and you will pass the [JSON Web Token (JWT) in the `PayPal-Auth-Assertion` `header`](https://developer.paypal.com/docs/api/reference/api-requests/#paypal-auth-assertion "Official PayPal-Auth-Assertion Documentation").  In the response of the API, you will return the `id` from the `createOrder()` function on the client-side to initiate the PayPal Checkout.

Here is [an example of creating an Order via API](https://documenter.getpostman.com/view/3823651/SWEB3bjN?version=latest#b1ac631e-cea9-435e-8986-04c47f5f6b0e "Unofficial API Example") with the `platform_fee` included.

The customer (consumer) has clicked the button, the order was created, the consumer has logged into their PayPal Account, selected the funding option in their wallet and clicked "Pay Now" or "Continue" (Depending on the [options you selected](https://developer.paypal.com/docs/checkout/best-practices/pay-now-experience/ "Official PayPal Checkout Documentation") in PayPal's Smart Payment Buttons), and the `onApprove()` callback function has fired as the mini-browser has closed.  At this point you will send the information back to your server to call the [Capture Order API](https://documenter.getpostman.com/view/3823651/SWEB3bjN?version=latest#eb68c7f8-c3f4-4308-906f-fb5f9bb14382 "Unofficial API Example"). 

Once you call to capture the order and receive a successful response, the order is complete and the funds have been moved from the consumers PayPal account to the merchant's PayPal account.

### Credit Card Checkout with the Order API

This API functionality is very similar to the PayPal Checkout above; When the consumer elects to Checkout, you will start with the [Creation of the PayPal Order](https://developer.paypal.com/docs/api/orders/v2/#orders_create "Official PayPal Order API Documentation").  Then once you've created the Order, you will [Capture the Order](https://developer.paypal.com/docs/api/orders/v2/#orders_capture "Official PayPal Order Capture API Documentation"). The only difference is that you won't need to have the consumer login to PayPal, and you'll simply provide their Credit Card information in the call to [Capture the Order (as seen in my Postman example)](https://documenter.getpostman.com/view/3823651/SWEB3bjN?version=latest#5946d444-fd47-4d36-aa3b-c52d44190112 "Unofficial API Example").

## Refunding the Transaction

Once you have [Captured the Order](https://documenter.getpostman.com/view/3823651/SWEB3bjN?version=latest#5946d444-fd47-4d36-aa3b-c52d44190112 "Unofficial API Example") you will want to save the `response.purchase_units[0].payments.captures[0].id` as that `id` is the "Capture ID" that you will use when you Refund the Order.  Within the `POST` to Refund the Capture, you will include the `capture_id` in the URL along with the various `headers` (`PayPal-Auth-Assertion`, `PayPal-Partner-Attribution-Id`, `PayPal-Request-Id`, and of course the `Authorization`). And you may optionally provide `amount` information, an optional `invoice_id`, and optionally a `note_to_payer`.  You can view my [example refund API on Postman](https://documenter.getpostman.com/view/3823651/SWEB3bjN?version=latest#8052adb3-633a-430c-ad9d-84e94a5fe48d "Unofficial API Example") as well.

Please see the [Refund Captured Payment Documentation](https://developer.paypal.com/docs/api/payments/v2/#captures_refund "Official API Documentation") for additional info on the fields & functionality of the API.
