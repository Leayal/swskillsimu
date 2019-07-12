function EventHandler() {
    this.callbacks = [];
}

EventHandler.prototype.Unregister = function (handler) {
    if (typeof (handler) !== "function") return;
    let index = this.callbacks.indexOf(handler);
    if (index === -1) return;
    this.callbacks.splice(index, 1);
}

EventHandler.prototype.Register = function (handler) {
    if (typeof (handler) !== "function") return;
    let index = this.callbacks.indexOf(handler);
    if (index !== -1) return;
    this.callbacks.push(handler);
}

EventHandler.prototype.Trigger = function (eventArg) {
    if (this.callbacks.length !== 0) {
        this.callbacks.forEach(function (currentValue, index, arr) {
            currentValue(eventArg);
        });
    }
}
