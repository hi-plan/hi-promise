'use strict'
/**
 * Simplified version of JavaScript Promise implementation
 * @author Eric_Wong
 * 2015.11.30
 */

/**
 * Standard Promise A/+ Status
 * @type {{PENDING: number, FULFILLED: number, REJECTED: number}}
 */
;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Status = {
    PENDING: 0,
    FULFILLED: 1,
    REJECTED: 2
};

/**
 * Utils class
 * For helping Promise Class
 */

var Utils = (function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    /**
     * Juege an object is function or not
     * @param _obj
     * @returns {boolean}
     */

    _createClass(Utils, null, [{
        key: 'isFunction',
        value: function isFunction(_obj) {
            return typeof _obj === 'function';
        }

        /**
         * Judge an object is promise thenable or not
         * @param _obj
         * @returns {*|boolean}
         */

    }, {
        key: 'isThenable',
        value: function isThenable(_obj) {
            return _obj && typeof _obj['then'] === 'function';
        }

        /**
         * Convert a sync or async function to
         * perform in asynchronous behaviour
         * work normally on both browser and Node.js Env
         * @param fn
         * @constructor
         */

    }, {
        key: 'AsyncWrapper',
        value: function AsyncWrapper(fn) {
            typeof window === 'undefined' ? process.nextTick.call(this, fn) : window.setTimeout.call(this, fn, 0);
        }
    }]);

    return Utils;
})();

var Promise = (function () {
    /**
     * Constructor of Promsie
     * @param resolver
     * resolver(resolve, reject)
     * resolve, reject are explain inside constructor
     */

    function Promise(resolver) {
        var _this = this;

        _classCallCheck(this, Promise);

        if (!Utils.isFunction(resolver)) throw new Error('Param of Promise Must be a Function');

        // Succeed value
        this._value = undefined;
        // Failed reason
        this._reason = undefined;
        // Default Status
        this._status = Status.PENDING;
        // Resolves Queue
        this._resolvesQueue = [];
        // Rejects Queue
        this._rejectsQueue = [];

        // Pass resolve and reject function
        // to resolver for user to invoke
        var resolve = function resolve(value) {
            _this.convertStatus(Status.FULFILLED, value);
        };
        var reject = function reject(reason) {
            _this.convertStatus(Status.REJECTED, reason);
        };
        resolver(resolve, reject);
    }

    _createClass(Promise, [{
        key: 'then',
        value: function then(onFulfilled, onRejected) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var fulfilledCallback = function fulfilledCallback(value) {
                    var retval = Utils.isFunction(value) && onFulfilled(value) || value;

                    if (Utils.isThenable(retval)) {
                        retval.then(function (value) {
                            resolve(value);
                        }, function (reason) {
                            reject(reason);
                        });
                    } else {
                        resolve(value);
                    }
                };

                var rejectedCallback = function rejectedCallback(reason) {
                    var retval = Utils.isFunction(reason) && onRejected(reason) || reason;

                    reject(retval);
                };

                if (_this2._status === Status.PENDING) {
                    _this2._resolvesQueue.push(fulfilledCallback());
                    _this2._rejectsQueue.push(rejectedCallback());
                } else if (_this2._status === Status.FULFILLED) {
                    fulfilledCallback(_this2._value);
                } else if (_this2._status === Status.REJECTED) {
                    rejectedCallback(_this2._reason);
                }
            });
        }
    }, {
        key: '_resolve',
        value: function _resolve(value) {
            this.convertStatus.call(this, Status.FULFILLED, value);
        }
    }, {
        key: '_reject',
        value: function _reject(reason) {
            this.convertStatus.call(this, Status.REJECTED, reason);
        }
    }, {
        key: 'convertStatus',

        /**
         * Convert promise status
         * @param status
         * @param value
         */
        value: function convertStatus(status, value) {
            var _this3 = this;

            if (this._status !== Status.PENDING) return;

            Utils.AsyncWrapper(function () {
                _this3._status = status;
                _this3.consumeQueue(value);
            });
        }
    }, {
        key: 'consumeQueue',
        value: function consumeQueue(value) {
            var isFulfilledStatus = this._status === Status.FULFILLED;
            var queue = this[isFulfilledStatus ? '_resolvesQueue' : '_rejectsQueue'];

            if (typeof queue === 'undefined') return;

            var func = undefined;
            // Consume queue
            while (func = queue.unshift()) {
                value = func.call(this, value) || value;
            }this[isFulfilledStatus ? '_value' : '_reason'] = value;

            // Task was done, destroy two queues
            this._resolvesQueue = this._rejectsQueue = undefined;
        }
    }], [{
        key: 'resolve',
        value: function resolve(value) {}
    }, {
        key: 'reject',
        value: function reject(reason) {}
    }]);

    return Promise;
})();

exports.default = Promise;