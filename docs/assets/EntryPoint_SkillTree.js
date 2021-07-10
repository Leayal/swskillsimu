// Set up fallback for requestAnimationFrame function.
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
        return setTimeout(callback, 1000 / 60);
    };
// Set up fallback for cancelAnimationFrame function.
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function (callback) {
    clearTimeout(callback);
};

const mediaType = Object.freeze({
    webm_vp9: "video/webm; codecs=\"vp9\"",
    mp4_h264: "video/mp4; codecs=\"avc1.64001E\""
});
// type="video/mp4; codecs=\"avc1.64001E\""
let justSomeTemp1 = (function () {
    var aaaaaa = document.getElementsByTagName("video");
    if (aaaaaa.length !== 0) {
        return aaaaaa.item(0);
    } else {
        return document.createElement("video");
    }
})();
const SupportedCodec = deepFreeze({
    webm: {
        vp9: (function () {
            'use strict'
            if (typeof (window.appdata.use_vp9) === "boolean") {
                return window.appdata.use_vp9;
            }
            return (justSomeTemp1.canPlayType(mediaType.webm_vp9) === "probably");
        })()
    },
    mp4: {
        h264_highProfile: (function () {
            'use strict'
            if (typeof (window.appdata.use_h264) === "boolean") {
                return window.appdata.use_h264;
            }
            return (justSomeTemp1.canPlayType(mediaType.mp4_h264) === "probably");
        })()
    }
});
justSomeTemp1 = null;
const isPromiseSupported = (typeof (Promise) !== "undefined");

const previewOptions = (function () {
    'use strict'
    var result = {};
    result[window.SkillTreeData.Localization.Option.Selection_PreviewOff] = 0;
    result[window.SkillTreeData.Localization.Option.Selection_PreviewOn] = 1;
    result[window.SkillTreeData.Localization.Option.Selection_PreviewOn_Beta] = 2;
    return Object.freeze(result);
})();

const previewOptionExplains = (function () {
    'use strict'
    var result = {};
    result[previewOptions[window.SkillTreeData.Localization.Option.Selection_PreviewOff]] = window.SkillTreeData.Localization.Option.SelectionDescription_PreviewOff;
    result[previewOptions[window.SkillTreeData.Localization.Option.Selection_PreviewOn]] = window.SkillTreeData.Localization.Option.SelectionDescription_PreviewOn;
    result[previewOptions[window.SkillTreeData.Localization.Option.Selection_PreviewOn_Beta]] = window.SkillTreeData.Localization.Option.SelectionDescription_PreviewOn_Beta;
    return Object.freeze(result);
})();

(function (w, d) {
    'use strict'
    if (w.hasOwnProperty("SkillTreeData")) {
        if (w.SkillTreeData.hasOwnProperty("Localization")) {
            let myLocal = w.SkillTreeData.Localization;
            if (myLocal.Option.Button_SaveSettingToBrowser) {
                d.getElementById("saveSettingToBrowser").textContent = myLocal.Option.Button_SaveSettingToBrowser;
            }
            if (myLocal.Option.SkillPreviewHeader) {
                d.querySelector("#option_skillpreview span").textContent = myLocal.Option.SkillPreviewHeader;
            }
            if (myLocal.SkillTree.Button_Options) {
                d.getElementById("skillsimulatoroption").textContent = myLocal.SkillTree.Button_Options;
            }
            if (myLocal.SkillTree.Button_CopyLinkToCurrentSkillTree) {
                d.getElementById("copyURL").textContent = myLocal.SkillTree.Button_CopyLinkToCurrentSkillTree;
            }
            if (myLocal.SkillTree.Button_CopyLinkToCurrentSkillTreeAndShowSkillAssignment) {
                d.getElementById("copyURLshowassign").textContent = myLocal.SkillTree.Button_CopyLinkToCurrentSkillTreeAndShowSkillAssignment;
            }
            if (myLocal.SkillTree.Button_ResetAllSkills) {
                d.getElementById("resetAllSkill").textContent = myLocal.SkillTree.Button_ResetAllSkills;
            }
            if (myLocal.SkillTree.Button_SlotAssignment) {
                d.getElementById("slotassignment").textContent = myLocal.SkillTree.Button_SlotAssignment;
            }
            if (myLocal.SkillTree.RemainingSP) {
                d.getElementById("e_remainingSP").textContent = myLocal.SkillTree.RemainingSP;
            }
            if (myLocal.SkillTree.InvestedSP) {
                d.getElementById("e_investedSP").textContent = myLocal.SkillTree.InvestedSP;
            }
            if (myLocal.SkillTree.CharacterClass) {
                d.getElementById("classBoxtd").textContent = myLocal.SkillTree.CharacterClass;
            }
            if (myLocal.SkillTree.CharacterLevel) {
                d.getElementById("levelBoxtd").textContent = myLocal.SkillTree.CharacterLevel;
            }
            let e_morecharacterinfo = d.getElementById("morecharacterinfo");
            if (myLocal.SkillTree.MenuItem_MoreInfo) {
                e_morecharacterinfo.textContent = myLocal.SkillTree.MenuItem_MoreInfo;
            }
            if (myLocal.SkillTree.MenuItem_Home) {
                e_morecharacterinfo.nextElementSibling.textContent = myLocal.SkillTree.MenuItem_Home;
            }
            if (myLocal.General.WindowTitle) {
                d.title = myLocal.General.WindowTitle;
            }
        }

        if (w.SkillTreeData.hasOwnProperty("CharacterTable")) {
            let characterTable = w.SkillTreeData.CharacterTable,
                characterSelectList = d.querySelector("#charList"),
                characterSelectList_splitter = characterSelectList.querySelector("div.dropdown-divider");

            let characterNames = Object.keys(characterTable);

            for (let i = 0; i < characterNames.length; i++) {
                let characterData = characterTable[characterNames[i]];
                if (typeof (characterData) === "object" && (characterData.hasOwnProperty("url") && typeof (characterData.url) === "string" && characterData.url) && (!characterData.hasOwnProperty("enabled") || characterData.enabled)) {
                    let elementHyperlink = d.createElement("a");
                    elementHyperlink.classList.add("dropdown-item");
                    elementHyperlink.textContent = characterNames[i];

                    elementHyperlink.href = "../" + characterData.url;
                    characterSelectList.insertBefore(elementHyperlink, characterSelectList_splitter);
                }
            }
        }
    }
})(window, window.document);

function SetToolTip(obj) {
    obj.attr("tooltipframework", "0");
    return obj;
}

function SetToolTipUp(obj) {
    obj.attr("tooltipframework", "1");
    return obj;
}

function SetToolTipDown(obj) {
    obj.attr("tooltipframework", "-1");
    return obj;
}

function ChangeFileExtension() {
    if (arguments.length === 2) {
        let pos = arguments[0].lastIndexOf(".");
        if (pos === -1) {
            return (arguments[0] + arguments[1]);
        } else {
            return arguments[0].substr(0, pos) + arguments[1];
        }
    } else if (arguments.length === 3) {
        let pos = arguments[0].lastIndexOf(arguments[1]);
        if (pos === -1) {
            return (arguments[0] + arguments[2]);
        } else {
            return arguments[0].substr(0, pos) + arguments[2];
        }
    } else {
        return arguments[0];
    }
}

function IsExtension(filename, extension) {
    return (filename.lastIndexOf(extension) !== -1);
}

function ShowDangerDialog(msg, yesCallback, noCallback) {
    let dialog = new Bootstrap4ModalDialog($("#dialogs"), msg, "Warning", Bootstrap4ModalDialog.Buttons.YesNoDanger, Bootstrap4ModalDialog.Type.Danger);
    dialog.RegisterCallback(function (sender, val) {
        if (val) {
            if (typeof yesCallback === "function")
                yesCallback();
        } else {
            if (typeof noCallback === "function")
                noCallback();
        }
    });
    dialog.Show();
}

function ShowRetryDialog(jquery_format_msg, title, retryCallback) {
    let dialog = new Bootstrap4ModalDialog($("#dialogs"), jquery_format_msg, title, Bootstrap4ModalDialog.Buttons.Retry, Bootstrap4ModalDialog.Type.Warning);
    dialog.RegisterCallback(function (sender, val) {
        if (val && (typeof retryCallback === "function"))
            retryCallback();
    });
    dialog.Show();
}

function ShowMessageDialog(jquery_format_msg, okayCallback) {
    let dialog = new Bootstrap4ModalDialog($("#dialogs"), jquery_format_msg, "Notice", null, Bootstrap4ModalDialog.Type.Info);
    dialog.RegisterCallback(function (sender, val) {
        if (val && (typeof okayCallback === "function"))
            okayCallback();
    });
    dialog.Show();
}

function ShowConfirmDialog(msg, yesCallback, noCallback) {
    let dialog = new Bootstrap4ModalDialog($("#dialogs"), msg, "Double confirmation", Bootstrap4ModalDialog.Buttons.YesNo, Bootstrap4ModalDialog.Type.Primary);
    dialog.RegisterCallback(function (sender, val) {
        if (val) {
            if (typeof yesCallback === "function")
                yesCallback();
        } else {
            if (typeof noCallback === "function")
                noCallback();
        }
    });
    dialog.Show();
}

jQuery(document).ready(function ($) {
    // UI tricks
    var myBodeh = $(document.body);
    myBodeh.on("click", ".dropdown-menu.keep-open", function (e) {
        if (e)
            e.stopPropagation();
    });

    // Setup SkillTree's core
    const ____current_SkillCore = new SkillTreeCore();

    // Setting init
    window.SkillTreeSetting = {};
    var domtarget_skillsimulatoroption = $("#skillsimulatoroption"),
        domtarget_skillpreview = $("#option_skillpreview select"),
        domtarget_saveSetting = $("#saveSettingToBrowser"),
        popover_saveSetting = null,
        clipboardsupport = false;

    // Read setting
    let tmpSettingVal, defaultValue_SkillPreview = previewOptions["Show video (Beta)"];
    tmpSettingVal = SafeStorage.GetData("skilltree_firsttime");
    window.SkillTreeSetting.skilltree_firsttime = ((typeof (tmpSettingVal) === "string") ? parseInt(tmpSettingVal) : 1);
    tmpSettingVal = SafeStorage.GetData("skilltree_skillpreview");
    window.SkillTreeSetting.skilltree_skillpreview = ((typeof (tmpSettingVal) === "string") ? parseInt(tmpSettingVal) : defaultValue_SkillPreview);

    if (!previewOptionExplains.hasOwnProperty(window.SkillTreeSetting.skilltree_skillpreview))
        window.SkillTreeSetting.skilltree_skillpreview = defaultValue_SkillPreview;

    var skillpreview_explain = $("<span>").text(previewOptionExplains[window.SkillTreeSetting.skilltree_skillpreview]),
        popover_skillpreview = domtarget_skillpreview.popover({
            animation: true,
            placement: "right",
            trigger: "hover focus",
            html: true,
            content: skillpreview_explain
        });

    // Setting listeners
    domtarget_skillpreview.change(function () {
        window.SkillTreeSetting.skilltree_skillpreview = parseInt($(this).val());
        skillpreview_explain.text(previewOptionExplains[window.SkillTreeSetting.skilltree_skillpreview]);
        popover_skillpreview.popover("update");
    });

    for (let stringname in previewOptions) {
        if (previewOptions.hasOwnProperty(stringname)) {
            domtarget_skillpreview.append($("<option>").attr("value", previewOptions[stringname]).text(stringname));
        }
    }

    // Setting controls init
    if (typeof (window.SkillTreeSetting.skilltree_firsttime) === "undefined" || window.SkillTreeSetting.skilltree_firsttime === 1) {
        // First time visit the site or the user has never saved the setting to browser
        domtarget_skillsimulatoroption.addClass("highlight-red");
        popover_saveSetting = domtarget_saveSetting.popover({
            animation: true,
            placement: "right",
            trigger: "hover focus",
            content: window.SkillTreeData.Localization.Option.Tooltip_SaveToBrowser
        });

        domtarget_skillsimulatoroption.one("mouseover", function () {
            domtarget_skillsimulatoroption.removeClass("highlight-red");
        });
    }
    domtarget_skillpreview.val(window.SkillTreeSetting.skilltree_skillpreview);

    // Save Setting
    domtarget_saveSetting.click(function (e) {
        e.preventDefault();
        let link_localStorage = "<a href=\"https://www.w3schools.com/html/html5_webstorage.asp\" target=\"_blank\">localStorage</a>",
            link_cookie = "<a href=\"https://www.w3schools.com/js/js_cookies.asp\" target=\"_blank\">cookie</a>";

        if (popover_saveSetting) {
            popover_saveSetting.popover("hide");
            popover_saveSetting.on("hidden.bs.popover", function () {
                popover_saveSetting.popover("disable");
                popover_saveSetting.popover("dispose");
                popover_saveSetting = null;
            });
        }

        var func_save = function thisfunc() {
            try {
                for (let key in window.SkillTreeSetting) {
                    if (window.SkillTreeSetting.hasOwnProperty(key)) {
                        SafeStorage.SetData(key, window.SkillTreeSetting[key]);
                    }
                }
                shownotify(window.SkillTreeData.Localization.Option.OptionSavedToBrowser, "success");
            } catch (ex) {
                ShowDangerDialog($("<div>")
                    .append($("<span>").text("Error: " + ex))
                    .append($("<br/>"))
                    .append($("<span>").text(window.SkillTreeData.Localization.Option.SaveSettingToBrowserRetry)),
                    function () {
                        thisfunc();
                    });
            }
        };
        if (window.SkillTreeSetting.skilltree_firsttime === 0) {
            func_save();
        } else {
            var myfunc = function (event) {
                    if (typeof (event.stopPropagation) === "function")
                        event.stopPropagation();
                },
                dialogContent = $("<p>" + window.SkillTreeData.Localization.Option.SaveSettingToBrowser.fformat(link_localStorage, link_cookie) + "</p>")
                .on("click", "a", myfunc);

            ShowConfirmDialog(dialogContent, function () {
                window.SkillTreeSetting.skilltree_firsttime = 0;
                dialogContent.off("click", "a", myfunc);
                func_save();
            }, function () {
                dialogContent.off("click", "a", myfunc);
            });
        }
    });

    // Clipboard API init
    if (ClipboardJS && ClipboardJS.isSupported()) {
        let clipboard = new ClipboardJS(".btncopymagicclass");
        clipboardsupport = true;
        clipboard.on("success", function (e) {
            window.shownotify(window.SkillTreeData.Localization.General.ClipboardSuccess, 'success');
        });
        clipboard.on("error", function (e) {
            let divthingie = $("<div>");
            divthingie.append($("<p>").text(window.SkillTreeData.Localization.General.ClipboardAccessFailure + ":"));
            divthingie.append($("<input>").attr("type", "text").css({
                width: "100%"
            }).prop("readonly", true).val(e.text).click(function () {
                $(this).select();
            }));
            window.ShowMessageDialog(divthingie);
        });
    } else {
        clipboardsupport = false;
    }

    let copyLink = function (_url) {
        if (clipboardsupport) {
            var asdDiv = $("<div>").addClass("hiddendiv");
            var asdButton = $("<button>").addClass("btncopymagicclass").attr("data-clipboard-text", encodeURI(_url));
            asdDiv.append(asdButton);
            $(document.body).append(asdDiv);
            asdButton.trigger("click");
            asdDiv.remove();
            return true;
        } else {
            var divthingie = $("<div>");
            divthingie.append($("<p>").text(window.SkillTreeData.Localization.General.ClipboardAccessFailure + ":"));
            divthingie.append($("<input>").attr("type", "text").css({
                width: "100%"
            }).prop("readonly", true).val(_url).click(function () {
                $(this).select();
            }));
            window.ShowMessageDialog(divthingie);
            return false;
        }
    }

    let ShowSkillAssignment = function (closeCallback) {
        if (!____current_SkillCore) return;

        let dialog = new Bootstrap4ModalDialog($("#dialogs"), ____current_SkillCore.GetSkillAssignmentRender(), window.SkillTreeData.Localization.SkillSlot.SkillSlotAssignmentDialogHeader, [{
                label: window.SkillTreeData.Localization.SkillSlot.ButtonResetAssignment,
                cssClass: "btn btn-warning",
                action: function (dialogitself) {
                    window.ShowDangerDialog(window.SkillTreeData.Localization.SkillSlot.Prompt_ResetAssignment, function () {
                        ____current_SkillCore.ResetSlotAssignment();
                    });
                }
            },
            {
                label: window.SkillTreeData.Localization.General.ButtonClose,
                cssClass: "btn btn-default",
                action: function (dialogitself) {
                    dialogitself.Hide();
                    if (typeof (closeCallback) === "function") {
                        closeCallback();
                    }
                }
            }
        ], Bootstrap4ModalDialog.Type.Success);
        dialog.Show();
    }

    let ReRenderTree = function (characterclassinfo) {
        if (typeof (____current_SkillCore.RenderTree) !== "function") return;
        if (!characterclassinfo) throw "characterclassinfo is null";

        ____current_SkillCore.RenderTree(function () {
            let target = $("img.image-bg-character");
            if (target)
                target.remove();

            if (characterclassinfo.Cover) {
                var pos;
                if (characterclassinfo.Position) {
                    pos = characterclassinfo.Position;
                } else {
                    pos = "side-right";
                }
                $("#forbackground").append(
                    $("<img>").addClass(["image-bg-character", pos]).attr("src", characterclassinfo.Cover).imagesLoaded().always(function (instance) {
                        instance.elements.forEach(function (element, index, arr) {
                            $(element).addClass("animated fadeIn").show();
                        });
                    }).hide()
                );
            }
        }, true);
    }

    // Dialog API init
    var dialogObject = $("#dialogs");
    dialogObject.hide().click(function (e) {
        e.preventDefault();
        window.DialogManager.CloseForegroundDialog();
    });
    window.DialogManager.OnModalChanged(function (val) {
        if (val)
            dialogObject.show();
        else
            dialogObject.hide();
    });
    SetLoading(myBodeh);

    // Tooltip Framework init

    var tooltipObj = $("#tooltip"),
        tooltipHeader = $("#tooltip .tooltipheader"),
        tooltippreviewPanel = $("#tooltip #skillpreview").css("height", window.appdata.videoPreviewPanelHeight),
        tooltippreviewPanel_video_raw = document.querySelector("#tooltip #skillpreview video"),
        tooltippreviewPanel_video = $(tooltippreviewPanel_video_raw).css({
            height: window.appdata.videoPreviewPanelHeight
        }),
        tooltipText = $("#tooltip pre"),
        navBarBottom = $(".navbar.fixed-bottom"),
        toolTipFramework = new SkillTreeToolTipFramework(tooltipObj, "[tooltipframework][insight]");
    tooltipObj.detach();

    if (isPromiseSupported) {
        tooltippreviewPanel_video.on("error", function () {
            tooltippreviewPanel.hide();
        }).on("canplay", async function (event) {
            try {
                await event.target.play();
            } catch (err) {
                tooltippreviewPanel.hide();
                toolTipFramework.UpdateTooltipSize();
            }
        });
    } else {
        if (tooltippreviewPanel_video) {
            tooltippreviewPanel_video.remove();
            tooltippreviewPanel_video = null;
        }
    }

    toolTipFramework.OnMouseEnter.Register(function (event) {
        let key = $(event.target).attr("insight");
        if (key) {
            let tooltipInfoType = $(event.target).attr("tooltipframework");

            if (isNaN(tooltipInfoType)) {
                event.cancel = true;
                return;
            }

            // StringBuilder in the nutshell
            let stringbuilder = [],
                skillinfoooo = ____current_SkillCore.GetSkill(key),
                currentEffect = skillinfoooo.GetCurrentLevelInfo(),
                // No, not Adobe's AfterEffect reference.
                afterEffect = null;

            tooltipHeader.text(skillinfoooo.GetName());

            let previewinfo = currentEffect.PreviewInfo;

            toolTipFramework.SetBound(0, 0, 0, navBarBottom.outerHeight(true) || 0);
            // tooltippreviewPanel.hide();

            if (isPromiseSupported && tooltippreviewPanel_video && (window.SkillTreeSetting.skilltree_skillpreview !== previewOptions[window.SkillTreeData.Localization.Option.Selection_PreviewOff]) && previewinfo) {
                let hasVP9 = (typeof (previewinfo.Video.vp9) === "string"),
                    hasH264 = (typeof (previewinfo.Video.h264) === "string");

                if (hasVP9 || hasH264) {
                    // Show preview video if it has one
                    let _attributes = {
                        src: null
                    };

                    if ((window.SkillTreeSetting.skilltree_skillpreview === previewOptions[window.SkillTreeData.Localization.Option.Selection_PreviewOn_Beta]) && hasVP9 && SupportedCodec.webm.vp9) {
                        // Main feed: a WebM container with VP9 codec with 420p pixel format
                        _attributes.src = previewinfo.Video.vp9;
                        _attributes.type = mediaType.webm_vp9;
                    } else if (hasH264 && SupportedCodec.mp4.h264_highProfile) {
                        // Provide fallback to MP4 container with codec H264 with 420p pixel format
                        _attributes.src = previewinfo.Video.h264;
                        _attributes.type = mediaType.mp4_h264;
                    }

                    if (typeof (_attributes.src) === "string") {
                        if (_attributes.src !== tooltippreviewPanel_video_raw.currentSrc) {
                            tooltippreviewPanel_video.attr(_attributes);
                            tooltippreviewPanel.show();
                            // tooltippreviewPanel_video.trigger("load");
                            // Trigger first time
                            tooltippreviewPanel_video_raw.muted = true;
                            tooltippreviewPanel_video_raw.play();
                        }
                    } else {
                        tooltippreviewPanel.hide();
                    }
                    // } else if (typeof (previewinfo.Image) === "string") {
                    // Show preview image if it has one
                    // $("<img>").attr({ width: "240", height: "auto", src: previewinfo.Image }).appendTo(tooltippreviewPanel);
                } else {
                    if (!tooltippreviewPanel_video_raw.paused) {
                        tooltippreviewPanel_video.trigger("pause");
                    }
                    tooltippreviewPanel.hide();
                }
            } else {
                if (tooltippreviewPanel_video) {
                    if (!tooltippreviewPanel_video_raw.paused) {
                        tooltippreviewPanel_video.trigger("pause");
                    }
                }
                tooltippreviewPanel.hide();
            }

            tooltipInfoType = parseInt(tooltipInfoType);
            switch (tooltipInfoType) {
                case -1:
                    // Mean skill level down
                    afterEffect = skillinfoooo.GetPreviousLevelInfo();
                    if (currentEffect || afterEffect) {
                        let before = currentEffect.SkillEffect;
                        let after = "";
                        if (afterEffect) after = afterEffect.SkillEffect;
                        stringbuilder.push("[" + window.SkillTreeData.Localization.ToolTip.CurrentHeader + "]");
                        if (before) {
                            stringbuilder.push("\n");
                            stringbuilder.push(before);
                        } else {
                            stringbuilder.push("\n<" + window.SkillTreeData.Localization.ToolTip.NoInfoAvailable + ">");
                        }
                        stringbuilder.push("\n\n[" + window.SkillTreeData.Localization.ToolTip.AfterHeader + "]");
                        if (after) {
                            stringbuilder.push("\n");
                            stringbuilder.push(after);
                        } else {
                            stringbuilder.push("\n<" + window.SkillTreeData.Localization.ToolTip.NoInfoAvailable + ">");
                        }
                    }
                    break;
                case 0:
                    // Mean skill viewing description only
                    if (currentEffect) {
                        let desc = currentEffect.SkillDescription;
                        let eff = currentEffect.SkillEffect;
                        if (desc) {
                            stringbuilder.push("[" + window.SkillTreeData.Localization.ToolTip.SkillDescriptionHeader + "]\n");
                            stringbuilder.push(desc);
                        }
                        if (eff) {
                            if (stringbuilder.length !== 0) {
                                stringbuilder.push("\n\n");
                            }
                            stringbuilder.push("[" + window.SkillTreeData.Localization.ToolTip.SkillEffectHeader + "]\n");
                            stringbuilder.push(eff);
                        }
                    }
                    break;
                case 1:
                    // Mean skill level up
                    afterEffect = skillinfoooo.GetNextLevelInfo();
                    if (currentEffect || afterEffect) {
                        let before = currentEffect.SkillEffect;
                        let after = "";
                        if (afterEffect) after = afterEffect.SkillEffect;
                        stringbuilder.push("[" + window.SkillTreeData.Localization.ToolTip.CurrentHeader + "]");
                        if (before) {
                            stringbuilder.push("\n");
                            stringbuilder.push(before);
                        } else {
                            stringbuilder.push("\n<" + window.SkillTreeData.Localization.ToolTip.NoInfoAvailable + ">");
                        }
                        stringbuilder.push("\n\n[" + window.SkillTreeData.Localization.ToolTip.AfterHeader + "]");
                        if (after) {
                            stringbuilder.push("\n");
                            stringbuilder.push(after);
                        } else {
                            stringbuilder.push("\n<" + window.SkillTreeData.Localization.ToolTip.NoInfoAvailable + ">");
                        }
                    }
                    break;
                default:
                    // How can I supposed to be here????
                    event.cancel = true;
                    return;
            }
            if (stringbuilder !== 0) {
                tooltipText.text(stringbuilder.join("")).show();
            } else {
                tooltipText.empty().hide();
            }
            tooltipObj.insertAfter(dialogObject);
        }
    });
    toolTipFramework.OnTooltipHidden.Register(function (targetDOM) {
        if (tooltippreviewPanel_video) {
            if (!tooltippreviewPanel_video_raw.paused) {
                tooltippreviewPanel_video.trigger("pause");
            }
        }
        tooltipObj.detach();
    });
    toolTipFramework.StartListen();

    // Skill tree init
    $('#charList a[href$="/' + GetCurrentFolderUrl() + '"]').remove();
    $("#copyURL").click(function (e) {
        e.preventDefault();
        var link = ____current_SkillCore.GenerateLink();
        if (link) {
            copyLink(link);
        }
    });
    $("#copyURLshowassign").click(function (e) {
        e.preventDefault();
        var link = ____current_SkillCore.GenerateLink(true);
        if (link) {
            copyLink(link);
        }
    });
    $("#resetAllSkill").click(function () {
        ShowDangerDialog(window.SkillTreeData.Localization.Prompt.ResetSkill, function () {
            ____current_SkillCore.UnlearnAllSkills();
        });
    });
    $("#slotassignment").click(function () {
        ShowSkillAssignment();
    });
    var cached_querstring = new URLSearchParams(window.location.search),
        showassignment = cached_querstring.get("sa"),
        clevel = cached_querstring.get("lv") || cached_querstring.get("level") || window.appdata.maxCharacterLevel,
        param_selectedclass = cached_querstring.get("c") || ____current_SkillCore.GetAvailableClassIndex();

    ____current_SkillCore.ReadTree(function (data) {
            if (isNaN(clevel)) {
                clevel = ____current_SkillCore.maxCharacterLevel;
            } else {
                clevel = Math.min(clevel, ____current_SkillCore.maxCharacterLevel);
            }
            param_selectedclass = Math.min(param_selectedclass, ____current_SkillCore.GetAvailableClassIndex());
            let allClasses = ____current_SkillCore.GetClasses();
            for (var classIndex in allClasses) {
                if (!allClasses[classIndex].RequiredLevel || allClasses[classIndex].RequiredLevel <= clevel) {
                    param_selectedclass = classIndex;
                } else {
                    break;
                }
            }
            if (isNaN(param_selectedclass)) {
                param_selectedclass = 0;
            }

            let level_selecting = $("<select>").attr("id", "selectLevelBox").change(function () {
                var selectedlevel = $(this).val();
                if (____current_SkillCore.SetLevel(selectedlevel)) {
                    clevel = selectedlevel;
                } else {
                    $(this).val(clevel);
                }
            });
            for (let i = 1; i <= ____current_SkillCore.maxCharacterLevel; i++)
                level_selecting.append($("<option>").val(i).text(i));
            $("#levelBoxtd").append(level_selecting);
            level_selecting.val(clevel);

            let class_selecting = $("<select>").attr("id", "selectClassBox").change(function () {
                var selectedclass = $(this).val();
                let changingclassinfo = ____current_SkillCore.GetClass(selectedclass);
                if (____current_SkillCore.IsSelectiveClass(selectedclass)) {
                    ShowConfirmDialog($("<p>" + window.SkillTreeData.Localization.Prompt.ChangeClass + "</p>"), function () {
                        ____current_SkillCore.UnlearnAllSkills();
                        if (____current_SkillCore.SetSelectedClass(selectedclass)) {
                            param_selectedclass = selectedclass;
                            ReRenderTree(____current_SkillCore.GetSelectedClass());
                        } else {
                            $("#selectClassBox").val(param_selectedclass);
                        }
                    }, function () {
                        $("#selectClassBox").val(param_selectedclass);
                    });
                } else {
                    shownotify(window.SkillTreeData.Localization.Notify.ClassRequireCharacterLevel.fformat(((changingclassinfo && changingclassinfo.RequiredLevel) ? changingclassinfo.RequiredLevel : "????")), 'info');
                    $("#selectClassBox").val(param_selectedclass);
                }
            });
            if (data.hasOwnProperty("AvailableClass")) {
                for (var item in data.AvailableClass) {
                    if (data.AvailableClass.hasOwnProperty(item)) {
                        class_selecting.append($("<option>").val(item).text(data.AvailableClass[item].Name || "Unknown"));
                    }
                }
            } else {
                class_selecting.append($("<option>").val(0).text(window.SkillTreeData.Localization.General.DefaultCharacterClassName));
            }
            $("#classBoxtd").append(class_selecting);
        },
        function (isCompleted, statusText, errorThrown) {
            RemoveLoading(myBodeh);
            if (isCompleted === false) {
                ShowRetryDialog($("<span>Unknown internet error occurred: " + errorThrown + "<br/>Do you want to retry?</span>"), function () {
                    PageReload();
                });
            } else {
                let classrequiredlv = ____current_SkillCore.GetClass(param_selectedclass).RequiredLevel || 0;
                if (clevel < classrequiredlv) {
                    shownotify(window.SkillTreeData.Localization.Notify.ClassRequireCharacterLevel.fformat(((changingclassinfo && changingclassinfo.RequiredLevel) ? changingclassinfo.RequiredLevel : "????")), 'info');
                    clevel = classrequiredlv;
                }
                // Correct it again in case people messed it up
                ____current_SkillCore.SetCharacterInfo(clevel, param_selectedclass);

                let level_selecting = $("#selectLevelBox");
                level_selecting.val(clevel);
                let class_selecting = $("#selectClassBox");
                class_selecting.val(param_selectedclass);
                //class_selecting.trigger("change");

                ReRenderTree(____current_SkillCore.GetClass(param_selectedclass));

                // Read the info from URL string. This is for loading the shared link.
                for (let skill_id_name in ____current_SkillCore.SkillList) {
                    if (____current_SkillCore.SkillList.hasOwnProperty(skill_id_name)) {
                        let tmpvalue = ____current_SkillCore.SkillList[skill_id_name];
                        if (tmpvalue._availablelevel <= clevel && tmpvalue.IsClassAvailable(param_selectedclass)) {
                            cached_querstring.get(tmpvalue.GetID())
                            let paraminfo = cached_querstring.get(tmpvalue.GetID());
                            if (!paraminfo && tmpvalue.ShortID)
                                paraminfo = cached_querstring.get(tmpvalue.ShortID);
                            if (!paraminfo) paraminfo = tmpvalue.GetDefaultLevel();
                            tmpvalue.SetCurrentSkillLevel(paraminfo);
                        } else {
                            tmpvalue.SetCurrentSkillLevel(0);
                        }
                    }
                }

                ____current_SkillCore.ReadAssignment();
                if (showassignment === "1")
                    $("#slotassignment").click();
            }
        });
});
