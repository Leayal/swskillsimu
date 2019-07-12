(function (w) {
    'use strict'
    // modify the data here to your liking
    let app_data = {
            "github-repo": "Leayal/swskillsimu", // Set to null to let auto-detect from Github Page default URL, unreliable though
            maxCharacterLevel: 65 // Default max level will be used if the value cannot be found in a character's JSON data
        },
        // Debug purpose. Don't modify unless you know what're you doing
        debug_data = {
            use_h264: null, // False to force disable H264, true to force using H264, null to "use H264 if the web browser support it"
            use_vp9: null // False to force disable VP9, true to force using VP9, null to "use VP9 if the web browser support it"
        };

    // Do not modify anything below this line

    if (!app_data["github-repo"]) {
        // This whole thing is untested, trust auto-detect at your own risk
        let currentHost = w.document.location.hostname;
        if (currentHost.endsWith("github.io")) {
            let username = currentHost.substring(0, currentHost.length - ".github.io".length),
                repoName = w.document.location.pathname;
            if (repoName === "/") {
                repoName = w.document.location.hostname;
            } else {
                repoName = repoName.ctrim("\/");
                let slashFound = repoName.indexOf("/");
                if (slashFound !== -1) {
                    repoName = repoName.substr(0, slashFound);
                }
            }
            app_data["github-repo"] = username + "/" + repoName;
        } else {
            delete app_data["github-repo"];
        }
    }
    let myAppData;
    if (typeof (w.appdata) !== "object") {
        Object.defineProperty(w, "appdata", {
            value: Object.freeze(Object.assign({
                "github-repo": "Leayal/swskillsimu",
                maxCharacterLevel: 75
            }, app_data, debug_data)),
            writable: false,
            configurable: false
        });
    }
})(window);