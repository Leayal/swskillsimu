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

function copyLink(_url) {
    var asdDiv = $("<div>").addClass("hiddendiv");
    var asdButton = $("<button>").addClass("btncopymagicclass").attr("data-clipboard-text", encodeURI(_url));
    asdDiv.append(asdButton);
    $("body").append(asdDiv);
    //new Clipboard(".btncopymagicclass");
    asdButton.trigger("click");
    asdDiv.remove();
    $.notify({ message: 'The link to this skill tree has been copied to clipboard.' }, { type: 'success' });
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