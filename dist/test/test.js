'use strict';

var _hiPromise = require('../src/hi-promise.js');

var _hiPromise2 = _interopRequireDefault(_hiPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AsyncTest() {
    return new _hiPromise2.default(function (resolve, reject) {
        setTimeout(function () {
            resolve('done');
        }, 1000);
    });
}

AsyncTest().then(function (val) {
    console.log("123");
});