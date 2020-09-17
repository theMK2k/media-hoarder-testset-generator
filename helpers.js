const util = require("util");
const path = require("path");
const fs = require("fs");
const requestretry = require("requestretry");

const logger = require("loglevel");

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const existsAsync = util.promisify(fs.exists);
const requestretryAsync = util.promisify(requestretry);

function requestRetryStrategy(err, response, body, options) {
    const mustRetry = !!err;

    if (mustRetry) {
        logger.log('request retry - options:', options);
    }

    return {
        mustRetry,
        options: options,
    };
}

async function requestAsync(options) {
    // throw new Error('KILLME - Offline Test');

    let optionsDerived = {};

    if (typeof options === "string") {
        optionsDerived.url = options;
    } else {
        optionsDerived = Object.assign({}, options);
    }

    if (!optionsDerived.method) {
        optionsDerived.method = "GET";
    }

    if (!optionsDerived.retryStrategy) {
        optionsDerived.retryStrategy = requestRetryStrategy;
    }

    if (!optionsDerived.maxAttempts) {
        optionsDerived.maxAttempts = 3;
    }

    if (!optionsDerived.retryDelay) {
        optionsDerived.retryDelay = 1000;
    }

    // logger.log('request options:', optionsDerived);

    return requestretryAsync(optionsDerived);
}

function ensureDirectorySync(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}



module.exports = {
    writeFileAsync,
    readFileAsync,
    existsAsync,
    requestAsync,
    ensureDirectorySync
};
