'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

var $Promise = function(executor) {
  this._state = 'pending'
  this._value = undefined
  this._handlerGroups = []
  if (typeof executor === 'function') {
    executor(this._internalResolve.bind(this), this._internalReject.bind(this))
  }
}

$Promise.prototype._internalResolve = function(data) {
  if (this._state === 'pending') {
    this._state = 'fulfilled'
    this._value = data
    this._callHandlers(this._value)
  }
}

$Promise.prototype._internalReject = function(err) {
  if (this._state === 'pending') {
    this._state = 'rejected'
    this._value = err
    this._callHandlers(this._value)
  }
}

$Promise.prototype.then = function(successHandler, errorHandler) {
  if(this._state === 'pending') {
    if (typeof successHandler !== 'function') {
      successHandler = null
    }
    if (typeof errorHandler !== 'function') {
      errorHandler = null
    }
    // console.log(this._value)
    var newPromise = new $Promise

    // if (successHandler === null) {
    //   //console.log(this._value)
    //   newPromise._internalResolve(this._value)
    // }

    this._handlerGroups.push({successCb: successHandler, errorCb: errorHandler, downstreamPromise: newPromise})

    if (successHandler !== null || successHandler === null && errorHandler === null) {
      return this._handlerGroups[this._handlerGroups.length - 1].downstreamPromise
    }
  } else if (this._state === 'fulfilled') {
    successHandler(this._value)
    // this._handlerGroups.downstreamPromise._internalResolve = this._value;
  } else if (errorHandler) {
    errorHandler(this._value)
  }
}

$Promise.prototype._callHandlers = function(value) {
  // console.log(this)
  if (this._state === 'fulfilled') {
    this._handlerGroups.forEach(function(cbObj) {
      if (cbObj.successCb !== null) {
        var successVal = cbObj.successCb(value)
        if (cbObj.downstreamPromise) {
          cbObj.downstreamPromise._internalResolve(successVal)
        }
      } else if (cbObj.downstreamPromise) {
        cbObj.downstreamPromise._internalResolve(value)
      }
    })
  } else {
    this._handlerGroups.forEach(function(cbObj) {
      if (cbObj.errorCb !== null) {
        var errorVal = cbObj.errorCb(value)
        if (cbObj.downstreamPromise) {
          cbObj.downstreamPromise._internalResolve(errorVal)
        }
      } else if (cbObj.downstreamPromise) {
        cbObj.downstreamPromise._internalReject(value)
      }
    })
  }
  this._handlerGroups = []
}

$Promise.prototype.catch = function(errorHandler) {
  debugger
  this.then(null, errorHandler)
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
