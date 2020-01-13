# Transaction Models

# Work-In-Progress

*I'm working on building this content out along with a postman example to demonstrate the models.*

These transaction models will address the various models needed within the Partner's platform depending on the use-case needed.

## "Sale" or "Capture" Model

**Description:** This model implies that there isn't an "Authorization & Capture" as two separate steps, but rather the actual *money-movement* happens *instantly* as part of the transaction.

**Example Steps:**
1. Order is created.
2. Buyer (`payer`) authorizes the Order.
3. Order is captured. Money moves from buyer (`payer`) to the merchant (`payee`).

## Delayed Disbursement with the "Sale" or "Capture" Model

**Description:** This model implies that the buyer (`payer`) must *release* the funds, but the *Partner* will decide (based on a Platform specific condition) when the funds are *released* to the merchant (`payee`).

**Example Steps:**
1. Order is created.
2. Buyer (`payer`) authorizes the Order.
3. Funds are moved from the buyer (`payer`) to PayPal and "held".
4. Partner disburses the funds from the PayPal "hold" to the merchant (`payee`).

## Authorization & Capture Model

**Description:**

**Example Steps:**
1. Order is created.
2. Buyer (`payer`) authorizes the Order.
3. An Authorization is created (Honor period of 3 days, valid for capture for 29 days).
4. Based on platform logic, the authorization is captured within the 29 days that it's open.
5. After the Capture is completed, the funds are moved from the buyer (`payer`) to the merchant (`payee`).

## Delayed Disbursement with the Authorization & Capture Model

**Description:**

**Example Steps:**
1. Order is created.
2. Buyer (`payer`) authorizes the Order.
3. An Authorization is created (Honor period of 3 days, valid for capture for 29 days).
4. Based on platform logic, the authorization is captured within the 29 days that it's open.
5. Funds are moved from the buyer (`payer`) to PayPal and "held".
6. Partner disburses the funds from the PayPal "hold" to the merchant (`payee`).

## Order -> Authorization -> Capture Model

**Description:**

**Example Steps:**
1. Order is created.
2. Buyer (`payer`) authorizes the Order.
3. Order is `saved`.
4. Based on Platform logic, an Authorization is created (Honor period of 3 days, valid for capture for 29 days).
5. Based on platform logic, the authorization is captured within the 29 days that it's open.
6. Funds are moved from the buyer (`payer`) to the merchant (`payee`).

## Delayed Disbursement with the Order -> Authorization -> Capture Model

**Description:**

**Example Steps:**
1. Order is created.
2. Buyer (`payer`) authorizes the Order.
3. Order is `saved`.
4. Based on Platform logic, an Authorization is created (Honor period of 3 days, valid for capture for 29 days).
5. Based on platform logic, the authorization is captured within the 29 days that it's open.
6. Funds are moved from the buyer (`payer`) to PayPal and "held".
7. Partner disburses the funds from the PayPal "hold" to the merchant (`payee`).

