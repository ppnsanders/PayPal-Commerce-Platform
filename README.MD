# PayPal-Commerce-Platform

---

## Accounts

First I'd like to set the context by describing the PayPal Accounts Modeling and how they operate in the PayPal Commerce Platform.

You'll typically have 3 accounts in this model:

1. Partner Account (API Caller)
2. Merchant Account (`payee`)
3. Consumer Account (`payer`)

This is the "standard use-case" and all of the documents in this repo have an assumption that "you" are the Partner and acting as the _facilitator_ or "API Caller".

### Configuration & Setup

As a Partner, you must be setup with an account with the appropriate configuration to be able to _facilitate_ API calls on behalf of a Merchant Account. The information on the [developer.paypal.com page for Partner Onboarding](https://developer.paypal.com/docs/commerce-platform/onboarding/partner-onboarding/ "Official Partner Onboarding Documentation") will inform you how to _apply_ for a Partner Account. 

Currently (as of today, 12/18/2019), PayPal must configure both of your accounts (Sandbox & Production) in order for you to use the [PayPal Commerce Platform](https://developer.paypal.com/docs/commerce-platform/ "Official PayPal Commerce Platform Documentation") solution(s). Therefore, I have included credentials in my samples that have Partner Accounts that have been configured for the applicable use-case.  You may use those API Credentials to verify the API's and test with the Postman collections that are provided in the use-case documentation.

## Use-Case Specific Documentation

Within this repository, I provide some use-case specific documents to help with the integration of [PayPal Commerce Platform](https://developer.paypal.com/docs/commerce-platform/ "Official PayPal Commerce Platform Documentation").  The naming of the directories reflect the [PayPal Commerce Platform](https://developer.paypal.com/docs/commerce-platform/ "Official PayPal Commerce Platform Documentation") products that are used, I name them this way to help me with updating and testing the various cases. 

### Third-Party Facilitator Models

The use-cases listed here suit the model where the Partner has a _Hosted Platform_, meaning that the Partner hosts the application driving the platform and Merchants and Consumers access this Platform to interact and make transactions.  This may be a _Marketplace_, _Hosted Shopping Cart_, or other hosted platform.

**eCommerce - Partner NOT charging a per-transaction fee**

In this model, the Partner is simply a _facilitator_ of the transactions and will not collect a "platform fee" or "partner fee" per transaction. 

* Merchant Onboarding Used: [Connected Path Upfront Onboarding](https://developer.paypal.com/docs/commerce-platform/onboarding/upfront/ "Official PayPal Documentation")
* Checkout Used: [PayPal Smart Payment Buttons](https://developer.paypal.com/docs/commerce-platform/payment/checkout/ "Official PayPal Checkout Documentation") and [Orders v2 API](https://developer.paypal.com/docs/api/orders/v2/ "Official PayPal API Documentation")
* Refunds Used: [PayPal Refund API with Payments v2 API](https://developer.paypal.com/docs/commerce-platform/refunds/ "Official PayPal Refund Documentation")

My Full Step-By-Step Readme Documentation: [Connected_Path_Orders_Refund](Connected_Path_Orders_Refund/README.MD "Unofficial Sample Document")

**eCommerce - Partner IS charging a per-transaction fee**

In this model, the Partner is simply a _facilitator_ of the transactions and WILL collect a "platform fee" or "partner fee" per transaction. Besides the collection of the Partner Fee, this model is the same as the above example.

* Merchant Onboarding Used: [Connected Path Upfront Onboarding](https://developer.paypal.com/docs/commerce-platform/onboarding/upfront/ "Official PayPal Documentation")
* Checkout Used: [PayPal Smart Payment Buttons](https://developer.paypal.com/docs/commerce-platform/payment/checkout/ "Official PayPal Checkout Documentation") and [Orders v2 API](https://developer.paypal.com/docs/api/orders/v2/ "Official PayPal API Documentation")
* Refunds Used: [PayPal Refund API with Payments v2 API](https://developer.paypal.com/docs/commerce-platform/refunds/ "Official PayPal Refund Documentation")

My Full Step-By-Step Readme Documentation: [Connected_Path_Orders_Fee_Refund](Connected_Path_Orders_Fee_Refund/README.MD "Unofficial Sample Document")

**eCommerce - Billing Agreements between the Merchant and Consumer**

In this model, the Partner manages the creation of a Billing Agreement between the Consumer (`payer`) and the Merchant (`payee`).  This use-case is applicable in most Hosted Platforms when the Consumer (`payer`) is not necessarily aware of the Platform that hosts the Merchants (`payee`'s) site/experience.  A primary callout here is that when the Consumer logs into PayPal, they will see information about their Agreement and they will see the Merchant's name in the Terms & Conditions of the Billing Agreement.

I give additional specifics of the Merchant and Consumer Billing Agreements in the [Billing-Agreements README](Billing-Agreements/README.MD).

* Merchant Onboarding Used: [Connected Path Upfront Onboarding](https://developer.paypal.com/docs/commerce-platform/onboarding/upfront/ "Official PayPal Documentation")
* Checkout Used: [PayPal Smart Payment Buttons](https://developer.paypal.com/docs/commerce-platform/payment/checkout/ "Official PayPal Checkout Documentation"), [PayPal Billing Agreements](https://developer.paypal.com/docs/limited-release/reference-transactions/#create-billing-agreement "Official PayPal Billing Agreement Documentation"), and [Orders v2 API](https://developer.paypal.com/docs/api/orders/v2/ "Official PayPal API Documentation")
* Refunds Used: [PayPal Refund API with Payments v2 API](https://developer.paypal.com/docs/commerce-platform/refunds/ "Official PayPal Refund Documentation")

My Full Step-By-Step Readme Documentation: [Connected_Path_Merchant_BA_Orders_Refund](Connected_Path_Merchant_BA_Orders_Refund/README.MD)

**eCommerce - Billing Agreements between the Partner and Consumer**

In this model, the Partner allows the Consumer (`payer`) to enter into a Billing Agreement with the Partner or Platform.  This use-case is applicable in most _Marketplace_ type models where the Consumer (`payer`) is aware of the Platform and may be adding PayPal as a Funding Source on that Platform. A primary callout here is that when the Consumer logs into PayPal, they will see information about their Agreement and they will see the Partner's name in the Terms & Conditions of the Billing Agreement.

I give additional specifics of the Partner and Consumer Billing Agreements in the [Billing-Agreements README](Billing-Agreements/README.MD).

* Merchant Onboarding Used: [Connected Path Upfront Onboarding](https://developer.paypal.com/docs/commerce-platform/onboarding/upfront/ "Official PayPal Documentation")
* Checkout Used: [PayPal Smart Payment Buttons](https://developer.paypal.com/docs/commerce-platform/payment/checkout/ "Official PayPal Checkout Documentation"), [PayPal Billing Agreements](https://developer.paypal.com/docs/limited-release/reference-transactions/#create-billing-agreement "Official PayPal Billing Agreement Documentation"), and [Orders v2 API](https://developer.paypal.com/docs/api/orders/v2/ "Official PayPal API Documentation")
* Refunds Used: [PayPal Refund API with Payments v2 API](https://developer.paypal.com/docs/commerce-platform/refunds/ "Official PayPal Refund Documentation")

My Full Step-By-Step Readme Documentation: [Connected_Path_Partner_BA_Orders_Refund](Connected_Path_Partner_BA_Orders_Refund/README.MD)