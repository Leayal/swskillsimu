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
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
    });
}

function copyLink(_url) {
    var asdDiv = $("<div>").addClass("hiddendiv");
    var asdButton = $("<button>").addClass("btncopymagicclass").attr("data-clipboard-text", encodeURI(_url));
    asdDiv.append(asdButton);
    $("body").append(asdDiv);
    asdButton.trigger("click");
    asdDiv.remove();
    shownotify("The link to this skill tree has been copied to clipboard.", 'success');
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
    try {
        new Clipboard(".btncopymagicclass");
    } catch (error) {

    }
});