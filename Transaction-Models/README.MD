# Transaction Models

# Work-In-Progress

*Postman examples of these models is in progress and I will update as soon as it is complete.*

These transaction models will address the various models needed within the Partner's platform depending on the use-case needed.

## Delayed vs. Instant Disbursements

**Instant:** The funds are released to the merchant's (`payee`) account as a result of the transaction. [Official PayPal Documentation on Instant Disbursements](https://developer.paypal.com/docs/commerce-platform/v1/payouts/instant/ "Official PayPal Documentation").

**Delayed:** The funds are held for a finite number of days (In the U.S. the number of days is 28). The Partner can release the funds through a [referenced payout](https://developer.paypal.com/docs/api/referenced-payouts/v1/#referenced-payouts-items_create "Official PayPal Documentation"). Otherwise, the funds disbursed automatically after the specified duration (In the U.S. this would be after 28 days). [Official PayPal Documentation on Delayed Disbursements](https://developer.paypal.com/docs/commerce-platform/v1/payouts/delayed-disbursement/?mark=delayed%20 "Official PayPal Documentation").

> **Note:** _When using delayed disbursements, ensure that you request the [`DELAY_FUNDS_DISBURSEMENT` feature](https://developer.paypal.com/docs/api/partner-referrals/v2/#definition-third_party_details "Official PayPal Documentation") when onboarding your merchant so you have the proper permissions to delay disbursements to that merchant._

## "Sale" or "Capture" Model

**Description:** This model implies that there isn't an "Authorization & Capture" as two separate steps, but rather the actual *money-movement* happens *instantly* as part of the transaction.

**Use-Case:** This is the simplest use-case where the funds will move from the buyer (`payer`) to the merchant (`payee`) instantly.  This is a common transaction model in the event where the transaction occurs for an instantly delievered product (e.g. Digital Download), or for a service where the service has been completed and the buyer (`payee`) is paying an "invoice" for the services they received.

**Example Steps:**
1. Order is created via the [Create Order API](https://developer.paypal.com/docs/api/orders/v2/#orders_create "Official PayPal Documentation").
2. Buyer (`payer`) authorizes the Order on PayPal.
3. The buyer (`payer`) returns to the site and the [order is captured via API](https://developer.paypal.com/docs/api/orders/v2/#orders_capture "Official PayPal Documentation"), and money moves from the buyer (`payer`) to the merchant (`payee`).

## Delayed Disbursement with the "Sale" or "Capture" Model

**Description:** This model implies that the buyer (`payer`) must *release* the funds, but the *Partner* will decide (based on a Platform specific condition) when the funds are *released* to the merchant (`payee`).

**Use-Case:** This is a fairly simple use-case where the Partner or Platform will determine the release of funds from the buyer (`payer`) to the merchant (`payee`).  For example, if the Platform has Terms & Conditions regarding a buyers (`payer`) leaves _feedback_ on their experience before the funds are released to the merchant (`payee`).  The Platform could complete the transaction and disburse the funds once _feedback_ has been obtained by the buyer (`payer`). 

**Example Steps:**
1. Order is created via the [Create Order API](https://developer.paypal.com/docs/api/orders/v2/#orders_create "Official PayPal Documentation").
2. Buyer (`payer`) authorizes the Order on PayPal.
3. The buyer (`payer`) returns to the site and the [order is captured via API](https://developer.paypal.com/docs/api/orders/v2/#orders_capture "Official PayPal Documentation"), the money moves from the buyer (`payer`) to PayPal and is "held".
4. Partner disburses the funds via the [Referenced Payout Item API](https://developer.paypal.com/docs/api/referenced-payouts/v1/#referenced-payouts-items_create "Official PayPal Documentation"), to move the funds from the PayPal "hold" to the merchant (`payee`).

## Authorization & Capture Model

**Description:** In this model, the buyer (`payer`) will allow an authorization (3-day honor period hold/29 day capture period hold) on their funding source during checkout.  The idea being when shipping a physical good, that the authorization will be placed and later the capture will be placed to collect the funds once the goods have shipped.

**Use-Case:** This is a fairly well-known transaction model that is primarily used for the online purchase of physical goods.  At the time of checkout the transaction is initially authorized to ensure that the funds are available on a valid funding instrument.  Once the physical item is _shipped_ the capture would occur.  With some common credit-card type transaction models, there may be a "batch" at a specific time that runs and "captures" all open authorizations that are _"ready for capture"_.  With this model in PayPal, this could be managed by the platform to _loop-through_ all open authorizations at a specified time, but each capture should be done via a single [Capture Authorized Payment API](https://developer.paypal.com/docs/api/payments/v2/#authorizations_capture "Official PayPal Documentation").

**Example Steps:**
1. Order is created via the [Create Order API](https://developer.paypal.com/docs/api/orders/v2/#orders_create "Official PayPal Documentation").
2. Buyer (`payer`) authorizes the Order on PayPal.
3. An Authorization is created via the [Authorize payment for order API](https://developer.paypal.com/docs/api/orders/v2/#orders_authorize "Official PayPal Documentation") (Honor period of 3 days, valid for capture for 29 days).
4. Based on the platform logic, the authorization is captured via the [Capture Authorized Payment API](https://developer.paypal.com/docs/api/payments/v2/#authorizations_capture "Official PayPal Documentation") within the 29 days of creating the Authorization.
5. After the [Capture is complete](https://developer.paypal.com/docs/api/payments/v2/#authorizations-capture-response "Official PayPal Documentation") (i.e. `status === "COMPLETED"`), the funds are moved from the buyer (`payer`) to the merchant (`payee`).

## Authorization & Capture with Delayed Disbursement Model

**Description:** In this model, the buyer (`payer`) will allow an authorization (3-day honor period hold/29 day capture period hold) on their funding source during checkout.  The idea being when shipping a physical good, that the authorization will be placed and later the capture will be placed to collect the funds once the goods have shipped.

**Use-Case:** Similarly to the Authorization & Capture model above, the only difference here is that upon the capture of the transaction, the funds are move from the buyer (`payer`) to PayPal and placed _"on-hold"_ until released via the disbursement by the partner.  For example, in the case where the Partner is facilitating the transaction between the buyer (`payer`) and merchant (`payee`) for a physical item, the Partner may require that a tracking number for the shipment of the item is entered before capturing the transaction; Additionally, the Partner may have an automated API via the shipping provider to check/get updates as to when that shipment is _Marked as delivered_ at which time the Partner would disburse the funds to the merchant (`payee`). 

**Example Steps:**
1. Order is created via the [Create Order API](https://developer.paypal.com/docs/api/orders/v2/#orders_create "Official PayPal Documentation").
2. Buyer (`payer`) authorizes the Order on PayPal.
3. An Authorization is created via the [Authorize payment for order API](https://developer.paypal.com/docs/api/orders/v2/#orders_authorize "Official PayPal Documentation") (Honor period of 3 days, valid for capture for 29 days).
4. Based on the platform logic, the authorization is captured via the [Capture Authorized Payment API](https://developer.paypal.com/docs/api/payments/v2/#authorizations_capture "Official PayPal Documentation") within the 29 days of creating the Authorization. The [`payment_instruction`](https://developer.paypal.com/docs/api/payments/v2/#definition-payment_instruction "Official PayPal Documentation") in the capture API would have `disbusement_mode` set to `DELAYED`.
5. After the [Capture is complete](https://developer.paypal.com/docs/api/payments/v2/#authorizations-capture-response "Official PayPal Documentation") (i.e. `status === "COMPLETED"`), the funds are moved from the buyer (`payer`) to PayPal and "held".
6. Partner disburses the funds via the [Referenced Payout Item API](https://developer.paypal.com/docs/api/referenced-payouts/v1/#referenced-payouts-items_create "Official PayPal Documentation"), to move the funds from the PayPal "hold" to the merchant (`payee`).

## Order -> Authorization -> Capture Model

_This is currently high-level, I'm working on defining these further._

**Description:** In this model the buyer (`payer`) will approve the order but the authorization (3-day honor period hold/29 day capture period hold) will not be placed on their funding source until the authorization call is made, and the funds will not be moved from the buyer (`payer`) to the merchant (`payee`) until the capture call is made. 

**Example Steps:**
1. Order is created.
2. Buyer (`payer`) authorizes the Order on PayPal.
3. Order is `saved`.
4. Based on Platform logic, an Authorization is created (Honor period of 3 days, valid for capture for 29 days).
5. Based on platform logic, the authorization is captured within the 29 days that it's open.
6. Funds are moved from the buyer (`payer`) to the merchant (`payee`).

## Order -> Authorization -> Capture with Delayed Disbursement Model

_This is currently high-level, I'm working on defining these further._

**Description:** In this model the buyer (`payer`) will approve the order but the authorization (3-day honor period hold/29 day capture period hold) will not be placed on their funding source until the authorization call is made, and the funds will not be moved from the buyer (`payer`) to the merchant (`payee`) until the capture call is made. 

**Example Steps:**
1. Order is created.
2. Buyer (`payer`) authorizes the Order on PayPal.
3. Order is `saved`.
4. Based on Platform logic, an Authorization is created (Honor period of 3 days, valid for capture for 29 days).
5. Based on platform logic, the authorization is captured within the 29 days that it's open.
6. Funds are moved from the buyer (`payer`) and are "held" by PayPal.
7. Partner disburses the funds from the PayPal "hold" to the merchant (`payee`).

