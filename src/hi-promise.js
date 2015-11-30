'use strict';
/**
 * Simplified version of JavaScript Promise implementation
 * @author Eric_Wong
 * 2015.11.30
 */

/**
 * Standard Promise A/+ Status
 * @type {{PENDING: number, FULFILLED: number, REJECTED: number}}
 */
const Status = {
    PENDING:   0,
    FULFILLED: 1,
    REJECTED:  2
};

/**
 * Utils class
 * For helping Promise Class
 */
class Utils {
    constructor() {}

    /**
     * Juege an object is function or not
     * @param _obj
     * @returns {boolean}
     */
    static isFunction( _obj ) {
        return typeof _obj === 'function';
    }

    /**
     * Judge an object is promise thenable or not
     * @param _obj
     * @returns {*|boolean}
     */
    static isThenable( _obj ) {
        return _obj &&
                typeof _obj['then'] === 'function';
    }

    /**
     * Convert a sync or async function to
     * perform in asynchronous behaviour
     * work normally on both browser and Node.js Env
     * @param fn
     * @constructor
     */
    static AsyncWrapper( fn ) {
        typeof window === 'undefined'
            ? process.nextTick.call(this, fn)
            : window.setTimeout.call(this, fn, 0);
    }
}

export default class Promise {
    /**
     * Constructor of Promsie
     * @param resolver
     * resolver(resolve, reject)
     * resolve, reject are explain inside constructor
     */
	constructor( resolver ) {
        if( !Utils.isFunction(resolver) )
            throw new Error('Param of Promise Must be a Function');

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
        const resolve = (value) => {
            this.convertStatus(Status.FULFILLED, value);
        };
        const reject = (reason) => {
            this.convertStatus(Status.REJECTED, reason);
        };
        resolver(resolve, reject)

	}

	then( onFulfilled, onRejected ) {
        return new Promise((resolve, reject) => {
            const fulfilledCallback = ( value ) => {
                let retval = Utils.isFunction(value) && onFulfilled(value)
                                || value;

                if( Utils.isThenable(retval) ) {
                    retval.then(
                        (value) => {
                            resolve(value);
                        },
                        (reason) => {
                            reject(reason);
                        }
                    )
                } else {
                    resolve(value);
                }
            };

            const rejectedCallback = (reason) => {
                let retval = Utils.isFunction(reason) && onRejected(reason)
                                || reason;

                reject(retval);
            };

            if ( this._status === Status.PENDING ) {
                this._resolvesQueue.push(fulfilledCallback());
                this._rejectsQueue.push(rejectedCallback());
            } else if ( this._status === Status.FULFILLED ) {
                fulfilledCallback(this._value);
            } else if ( this._status === Status.REJECTED ) {
                rejectedCallback(this._reason);
            }

        });
	}

    _resolve( value ) {
        this.convertStatus.call(this, Status.FULFILLED, value)
    }

    _reject( reason ) {
        this.convertStatus.call(this, Status.REJECTED, reason)
    }

    static resolve( value ) {

    }

    static reject( reason ) {

    }

    /**
     * Convert promise status
     * @param status
     * @param value
     */
    convertStatus( status, value ) {
        if( this._status !== Status.PENDING )
            return;

        Utils.AsyncWrapper(() => {
            this._status = status;
            this.consumeQueue( value );
        });
    }

    consumeQueue( value ) {
        const isFulfilledStatus = this._status === Status.FULFILLED;
        let queue = this[ isFulfilledStatus?
            '_resolvesQueue':
            '_rejectsQueue'];

        let func;
        // Consume queue
        while( func = queue.unshift() )
            value = func.call(this, value) || value;

        this[isFulfilledStatus ? '_value' : '_reason'] = value;

        // Task was done, destroy two queues
        this._resolvesQueue = this._rejectsQueue = undefined;

    }

}
