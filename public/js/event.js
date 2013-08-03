(function() {
  define(function() {
    var Event;
    Event = (function() {
      function Event() {}

      Event.ONCE = true;

      Event.prototype.on = function(ev, fn, once) {
        var _base;
        if (!((ev != null) && (fn != null))) {
          return;
        }
        if (this._events == null) {
          this._events = {};
        }
        if ((_base = this._events)[ev] == null) {
          _base[ev] = {
            all: [],
            once: []
          };
        }
        if (once === Event.ONCE) {
          this._events[ev].once.push(fn);
        } else {
          this._events[ev].all.push(fn);
        }
        return this;
      };

      Event.prototype.off = function(ev, fn) {
        var allArr, index, onceArr, _ref;
        if (!((ev != null) && (fn != null) && (((_ref = this._events) != null ? _ref[ev] : void 0) != null))) {
          return;
        }
        allArr = this._events[ev].all;
        onceArr = this._events[ev].once;
        if ((index = onceArr != null ? onceArr.indexOf(fn) : void 0) > -1) {
          onceArr.splice(index, 1);
        }
        if ((index = allArr != null ? allArr.indexOf(fn) : void 0) > -1) {
          allArr.splice(index, 1);
        }
        return this;
      };

      Event.prototype.trigger = function(ev) {
        var args, fn, _i, _j, _len, _len1, _ref, _ref1, _ref2;
        if (!((ev != null) && (this._events != null) && (((_ref = this._events) != null ? _ref[ev] : void 0) != null))) {
          return;
        }
        args = Array.prototype.slice.call(arguments, 1);
        _ref1 = this._events[ev].all;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          fn = _ref1[_i];
          fn.apply(this, args);
        }
        _ref2 = this._events[ev].once;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          fn = _ref2[_j];
          fn.apply(this, args);
        }
        this._events[ev].once = [];
        return this;
      };

      return Event;

    })();
    return Event;
  });

}).call(this);

/*
//@ sourceMappingURL=event.js.map
*/