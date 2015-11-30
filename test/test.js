'use strict';
import Promise from '../src/hi-promise.js';

function AsyncTest() {
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                resolve('done');
            },
            1000
        )
    });
}

AsyncTest()
    .then(( val ) => {
            console.log("123")
        });