<a href="https://circleci.com/gh/hi-plan/hi-promise/tree/master"><img src="https://img.shields.io/circleci/project/hi-plan/hi-promise/master.svg" alt="Build Status"></a>
# Hi-Promise
JavaScript Promise implementation, just a re-invented wheel without performance optimization.
Super thanks to [**promises-aplus-tests**](https://github.com/promises-aplus/promises-tests) project for all test cases.

# Usage
Just use it like any other Promise libraries.

```npm install hi-promise --save```

```javascript
var Promise = require('hi-promise');
var p = new Promise(function(resolve, reject) {});
```

# Test
```npm install```

And then,

```npm run test```
