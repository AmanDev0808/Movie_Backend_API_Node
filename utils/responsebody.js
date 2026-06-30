/**
 * This object will be used as as template for building  error response
 */

const errorResponseBody = {
    err: {},
    data: {},
    message: 'Something went wrong, cannot process the request',
    success: false
}


/**
 * This object will be used as as template for building  success response
 */

const successResponseBody = {
    err: {},
    data: {},
    message: 'Successfully processed the request',
    success: true
}

module.exports = {
    successResponseBody,
    errorResponseBody
}