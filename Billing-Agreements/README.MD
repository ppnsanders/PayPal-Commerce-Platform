# PayPal Commerce Platform - Billing Agreements

> **Disclaimer:** Any Applications/code/samples provided here is provided as-is.  These examples are intended to be **EXAMPLES** and are not intended to be used in a production environment.  I am employed at PayPal, however, the code/samples/documentation herein is provided from myself as an example not from PayPal, Inc.  I hope these are helpful to helping you understand the API's, but please do not use in a production environment.  Please refer to [PayPal's Developer Site](https://developer.paypal.com/ "PayPal Developer Homepage") for official documentation.

**Description:**

This Document will describe the difference(s) with PayPal Billing Agreements between `MERCHANT_INITIATED_BILLING` and `CHANNEL_INITIATED_BILLING`.

## Merchant Initiated Billing - Billing Agreements

**Description:**

This type of Billing Agreement is an Agreement between the Consumer (`payer`) and the Merchant (`payee`).

The "Checkout" is the creation of a Billing Agreement, after that Billing Agreement is created, it will be used to make the payment and move the funds from the consumer (`payer`) to the merchant (`payee`).

Currently, a merchant must have *Billing Agreements* enabled on their account to use this feature, this is because this functionality is a *vetted* feature that allows for Reference Transactions capabilities to charge the consumer (`payer`) based on the Terms & Conditions set out by the Merchant.

This feature is similar to the capabilities of *vaulting* a funding instrument, and in this case is the ability for a merchant to *save* the `payer`'s PayPal Account as a funding instrument for future transactions.

[Documentation for this case](https://github.com/ppnsanders/PayPal-Commerce-Platform/tree/master/Billing-Agreements/Connected_Path_Merchant_BA_Orders_Refund "Github Page for Merchant Initiated Billing with PCP")

## Channel Initiated Billing - Billing Agreements

This type of Billing Agreement is an Agreement between the Consumer (`payer`) and the Partner (*Platform*).  That allows the platform to *save* the Billing Agreement for use between the consumer (`payer`) and other parties/merchant's (`payee`'s) on their platform.

Consider if the Partner platform in this case is a *Marketplace*, the Partner hosts this platform and enables their customers to buy & sell items on the platform.  In this case the Consumer has a relationship with the Partner, as does the Merchant, and the *Marketplace* has agreed to the Terms & Conditions set out by the *Marketplace*.