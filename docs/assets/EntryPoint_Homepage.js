(function (w, d) {
    'use strict'
    let theElement = d.getElementById("isPromiseSupportedLabel");
    let text;
    if (typeof (Promise) !== "undefined") {
        text = d.createTextNode("The web browser you're using supports Promise object.");
        theElement.classList.add("text-feature-supported");
    } else {
        text = d.createTextNode("The web browser you're using doesn't support Promise object. Please update your browser or use a browser which supports the feature.");
        // https://caniuse.com/#feat=promises
        // Click here to see more information about browsers support Promise
        let theMoreInfo = d.createElement("a");
        theMoreInfo.text = "(Click here to see more information about browsers support Promise)";
        theMoreInfo.href = "https://caniuse.com/#feat=promises";
        theMoreInfo.target = "_blank";
        theElement.classList.add("text-feature-missing");
        theElement.parentNode.appendChild(d.createElement("br"));
        theElement.parentNode.appendChild(theMoreInfo);
    }
    theElement.appendChild(text);

    d.getElementById("commit-link").href = "https://github.com/" + window.appdata["github-repo"] + "/commits/master";

    d.querySelectorAll("a[character]").forEach(function (element, key, parent) {
        let theAttrVal = element.getAttribute("character");
        if (theAttrVal) {
            element.href = theAttrVal;
            let isEnabled = element.getAttribute("isEnabled");
            if (isEnabled && isEnabled === "false") {
                let reason = element.getAttribute("disable-reason");
                if (reason) {
                    element.addEventListener("click", function (e) {
                        e.preventDefault();
                        alert(reason);
                    });
                } else {
                    element.addEventListener("click", function (e) {
                        e.preventDefault();
                    });
                }
            }
        }
    });
})(window, document);

$(function () {
    let thelet_yep_totally_let = $("#sakura");
    if (typeof (thelet_yep_totally_let.sakura) === "function")
        thelet_yep_totally_let.sakura();

    var theTarget = $(".scrolling-wrapper-flexbox"),
        curDown = false,
        // curYPos = 0,
        curXPos = 0,
        mouseOutFunc = function () {
            curDown = false;
        };

    theTarget.mousemove(function (m) {
        if (curDown === true) {
            // theTarget.scrollTop(theTarget.scrollTop() + (curYPos - m.pageY));
            theTarget.scrollLeft(theTarget.scrollLeft() + (curXPos - m.pageX));
        }
    }).mousedown(function (m) {
        curDown = true;
        curYPos = m.pageY;
        curXPos = m.pageX;
    }).mouseleave(mouseOutFunc);

    $(window).mouseup(mouseOutFunc);
});