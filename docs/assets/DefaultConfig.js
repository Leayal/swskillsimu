(function (w) {
    'use strict'
    // modify the data here to your liking
    let app_data = {
            "github-repo": "Leayal/swskillsimu", // Set to null to let auto-detect from Github Page default URL, unreliable though
            maxCharacterLevel: 65 // Default max level will be used if the value cannot be found in a character's JSON data
        },
        // SP table.
        table_SkillPoint = {
            // Default SP for level up that is not found within the "Special" below
            DefaultSP: 2,

            // Special cases, specify an amount of SP to receive on these character levels
            Special: {
                // Should be all numbers, putting anything else at your own risk.
                // The format is: `[number] Level: [number] The amount of SP`
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 1,
                5: 3,
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                10: 5,
                15: 5,
                20: 10,
                25: 5,
                30: 5,
                35: 5,
                40: 10,
                45: 5,
                50: 5,
                55: 5,
                60: 5,
                61: 1,
                62: 1,
                63: 1,
                64: 1,
                65: 3,
            }
        },
        table_Character = {
            /*
            Should be as format below, putting anything else at your own risk.
            The format is: `[string] Character Name: [object] character property`
            + Character Name: Full name prefered, but can be anything.
            + Character property object contains 4 properties: ("enabled" can be omitted, "reason" can be omitted)
                                         url: The relative URL to the character's skill tree simulator page.
                                         selectImage: The big image of character selection on skill simulator's homepage.
                                                      Can be `null` to not use any image but doing so at your own risk
                                         enabled: Determine if the character is allowed to access or not. Default: true
                                                  (for example: the skill tree of said character is in building)
                                         reason: The reason when not enabled
            */
            "Haru Estia": {
                url: "haru",
                selectImage: "assets/images/HaruSelect.png"
            },
            "Erwin Arclight": {
                url: "erwin",
                selectImage: "assets/images/ErwinSelect.png"
            },
            "Lily Bloomerchen": {
                url: "lily",
                selectImage: "assets/images/LilySelect.png"
            },
            "Stella Unibell": {
                url: "stella",
                selectImage: "assets/images/StellaSelect.png"
            },
            "Jin Seipatsu": {
                url: "jin",
                selectImage: "assets/images/JinSelect.png"
            },
            "Iris Yuma": {
                url: "iris",
                selectImage: "assets/images/IrisSelect.png"
            },
            "Chii Aruel": {
                url: "someone",
                selectImage: "assets/images/ChiiSelect.png",
                enabled: false,
                reason: "Your waifu is not here"
            }
            "Ephnel": {
                url: "someone",
                selectImage: "assets/images/SomeoneSelect.png",
                enabled: false,
                reason: "Your waifu is not here"
            }
        };

    // Debug purpose. Don't modify unless you know what're you doing or testing something
    let debug_data = {
        use_h264: null, // False to force disable H264, true to force using H264, null to "use H264 if the web browser support it"
        use_vp9: null, // False to force disable VP9, true to force using VP9, null to "use VP9 if the web browser support it"
        videoPreviewPanelHeight: "170px" // The height of the panel which contains skill preview video
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

    let skillTreeData;
    if (!w.hasOwnProperty("SkillTreeData")) {
        skillTreeData = {};
        Object.defineProperty(w, "SkillTreeData", {
            value: skillTreeData,
            configurable: false,
            enumerable: true,
            writable: false
        });
    } else {
        skillTreeData = w.SkillTreeData;
    }

    Object.defineProperty(skillTreeData, "SkillPointTable", {
        value: deepFreeze(table_SkillPoint),
        configurable: false,
        enumerable: true,
        writable: false
    });

    Object.defineProperty(skillTreeData, "CharacterTable", {
        value: deepFreeze(table_Character),
        configurable: false,
        enumerable: true,
        writable: false
    });

    if (typeof (w.appdata) !== "object") {
        Object.defineProperty(w, "appdata", {
            value: Object.freeze(Object.assign({
                "github-repo": "Leayal/swskillsimu",
                maxCharacterLevel: 75,
                use_h264: null,
                use_vp9: null,
                videoPreviewPanelHeight: "170px"
            }, app_data, debug_data)),
            writable: false,
            configurable: false
        });
    }
})(window);
