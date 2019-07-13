function EventHandler(_root) {
    Object.defineProperties(this, {
        Callbacks: {
            value: [],
            enumerable: false,
            writable: false,
            configurable: false
        },
        SourceTarget: {
            value: _root,
            enumerable: false,
            writable: false,
            configurable: false
        }
    });
}

EventHandler.prototype.Unregister = function (handler) {
    if (typeof (handler) !== "function") return;
    let index = this.Callbacks.indexOf(handler);
    if (index === -1) return;
    this.Callbacks.splice(index, 1);
}

EventHandler.prototype.Register = function (handler) {
    if (typeof (handler) !== "function") return;
    if (!(handler in this.Callbacks)) {
        this.Callbacks.push(handler);
    }
}

EventHandler.prototype.Trigger = function (eventArg) {
    if (this.Callbacks.length !== 0) {
        let src = this.SourceTarget;
        this.Callbacks.forEach(function (currentValue) {
            currentValue.call(src, eventArg);
        });
    }
}