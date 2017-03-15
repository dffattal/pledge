'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

var $Promise = function(executor) {
  this._state = 'pending'
  this._value = undefined
  if (typeof executor === 'function') {
    executor(this._internalResolve.bind(this), this._internalReject.bind(this))
  }
}

$Promise.prototype._internalResolve = function(data) {
    if (this._state === 'pending') {
      this._state = 'fulfilled'
      this._value = data
    }
  }
$Promise.prototype._internalReject = function(err) {
    if (this._state === 'pending') {
      this._state = 'rejected'
      this._value = err
    }
  }




/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
