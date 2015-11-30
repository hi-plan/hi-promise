'use strict'
/**
 * Simplified version of JavaScript Promise implementation
 * @author Eric_Wong
 * 2015.11.30
 */
;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = (function () {
	function Promise() {
		//this.name = ""

		_classCallCheck(this, Promise);
	}

	_createClass(Promise, [{
		key: 'then',
		value: function then(resolver) {}
	}]);

	return Promise;
})();

exports.default = Promise;