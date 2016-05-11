module.exports = Promise;

var PENDING = 0,
    RESOLVED = 1,
    REJECTED = 2;

function Promise(executor) {
    // Save this context
    var self = this;

    // Initialized to pending status
    self.status = PENDING;
    // Current data of node in Promise Chain
    self.data = null;
    // Calling Queue
    // We could call then() multiple times.
    // ----------------------
    // var p = new Promise();
    // p.then();
    // p.then();
    // ----------------------
    // Queue call func to callback queue.
    self.onResolvedCallback = [];
    self.onRejectedCallback = [];


    /*

     Note: func `resolve()` and `reject()`
     was defined inner Promise context
     in order to ensure `this` reference
     correct, otherwise we have to `bind()`
     this references.

     Note: resolve() and reject() will be
     called by user through callback.

                  executor resolve  reject
                    |        |        |
                    v        v        v
     new Promise(function(resolve, reject) {})

    */

    function resolve(value) {
        "use strict";
        if (value instanceof Promise)
            return value.then(resolve, reject);

        // Make all asynchronous
        setTimeout(function() {
            // TODO: could this condition be outside of timer???
            if (self.status === PENDING) {
                self.status = RESOLVED;
                self.data = value;

                for (var i = 0; i < self.onResolvedCallback.length; i++)
                    self.onResolvedCallback[i](value);
            }
        }, 0);

    }

    function reject(reason) {
        "use strict";
        setTimeout(function() {
            if (self.status === PENDING) {
                self.status = REJECTED;
                self.data = reason;
                for (var i = 0; i < self.onRejectedCallback.length; i++)
                    self.onRejectedCallback[i](reason);
            }
        }, 0);
    }

    try {
        // Start Point
        executor(resolve, reject);
    } catch (reason) {
        reject(reason);
    }
}

function resolvePromise(promise2, x, resolve, reject) {

}

/*
                 onResolved()                     onRejected()
                      |                                 |
                      |                                 |
    Promise.then(     v                                 v
                    function(resolve, reject) {},   function(err) {}
            );
 */
Promise.prototype.then = function(onResolved, onRejected) {
    var self = this;
    var promise2 = null;

    onResolved = typeof onRejected === 'function'
                    ? onResolved
                    : function(value) {
                        return value;
                    };
    
    onRejected = typeof onRejected === 'function'
                    ? onRejected
                    : function(reason) {
                        throw reason
                    }

    // Whatever what kinds of return value is,
    // Once then() invoked, we return another Promise object,
    // So, we could call then() as a chain.
    if (self.status === RESOLVED) {
        return promise2 = new Promise(function(resolve, reject) {
            "use strict";
            try {
                // Here, we evaluate last Node,
                // get the result of evaluation,
                // if return value is also a Promise,
                // then, we continue to call it's then
                // util it's resolved.
                /*
                 EXAMPLE:

                 var p = new Promise(function(res, rej) {  setTimeout(()=>{ res(1) }, 1000);  });
                 p.then((v) => {
                     return new Promise((res, rej) => {
                        setTimeout(() => { res(v) }, 1000);
                     })
                 }).then((v) => {
                    console.log("end point:", v)
                 });
                 */
                var x = onResolved(self.data);    // self.data is last node's return value.
                resolvePromise(promise2, x, resolve, reject)

                // digest Queue
                resolve(x);
            } catch (e) {
                reject(e);
            }
        });
    }

    if (self.status === REJECTED) {
        return promise2 = new Promise(function(resolve, reject) {
            "use strict";
            try {
                var x = onRejected(self.data);
                resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
                reject(e);
            }
        })
    }

    if (self.status === PENDING) {
        return promise2 = new Promise(function(resolve, reject) {
            "use strict";
            self.onResolvedCallback(function(value) {
                try {
                    var x = onResolved(self.data);
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e);
                }
            });

            self.onRejectedCallback(function(reason) {
                try {
                    var x = onRejected(self.data);
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e);
                }
            })
        });
    }
};

Promise.prototype.catch = function(onRejected) {
    // return a promise object.
    return this.then(null, onRejected);
};

Promise.deferred = Promise.defer = function() {
    var dfd = {};
    dfd.promise = new Promise(function(resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};