# Detailed Onboarding Information 

This builds upon the section in the [SUMMARY.MD](../SUMMARY.MD#checkout "Link to SUMMARY.MD") for [Onboarding via Connected Path](../SUMMARY.MD#checkout "Link to Checkout Section") section to detail the API's used and presented in the [associated Postman Collection](https://documenter.getpostman.com/view/3823651/SWEB3GUh?version=latest "Unofficial Postman Collection").


## Smart Payment Buttons & the JS SDK

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

Here is [an example of creating an Order via API](https://documenter.getpostman.com/view/3823651/SWEB3GUh?version=latest#b46aaf29-c1ca-406e-8e71-8caa8fd24726 "Unofficial API Example"). 

The customer (consumer) has clicked the button, the order was created, the consumer has logged into their PayPal Account, selected the funding option in their wallet and clicked "Pay Now" or "Continue" (Depending on the [options you selected](https://developer.paypal.com/docs/checkout/best-practices/pay-now-experience/ "Official PayPal Checkout Documentation") in PayPal's Smart Payment Buttons), and the `onApprove()` callback function has fired as the mini-browser has closed.  At this point you will send the information back to your server to call the [Capture Order API](https://documenter.getpostman.com/view/3823651/SWEB3GUh?version=latest#cdb4ef99-abcd-488b-8617-3b09ea55f7bf "Unofficial API Example"). 

Once you call to capture the order and receive a successful response, the order is complete and the funds have been moved from the consumers account to the merchant's account.