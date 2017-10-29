var clipboardsupport;

function readurlparam(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
};

function GetUrlParam(name, defaultvalue) {
    var re = readurlparam(name);
    if (re)
        return re;
    else
        return defaultvalue;
};

function shownotify(msg, _type) {
    $.notify({ message: msg }, {
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

function copyLink(_url) {
    if (window.clipboardsupport) {
        var asdDiv = $("<div>").addClass("hiddendiv");
        var asdButton = $("<button>").addClass("btncopymagicclass").attr("data-clipboard-text", encodeURI(_url));
        asdDiv.append(asdButton);
        $("body").append(asdDiv);
        asdButton.trigger("click");
        asdDiv.remove();
        return true;
    } else {
        var divthingie = $("<div>");
        divthingie.append($("<p>").text("Clipboard access failed. Please copy the link below:"));
        divthingie.append($("<input>").attr("type", "text").css({ width: "100%" }).prop("readonly", true).val(_url).click(function() { $(this).select(); }));
        window.ShowMessageDialog(divthingie);
        return false;
    }
}

function SetLoading(target) {
    var found = target.find($("div[metroloading]"));
    if (found && found.length > 0) return;
    //target.append($("<div metroloading class=\"midcenter\"><div class=\"windows8-loading\"><b></b><b></b><b></b><b></b><b></b></div></div>"));
    var aaasdwaf = $("<div>").addClass("stretch").addClass("windows8-loading");
    aaasdwaf.append($("<b>"));
    aaasdwaf.append($("<b>"));
    aaasdwaf.append($("<b>"));
    aaasdwaf.append($("<b>"));
    aaasdwaf.append($("<b>"));
    var ddd = $("<div metroloading>").addClass("midcenter").append(aaasdwaf);
    ($("<div metroloading>")
        .addClass("fixedDiv")
        .addClass("stretch")
        .addClass("disabled")
        .addClass("opacity50")).prependTo(target);
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

String.prototype.ctrim = function(charlist) {
    if (charlist === undefined)
        charlist = "\s";
    return this.replace(new RegExp("^[" + charlist + "]+"), "").replace(new RegExp("[" + charlist + "]+$"), "");
};

function GetCurrentFolderUrl() {
    var sas = location.pathname.split("/");
    if (!sas[sas.length - 1])
        sas.pop();
    else if (sas[sas.length - 1].indexOf(".") != -1)
        sas.pop();
    return sas[sas.length - 1];
}

function removefilename(str) {
    function RemoveLastDirectoryPartOf(the_url) {
        var the_arr = the_url.split('/');
        the_arr.pop();
        return (the_arr.join('/'));
    }
}

$(function() {
    if (Clipboard.isSupported()) {
        try {
            var clipboard = new Clipboard(".btncopymagicclass");
            window.clipboardsupport = true;
            clipboard.on('success', function(e) {
                window.shownotify("The link to this skill tree has been copied to clipboard.", 'success');
            });
            clipboard.on('error', function(e) {
                var divthingie = $("<div>");
                divthingie.append($("<p>").text("Clipboard access failed. Please copy the link below:"));
                divthingie.append($("<input>").attr("type", "text").css({ width: "100%" }).prop("readonly", true).val(e.text).click(function() { $(this).select(); }));
                window.ShowMessageDialog(divthingie);
            });
        } catch (error) {
            window.clipboardsupport = false;
        }
    } else {
        window.clipboardsupport = false;
    }
});