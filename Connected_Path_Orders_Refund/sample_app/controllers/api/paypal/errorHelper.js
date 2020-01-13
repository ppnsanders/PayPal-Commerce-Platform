'use strict';

module.exports = (respObj, callback) => {
    const httpStatus = respObj.statusCode;
    if(httpStatus === 0 || httpStatus === undefined) {
        callback(false);
    } else {
        evaluateResponse(httpStatus, respObj, (responseObject) => {
            callback(responseObject);
        });
    }
};

function evaluateResponse(status, respObj, callback) {
    let responseObject = {};
        responseObject.issues = [];
        responseObject.retry = false;
    switch(status) {
        case 200:
         //HTTP 200 - OK
         responseObject.httpStatus = 200;
         responseObject.statusMessage = "OK";
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        case 201:
         //HTTP 201 - Created
         responseObject.httpStatus = 201;
         responseObject.statusMessage = "CREATED";
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        case 204:
         //HTTP 204 - No Content
         responseObject.httpStatus = 204;
         responseObject.statusMessage = "NO CONTENT";
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        case 400:
         //HTTP 400 - Bad Request
         responseObject.httpStatus = 400;
         responseObject.statusMessage = "BAD_REQUEST";
            if(respObj.body.details) {
                respObj.body.details.forEach((err) => {
                    if(err.issue === "ORDER_NOT_APPROVED") {
                        let tmpIssueObject = {};
                        tmpIssueObject.issue = err.issue;
                        tmpIssueObject.description = err.description;
                        tmpIssueObject.solution = "The Consumer must go to PayPal and Approve the Order.";
                        responseObject.issues.push(tmpIssueObject);
                    } else {
                        let tmpIssueObject = {};
                        tmpIssueObject.issue = err.issue;
                        tmpIssueObject.description = err.description;
                        responseObject.issues.push(tmpIssueObject);
                    }
                });
            } else {
                if(respObj.body.error) {
                    let tmpErrorObj = {};
                    tmpErrorObj.error = respObj.body.error;
                    tmpErrorObj.error_description = respObj.body.error_description;
                } else {
                    //do nothing for now..
                }
            }
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        case 401:
            //HTTP 401 - Unauthorized
            //api file should run auth.refreshToken to retry..
            break;
        case 403: 
         //HTTP 403 - Forbidden
         responseObject.httpStatus = 403;
         responseObject.statusMessage = "NOT_AUTHORIZED";
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        case 404:
         //HTTP 404 - Not Found
         responseObject.httpStatus = 404;
         responseObject.statusMessage = "RESOURCE_NOT_FOUND";
         if(respObj.body) {
            if(respObj.body.details) {
                respObj.body.details.forEach((err) => {
                    if(err.issue === "INVALID_RESOURCE_ID") {
                        let tmpIssueObject = {};
                        tmpIssueObject.issue = err.issue;
                        tmpIssueObject.description = err.description;
                        tmpIssueObject.solution = "The Order ID you've provided is incorrect - PayPal Debug ID: " + respObj.body.debug_id;
                        responseObject.issues.push(tmpIssueObject);
                    } else {
                        let tmpIssueObject = {};
                        tmpIssueObject.issue = err.issue;
                        tmpIssueObject.description = err.description;
                        responseObject.issues.push(tmpIssueObject);
                    }
                });
            } else if(respObj.body.name) {
                //this happens with partner-referral API when an invalid referral id is provided:
                if(respObj.body.name === "RESOURCE_NOT_FOUND_ERROR") {
                    let tmpIssueObject = {};
                    tmpIssueObject.issue = respObj.body.name;
                    tmpIssueObject.description = respObj.body.message;
                    tmpIssueObject.solution = "Provide a Valid ID - PayPal Debug ID: " + respObj.body.debug_id;
                    responseObject.issues.push(tmpIssueObject);
                } else if(respObj.body.name === "USER_BUSINESS_ERROR") {
                    let tmpIssueObject = {};
                    tmpIssueObject.issue = respObj.body.name;
                    tmpIssueObject.description = respObj.body.message;
                    tmpIssueObject.solution = "Check the Merchant_ID in the URL of the Request - PayPal Debug ID: " + respObj.body.debug_id;
                    responseObject.issues.push(tmpIssueObject);
                } else {
                    let tmpIssueObject = {};
                    tmpIssueObject.issue = err.issue;
                    tmpIssueObject.description = err.description;
                    responseObject.issues.push(tmpIssueObject);
                }
            } else {
                if(respObj.body.error !== undefeined) {
                    let tmpErrorObj = {};
                    tmpErrorObj.error = respObj.body.error;
                    tmpErrorObj.error_description = respObj.body.error_description;
                } else {
                    //do nothing for now..
                }
            }
        } else {
            //do nothing for now..
        }
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        case 405:
         //HTTP 405 - Method Not Allowed
         responseObject.httpStatus = 405;
         responseObject.statusMessage = "METHOD_NOT_SUPPORTED";
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        case 406:
         //HTTP 406 - Not Acceptable
         responseObject.httpStatus = 406;
         responseObject.statusMessage = "MEDIA_TYPE_NOT_ACCEPTABLE";
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        case 415:
         //HTTP 415 - Unsupported Media Type
         responseObject.httpStatus = 415;
         responseObject.statusMessage = "UNSUPPORTED_MEDIA_TYPE";
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        case 422:
         //HTTP 422 - Unprocessable Entity
         responseObject.httpStatus = 422;
         responseObject.statusMessage = "UNPROCCESSABLE_ENTITY";
         if(respObj.body.details) {
            respObj.body.details.forEach((err) => {
                if(err.issue === "ORDER_NOT_APPROVED") {
                    let tmpIssueObject = {};
                    tmpIssueObject.issue = err.issue;
                    tmpIssueObject.description = err.description;
                    tmpIssueObject.solution = "The Consumer must go to PayPal and Approve the Order.";
                    responseObject.issues.push(tmpIssueObject);
                } else if(err.issue === "CANNOT_MODIFY_INTENT") {
                    let tmpIssueObject = {};
                    tmpIssueObject.issue = err.issue;
                    tmpIssueObject.description = err.description;
                    tmpIssueObject.solution = "Create a new order with a different intent.";
                    responseObject.issues.push(tmpIssueObject);
                } else {
                    let tmpIssueObject = {};
                    tmpIssueObject.issue = err.issue;
                    tmpIssueObject.description = err.description;
                    responseObject.issues.push(tmpIssueObject);
                }
            });
            callback(responseObject);
            break;
        } else {
            if(respObj.body.error) {
                let tmpErrorObj = {};
                tmpErrorObj.error = respObj.body.error;
                tmpErrorObj.error_description = respObj.body.error_description;
            } else {
                //do nothing for now..
            }
        }   
        case 429:
         //HTTP 429 - Unprocessable Entity
         responseObject.httpStatus = 429;
         if(respObj.statusCode === 422) {
             responseObject.statusMessage = respObj.body.name;
             if(responseObject.statusMessage === "TRANSACTION_NOT_VALID") {
                //if this happens, you may not be setting a purchase_unit.payee, or you may be setting it to the same value as the purchase_unit.platform_fees.payee.
                //or.. you may not have granted proper permissions with your merchant.  Make sure you granted the DELAY_FUNDS_DISBURSEMENT scope.
                let tmpIssueObject = {};
                tmpIssueObject.issue = "TRANSACTION_NOT_VALID";
                tmpIssueObject.description = "The Transaction ID provided is invalid for this operation.";
                tmpIssueObject.solution = "This transaction cannot be disbursed. You may have the same Payee for the Order purchase_unit as the Fee Receiver. OR the merchant must grant DELAY_FUNDS_DISBURSEMENT permissions.";
                responseObject.issues.push(tmpIssueObject);
             } else {
                responseObject.statusMessage = "RATE_LIMIT_REACHED";
             }
         } else {
             //do nothing for now..
         }
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        case 500:
         //HTTP 500 - Internal Server Error
         responseObject.httpStatus = 500;
         responseObject.statusMessage = "INTERNAL_SERVER_ERROR";
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        case 503:
         //HTTP 503 - Service Unavailable
         responseObject.httpStatus = 500;
         responseObject.statusMessage = "SERVICE_UNAVAILABLE";
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
        default:
         responseObject.httpStatus = 0;
         responseObject.statusMessage = "DEFAULT";
         responseObject.fullResponse = respObj;
            callback(responseObject);
            break;
    }
}
