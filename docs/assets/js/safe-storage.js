(function (w) {
    'use strict'

    function StorageWrapper() {
        /*
        It must be a very very old (or even ancient) browser that doesn't support local storage.
        But better safe than sorry.
        */

        if (typeof (Storage) !== "undefined" && w.hasOwnProperty("localStorage") && (w.localStorage instanceof Storage)) {
            this._localStorage = w.localStorage;
            this._storageFromCookies = null;
        } else {
            this._localStorage = null;
            // Requires js-cookie (https://github.com/js-cookie/js-cookie)
            this._storageFromCookies = Cookies.noConflict();
        }
    }

    StorageWrapper.prototype.SetData = function (key, value) {
        if (this._localStorage) {
            this._localStorage.setItem(key, value);
            return true;
        } else if (this._storageFromCookies) {
            this._storageFromCookies.set(key, value, {
                expires: 365,
                path: ""
            });
            return true;
        }
        return false;
    }

    StorageWrapper.prototype.GetData = function (key) {
        if (this._localStorage) {
            return this._localStorage.getItem(key);
        } else if (this._storageFromCookies) {
            return this._storageFromCookies.get(key, {
                path: ""
            });
        } else {
            return defaultValue;
        }
    }

    StorageWrapper.prototype.DeleteData = function (key) {
        if (this._localStorage) {
            this._localStorage.removeItem(key);
            return true;
        } else if (this._storageFromCookies) {
            return Cookies.remove(key, {
                path: ""
            });
        } else {
            return false;
        }
    }

    StorageWrapper.prototype.DeleteAllDatas = function () {
        if (this._localStorage) {
            this._localStorage.clear();
            return true;
        } else if (this._storageFromCookies) {
            // Do nothing
            return false;

            // Unless you really want to do it
            let values = this._storageFromCookies.get();
            for (let key in values) {
                if (values.hasOwnProperty(key)) {
                    this._storageFromCookies.remove(key);
                }
            }
            return true;
        } else {
            return false;
        }
    }

    Object.defineProperty(w, "SafeStorage", {
        value: new StorageWrapper(),
        configurable: false,
        writable: false
    });
})(window);