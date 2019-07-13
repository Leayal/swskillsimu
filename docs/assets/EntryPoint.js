(function (w, d) {
    'use strict'
    d.querySelectorAll("a[github-button-type]").forEach(function (element, key, parent) {
        let theAttrVal = element.getAttribute("github-button-type");
        element.removeAttribute("github-button-type");
        if (theAttrVal) {
            if (theAttrVal === "fork") {
                element.href = "https://github.com/" + w.appdata["github-repo"] + "/fork";
            } else if (theAttrVal === "issues") {
                element.href = "https://github.com/" + w.appdata["github-repo"] + "/issues";
                element.setAttribute("data-icon", "octicon-issue-opened");
            } else if (theAttrVal === "download") {
                element.href = "https://github.com/" + w.appdata["github-repo"] + "/archive/master.zip";
                element.setAttribute("data-icon", "octicon-cloud-download");
            }
        }
    });

    let jsRequiredElements = d.querySelectorAll(".require-js");
    if (jsRequiredElements && jsRequiredElements.length !== 0) {
        jsRequiredElements.forEach(function (element) {
            element.classList.remove("require-js");
        });
    }
})(window, window.document);