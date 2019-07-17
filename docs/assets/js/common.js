(function (self) {
    'use strict';

    var myregex = {},
        stringFormatRegex = /{(\d+)}/g;

    function getRegex(name) {
        'use strict';
        if (!myregex.hasOwnProperty(name)) {
            myregex[name] = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)');
        }
        return myregex[name];
    }

    Object.defineProperty(self, "GetUrlParam", {
        value: function (name, defaultvalue) {
            'use strict';
            if (typeof (URLSearchParams) !== "undefined") {
                let urlSearch;
                if (arguments.length === 3) {
                    if (!arguments[0]) {
                        throw new URIError("URL or search param cannot be empty");
                    }
                    urlSearch = ((arguments[0] instanceof URL) ? arguments[0].searchParams : ((arguments[0] instanceof URLSearchParams) ? arguments[0] : ((typeof (arguments[0]) === "string") ? new URLSearchParams(arguments[0]) : new URLSearchParams())));
                } else {
                    urlSearch = new URLSearchParams(window.location.search);
                }
                return (urlSearch.get(name) || defaultvalue);
            }
            let source;
            if (arguments.length === 3) {
                source = arguments[0];
            } else {
                source = window.location.search;
            }
            return decodeURIComponent((getRegex(name).exec(source) || [null, ''])[1].replace(/\+/g, '%20')) || defaultvalue;
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    Object.defineProperty(self, "PageReload", {
        value: function () {
            'use strict';
            if (typeof (window.location.reload) === "function") {
                window.location.reload();
            } else {
                let sumthing = window.location;
                window.location = sumthing;
            }
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    String.prototype.fformat = function () {
        let args = arguments;
        return this.replace(stringFormatRegex, function (match, number) {
            return ((typeof (args[number]) !== "undefined") ? args[number] : match);
        });
    };

    String.prototype.ctrim = function (charlist) {
        if (typeof (charlist) !== "string" || charlist === "")
            charlist = "\s\t\n\r";
        return this.replace(new RegExp("^[" + charlist + "]+"), "").replace(new RegExp("[" + charlist + "]+$"), "");
    };

    Object.defineProperty(self, "GetCurrentFolderUrl", {
        value: function () {
            var sas = location.pathname.split("/");
            if (!sas[sas.length - 1])
                sas.pop();
            else if (sas[sas.length - 1].indexOf(".") !== -1)
                sas.pop();
            return sas[sas.length - 1];
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    // Public domain code. From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
    Object.defineProperty(self, "deepFreeze", {
        value: function thisfunction(object) {
            // Retrieve the property names defined on object
            var propNames = Object.getOwnPropertyNames(object);
            // Freeze properties before freezing self
            for (let name of propNames) {
                let value = object[name];
                if (value && typeof value === "object") {
                    object[name] = thisfunction(value);
                }
            }
            return Object.freeze(object);
        },
        writable: false,
        configurable: false,
        enumerable: false
    });
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));

function shownotify(msg, _type) {
    $.notify({
        message: msg
    }, {
        type: _type,
        placement: {
            from: "bottom",
            align: "right"
        },
        animate: {
            enter: 'animated fadeInRight',
            exit: 'animated fadeOutDown'
        },
    });
}

function SetLoading(target) {
    var found = target.find($("div[metroloading]"));
    if (found && found.length > 0) return;
    //target.append($("<div metroloading class=\"midcenter\"><div class=\"windows8-loading\"><b></b><b></b><b></b><b></b><b></b></div></div>"));
    var ddd = $("<div metroloading>").addClass("midcenter").append($("<div>").addClass("stretch").addClass("windows8-loading").append($("<b>"), [
        $("<b>"), $("<b>"), $("<b>"), $("<b>")
    ]));
    $("<div metroloading>").addClass("fixedDiv stretch disabled opacity50").prependTo(target);
    target.append(ddd);
};

function GetSvgUnavailable() {
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.0\" x=\"0px\" y=\"0px\" viewBox=\"0 0 40 40\" class=\"icon icons8-Unavailable\">" +
        "<g id=\"surface1\">" +
        "<path style=\"fill:#DFF0FE;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke:#4788C7;stroke-opacity:1;stroke-miterlimit:10;\" d=\"M 20 1 C 9.507813 1 1 9.507813 1 20 C 1 30.492188 9.507813 39 20 39 C 30.492188 39 39 30.492188 39 20 C 39 9.507813 30.492188 1 20 1 Z M 6 20 C 6 12.269531 12.269531 6 20 6 C 22.964844 6 25.707031 6.925781 27.96875 8.496094 L 8.496094 27.96875 C 6.925781 25.707031 6 22.964844 6 20 Z M 20 34 C 17.035156 34 14.292969 33.074219 12.03125 31.503906 L 31.503906 12.03125 C 33.074219 14.292969 34 17.035156 34 20 C 34 27.730469 27.730469 34 20 34 Z\">" +
        "</path></g></svg>";
}

function RemoveLoading(target) {
    target.children("div[metroloading]").remove();
};