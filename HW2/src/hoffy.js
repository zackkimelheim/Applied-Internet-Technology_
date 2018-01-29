// hoffy.js
// Zachary Kimelheim zk377 

const rev = {

  sum: function(...numbers) {
    if (numbers.length === 0) {
      return 0;
    }
    const ans = numbers.reduce(function(sum, curNum) {
      return sum + curNum;
    }, 0);
    return ans;
  },
  repeatCall: function(fn, n, arg) {
    if (n > 0) {
      fn(arg);
      return rev.repeatCall(fn, n - 1, arg);
    }
    return undefined;
  },

  repeatCallAllArgs: function(fn, n, ...argsn) {
    if (n > 0) {
      fn(...argsn);
      return rev.repeatCallAllArgs(fn, n - 1, ...argsn);
    }
    return undefined;
  },

  maybe: function(fn) {
    return function() {
      const array = [...arguments];
      if (array.indexOf(undefined) > -1 || array.indexOf(null) > -1) {
        return undefined;
      } else {
        return fn(...array);
      }
    };
  },

  constrainDecorator: function(fn, min, max) {
    return function() {
      if (fn.apply(this, arguments) < min) {
        return min;
      } else if (fn.apply(this, arguments) > max) {
        return max;
      } else {
        return fn.apply(this, arguments);
      }
    };
  },

  limitCallsDecorator: function(fn, n) {
    let count = 0;
    return function() {
      if (count < n) {
        count++;
        return fn.apply(this, arguments);
      } else {
        return undefined;
      }
    };
  },

  filterWith: function(fn) {
    return function(arr) {
      return arr.filter(fn);
    };
  },

  //using map here
  simpleINIParse: function(s) {
    const obj = {};
    const arr = s.split("\n");
    arr.map(function(x) {
      if (x.split("=") !== x) {
        const elementsArr = x.split("=");
        if (elementsArr[0] !== undefined && elementsArr[1] !== undefined) {
          const name = elementsArr[0];
          const type = elementsArr[1];
          obj[name] = type;
        }
      }
    });
    return obj;
  },

  readFileWith: function(fn) {
    const fs = require('fs');
    return function(filename, callback) {
      fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
          callback(err, undefined);
        } else {
          callback(err, fn(data));
        }
      });
    };
  }

};

module.exports = rev;
